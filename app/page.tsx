"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { Download, Moon, Sun, FileText, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import "@/styles/syntax-highlighter.css"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import type html2pdf from 'html2pdf.js'
import { DEFAULT_MARKDOWN } from "../components/defaultMarkdown";

export default function MarkdownViewer() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [activeTab, setActiveTab] = useState<string>("editor")
  const [html2pdfLib, setHtml2pdfLib] = useState<any>(null)

  // Load HTML2PDF library
  useEffect(() => {
    setMounted(true)
    import('html2pdf.js')
      .then(module => {
        setHtml2pdfLib(module.default || module)
      })
      .catch(err => {
        console.error("Failed to load html2pdf.js:", err)
      })
  }, [])

  // Syntax highlighter component with current theme
  const createSyntaxHighlighter = (props: any) => {
    const { node, inline, className, children, ...restProps } = props;
    const match = /language-(\w+)/.exec(className || "");
    
    return !inline && match ? (
      <SyntaxHighlighter
        style={theme === "dark" ? vscDarkPlus : vs}
        language={match[1]}
        PreTag="div"
        customStyle={{
          backgroundColor: 'transparent',
          margin: 0,
          padding: '0',
        }}
        codeTagProps={{
          style: {
            fontFamily: "monospace",
            fontSize: "90%",
          }
        }}
        {...restProps}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...restProps}>
        {children}
      </code>
    );
  };

  const handleExport = (format: 'md' | 'html' | 'pdf') => {
    switch (format) {
      case 'md':
        // Direct markdown export
        const mdBlob = new Blob([markdown], { type: "text/markdown" })
        const mdUrl = URL.createObjectURL(mdBlob)
        downloadFile(mdUrl, "document.md")
        break
        
      case 'html':
        // HTML export using current markdown
        // Create a container for rendering
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        document.body.appendChild(container);
        
        // Use ReactDOM to directly render the content
        const ReactDOMServer = require('react-dom/server');
        
        // Render the markdown content to HTML
        const htmlContent = ReactDOMServer.renderToString(
          <div className="markdown-body">
            <ReactMarkdown
              components={{
                code: (props) => createSyntaxHighlighter(props)
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        );
        
        // Create full HTML document with styling
        const fullHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Exported Markdown</title>
            <style>
              body { font-family: system-ui, sans-serif; max-width: 800px; margin: 20px auto; padding: 20px; color: #000; background-color: #fff; }
              pre { background-color: #f5f5f5; padding: 16px; border-radius: 4px; overflow-x: auto; border: 1px solid #eee; }
              code { font-family: monospace; }
              img { max-width: 100%; height: auto; }
              a { color: #0066cc; text-decoration: none; }
              a:hover { text-decoration: underline; }
              blockquote { border-left: 4px solid #ddd; padding-left: 1rem; margin-left: 0; color: #555; font-style: italic; }
              table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f9f9f9; }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
          </html>
        `;
        
        // Create and download the HTML file
        const htmlBlob = new Blob([fullHtml], { type: "text/html" });
        const htmlUrl = URL.createObjectURL(htmlBlob);
        downloadFile(htmlUrl, "document.html");
        
        // Clean up
        document.body.removeChild(container);
        break;
        
      case 'pdf':
        if (!html2pdfLib) {
          alert("PDF generation library is still loading. Please try again.");
          return;
        }
        
        // Generate unique ID to prevent caching between exports
        const exportId = `pdf-export-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        
        // Create a fresh container with unique ID for each export
        const pdfContainer = document.createElement('div');
        pdfContainer.id = exportId;
        pdfContainer.className = 'pdf-export-container';
        pdfContainer.style.position = 'absolute';
        pdfContainer.style.left = '-9999px';
        pdfContainer.style.width = '800px'; // Fixed width for PDF
        document.body.appendChild(pdfContainer);
        
        // Use server-side rendering first to get the HTML with current markdown
        const ReactDOMServerPdf = require('react-dom/server');
        const markdownHtml = ReactDOMServerPdf.renderToString(
          <div className="markdown-body">
            <ReactMarkdown
              components={{
                code: (props) => createSyntaxHighlighter(props)
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        );
        
        // Insert the HTML into the container
        pdfContainer.innerHTML = markdownHtml;
        
        // Create a fresh document for PDF with unique ID
        const pdfDoc = document.createElement('div');
        pdfDoc.id = `pdf-doc-${exportId}`;
        pdfDoc.innerHTML = `
          <style>
            @page { margin: 15mm; }
            body { 
              font-family: system-ui, sans-serif; 
              color: #000; 
              background-color: #fff;
              padding: 0;
              margin: 0;
            }
            h1, h2, h3, h4, h5, h6 { 
              color: #000; 
              margin-top: 1.5em;
              margin-bottom: 0.75em;
            }
            h1 { font-size: 1.8em; }
            h2 { font-size: 1.5em; }
            h3 { font-size: 1.3em; }
            p { margin: 1em 0; line-height: 1.5; }
            pre { 
              background-color: #f5f5f5; 
              padding: 16px; 
              border-radius: 4px; 
              overflow-x: auto; 
              border: 1px solid #eee;
              margin: 1em 0;
              white-space: pre-wrap;
            }
            code { 
              font-family: monospace;
              background-color: #f5f5f5;
              padding: 0.2em 0.4em;
              border-radius: 3px;
              font-size: 85%;
            }
            pre code {
              background-color: transparent;
              padding: 0;
              border-radius: 0;
              font-size: 100%;
            }
            img { max-width: 100%; height: auto; }
            a { color: #0066cc; text-decoration: none; }
            blockquote { 
              border-left: 4px solid #ddd; 
              padding-left: 1rem; 
              margin-left: 0; 
              color: #555; 
              font-style: italic; 
            }
            table { border-collapse: collapse; width: 100%; margin-bottom: 1rem; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f9f9f9; }
            ul, ol { padding-left: 2em; margin: 1em 0; }
            li { margin-bottom: 0.5em; }
          </style>
          <div class="markdown-content">
            ${pdfContainer.innerHTML}
          </div>
        `;
        
        // PDF generation options with unique filename to prevent caching
        const pdfOptions = {
          margin: [10, 10, 10, 10],
          filename: `document-${Date.now().toString().substring(6)}.pdf`,
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true,
            logging: false, // Disable logging
            allowTaint: true // Allow tainted canvas
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Force a slight delay to ensure DOM is fully updated
        setTimeout(() => {
          // Create a new instance of html2pdf for each export to prevent caching
          const html2pdfInstance = html2pdfLib.Worker ? new html2pdfLib.Worker() : html2pdfLib;
          
          // Generate and download the PDF with a fresh instance
          html2pdfInstance.from(pdfDoc).set(pdfOptions).save()
            .then(() => {
              // Clean up DOM elements
              if (document.body.contains(pdfContainer)) {
                document.body.removeChild(pdfContainer);
              }
              // Force garbage collection by nullifying
              pdfContainer.innerHTML = '';
              pdfDoc.innerHTML = '';
            })
            .catch((err: Error) => {
              console.error("Error generating PDF:", err);
              if (document.body.contains(pdfContainer)) {
                document.body.removeChild(pdfContainer);
              }
              alert("Failed to generate PDF. Please try again.");
            });
        }, 50);
        
        break;
    }
  };

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold">MDviwr</h1>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('md')}>
                  Markdown (.md)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('html')}>
                  HTML (.html)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  PDF (.pdf)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open("https://mohammad.is-a.dev", "_blank", "noopener,noreferrer")}
              >
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {isMobile ? (
        <div className="flex-1 p-4">
          <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="h-[calc(100vh-140px)]">
              <div className="h-full rounded-md border">
                <textarea
                  className="w-full h-full p-4 resize-none focus:outline-none bg-background rounded-md"
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="Type your markdown here..."
                />
              </div>
            </TabsContent>
            <TabsContent value="preview" className="h-[calc(100vh-140px)]">
              <div className="h-full overflow-auto p-4 rounded-md border">
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      code: (props) => createSyntaxHighlighter(props)
                    }}
                  >
                    {markdown}
                  </ReactMarkdown>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <main className="flex-1 p-4 container mx-auto">
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="h-[calc(100vh-140px)] rounded-md border shadow-sm overflow-hidden">
              <div className="bg-muted/40 px-4 py-2 border-b font-medium text-sm">Editor</div>
              <textarea
                className={cn(
                  "w-full h-full p-4 resize-none focus:outline-none bg-background",
                  "font-mono text-sm",
                )}
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Type your markdown here..."
              />
            </div>
            <div className="h-[calc(100vh-140px)] rounded-md border shadow-sm overflow-auto">
              <div className="bg-muted/40 px-4 py-2 border-b font-medium text-sm">Preview</div>
              <div className="h-full p-4">
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      code: (props) => createSyntaxHighlighter(props)
                    }}
                  >
                    {markdown} 
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}