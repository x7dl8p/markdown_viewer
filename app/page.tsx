"use client";

import { useState, useEffect } from "react";
import { DEFAULT_MARKDOWN } from "@/components/defaultMarkdown";
import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/cjs/styles/prism";
import MarkdownEditor from "@/components/MarkdownEditor";
import MarkdownPreview from "@/components/MarkdownPreview";
import Header from "@/components/Header";

export default function MarkdownViewer() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [html2pdfLib, setHtml2pdfLib] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    import("html2pdf.js")
      .then((module) => {
        setHtml2pdfLib(module.default || module);
      })
      .catch((err) => {
        console.error("Failed to load html2pdf.js:", err);
      });
  }, []);

  const createSyntaxHighlighter = (props: { node?: any; inline?: boolean; className?: string; children?: React.ReactNode }) => {
    const { node, inline, className, children, ...restProps } = props;
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={theme === "dark" ? vscDarkPlus : vs}
        language={match[1]}
        PreTag="div"
        customStyle={{
          backgroundColor: "transparent",
          margin: 0,
          padding: "0",
        }}
        codeTagProps={{
          style: {
            fontFamily: "monospace",
            fontSize: "90%",
          },
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
  const handleExport = (format: "md" | "html" | "pdf") => {
    switch (format) {
      case 'md':
        const mdBlob = new Blob([markdown], { type: "text/markdown" });
        const mdUrl = URL.createObjectURL(mdBlob);
        downloadFile(mdUrl, "document.md");
        break;
        
      case 'html':
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        document.body.appendChild(container);
        
        const ReactDOMServer = require('react-dom/server');
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
        
        const htmlBlob = new Blob([fullHtml], { type: "text/html" });
        const htmlUrl = URL.createObjectURL(htmlBlob);
        downloadFile(htmlUrl, "document.html");
        document.body.removeChild(container);
        break;
      case "pdf":
        if (!html2pdfLib) {
          alert("PDF generation library is still loading. Please try again.");
          return;
        }
        const pdfOptions = { filename: "document.pdf" };
        html2pdfLib().from(markdown).set(pdfOptions).save();
        break;
    }
  };

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header theme={(theme || "light") as "light" | "dark"} setTheme={setTheme} mounted={mounted} handleExport={handleExport} />
      <main className="flex-1 p-4 container mx-auto">
        <div className="grid grid-cols-2 gap-4 h-full">
          <div className="h-[calc(100vh-140px)] rounded-md border shadow-sm overflow-hidden">
            <MarkdownEditor markdown={markdown} setMarkdown={setMarkdown} />
          </div>
          <div className="h-[calc(100vh-140px)] rounded-md border shadow-sm overflow-auto">
            <MarkdownPreview markdown={markdown} theme={(theme || "light") as "light" | "dark"} />
          </div>
        </div>
      </main>
    </div>
  );
}