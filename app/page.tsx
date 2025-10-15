"use client";

import { useState, useEffect } from "react";
import { DEFAULT_MARKDOWN } from "@/components/defaultMarkdown";
import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import MarkdownEditor from "@/components/MarkdownEditor";
import MarkdownPreview from "@/components/MarkdownPreview";
import Footer from "@/components/footer";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function MarkdownViewer() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [jsPDFLib, setJsPDFLib] = useState<any>(null);
  const [html2canvasLib, setHtml2canvasLib] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    Promise.all([import("jspdf"), import("html2canvas")])
      .then(([jsPDFModule, html2canvasModule]) => {
        setJsPDFLib(() => jsPDFModule.default);
        setHtml2canvasLib(() => html2canvasModule.default);
      })
      .catch((err) => {
        console.error("Failed to load PDF libraries:", err);
      });
  }, []);

  const createSyntaxHighlighter = (props: {
    node?: any;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) => {
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
      case "md":
        const mdBlob = new Blob([markdown], { type: "text/markdown" });
        const mdUrl = URL.createObjectURL(mdBlob);
        downloadFile(mdUrl, "document.md");
        break;

      case "html":
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.left = "-9999px";
        document.body.appendChild(container);

        const ReactDOMServer = require("react-dom/server");
        const htmlContent = ReactDOMServer.renderToString(
          <div className="markdown-body">
            <ReactMarkdown
              components={{
                code: (props) => createSyntaxHighlighter(props),
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
        if (!jsPDFLib || !html2canvasLib) {
          alert("PDF generation library is still loading. Please try again.");
          return;
        }

        const pdfContainer = document.createElement("div");
        pdfContainer.style.position = "absolute";
        pdfContainer.style.left = "-9999px";
        pdfContainer.style.width = "210mm";
        pdfContainer.style.padding = "20px";
        pdfContainer.style.backgroundColor = "#ffffff";
        pdfContainer.style.color = "#000000";
        pdfContainer.style.fontFamily = "system-ui, sans-serif";
        document.body.appendChild(pdfContainer);

        import("react-dom/client").then((ReactDOM) => {
          const root = ReactDOM.createRoot(pdfContainer);
          root.render(
            <div
              style={{
                fontFamily: "system-ui, sans-serif",
                color: "#000",
                lineHeight: "1.6",
              }}
            >
              <ReactMarkdown
                components={{
                  code: (props: any) => {
                    const { node, inline, className, children, ...restProps } =
                      props;
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vs}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          backgroundColor: "#e4e4e7",
                          padding: "16px",
                          borderRadius: "4px",
                          margin: "10px 0",
                        }}
                        {...restProps}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        style={{
                          backgroundColor: "#e4e4e7",
                          padding: "2px 4px",
                          borderRadius: "3px",
                          fontFamily: "monospace",
                        }}
                        {...restProps}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          );

          setTimeout(() => {
            html2canvasLib(pdfContainer, {
              scale: 2,
              useCORS: true,
              backgroundColor: "#ffffff",
              logging: false,
            })
              .then((canvas: HTMLCanvasElement) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDFLib("p", "mm", "a4");
                const imgWidth = 210;
                const pageHeight = 297;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                  position = heightLeft - imgHeight;
                  pdf.addPage();
                  pdf.addImage(
                    imgData,
                    "PNG",
                    0,
                    position,
                    imgWidth,
                    imgHeight
                  );
                  heightLeft -= pageHeight;
                }

                pdf.save("document.pdf");
                root.unmount();
                document.body.removeChild(pdfContainer);
              })
              .catch((err: any) => {
                console.error("PDF generation failed:", err);
                root.unmount();
                document.body.removeChild(pdfContainer);
              });
          }, 500);
        });
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
      <main className="flex-1 p-4 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          <Panel
            defaultSize={60}
            minSize={20}
            className="rounded-md border shadow-sm overflow-hidden mx-2"
          >
            <MarkdownEditor markdown={markdown} setMarkdown={setMarkdown} />
          </Panel>
          <PanelResizeHandle className="w-1 bg-border hover:bg-muted-foreground transition-colors" />
          <Panel defaultSize={40} minSize={20} className="overflow-auto mx-2">
            <MarkdownPreview
              markdown={markdown}
              theme={(theme || "light") as "light" | "dark"}
            />
          </Panel>
        </PanelGroup>
      </main>
      <Footer
        theme={(theme || "light") as "light" | "dark"}
        setTheme={setTheme}
        mounted={mounted}
        handleExport={handleExport}
      />
    </div>
  );
}
