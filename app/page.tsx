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
import html2pdf from 'html2pdf.js'
import { DEFAULT_MARKDOWN } from "../components/defaultMarkdown";

// Custom hook for debouncing values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default function MarkdownViewer() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN)
  const debouncedMarkdown = useDebounce(markdown, 300)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [activeTab, setActiveTab] = useState<string>("editor")

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleExport = (format: 'md' | 'html' | 'pdf') => {
    switch (format) {
      case 'md':
        // Export as markdown (existing functionality)
        const mdBlob = new Blob([markdown], { type: "text/markdown" })
        const mdUrl = URL.createObjectURL(mdBlob)
        downloadFile(mdUrl, "document.md")
        break
        
      case 'html':
        // Export as HTML
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Exported Markdown</title>
            <style>
              body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #000; background-color: #fff; }
              pre { background-color: #f5f5f5; padding: 16px; border-radius: 4px; overflow-x: auto; }
              code { font-family: monospace; }
              img { max-width: 100%; }
              a { color: #0066cc; }
              blockquote { border-left: 4px solid #ddd; padding-left: 1rem; margin-left: 0; color: #444; }
            </style>
          </head>
          <body>
            ${document.querySelector('.prose')?.innerHTML || ''}
          </body>
          </html>
        `
        const htmlBlob = new Blob([htmlContent], { type: "text/html" })
        const htmlUrl = URL.createObjectURL(htmlBlob)
        downloadFile(htmlUrl, "document.html")
        break
        
      case 'pdf':
        const element = document.querySelector('.prose')
        if (element) {
          const clonedElement = element.cloneNode(true) as HTMLElement
          const tempContainer = document.createElement('div')
          tempContainer.appendChild(clonedElement)
          
          tempContainer.style.color = '#000'
          tempContainer.style.backgroundColor = '#fff'
          const textElements = tempContainer.querySelectorAll('*')
          textElements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.color = '#000'
              if (el.tagName === 'CODE' || el.tagName === 'PRE') {
                el.style.backgroundColor = '#f5f5f5'
              }
              if (el.tagName === 'A') {
                el.style.color = '#0066cc'
              }
              if (el.tagName === 'BLOCKQUOTE') {
                el.style.color = '#444'
              }
            }
          })
          
          const opt = {
            margin: 10,
            filename: 'document.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          }
          
          html2pdf().set(opt).from(tempContainer).save().then(() => {
            document.body.removeChild(tempContainer)
          })
        }
        break
    }
  }

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
            <h1 className="text-xl font-bold">Markdown Viewer</h1>
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
                      code: ({ node, inline, className, children, ...props }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode }) => {
                        const match = /language-(\w+)/.exec(className || "")
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={theme === "dark" ? vscDarkPlus : vs}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              backgroundColor: 'var(--syntax-bg)',
                              margin: 0,
                              padding: '1rem',
                            }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      },
                    }}
                  >
                    {debouncedMarkdown}
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
                      code: ({ node, inline, className, children, ...props }: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode }) => {
                        const match = /language-(\w+)/.exec(className || "")
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={theme === "dark" ? (vscDarkPlus as any) : (vs as any)}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              backgroundColor: 'var(--syntax-bg)',
                              margin: 0,
                              padding: '1rem',
                            }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      },
                    }}
                  >
                    {debouncedMarkdown}
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
