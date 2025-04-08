"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { Download, Moon, Sun, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

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

import { DEFAULT_MARKDOWN } from "../components/defaultMarkdown";

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

  const handleExport = () => {
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "document.md"
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
            <Button variant="outline" size="sm" onClick={handleExport} title="Export Markdown" className="gap-1">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("Theme toggle clicked. Current theme:", theme);
                setTheme(theme === "dark" ? "light" : "dark");
                console.log("Theme after toggle:", theme === "dark" ? "light" : "dark");
              }}
              title="Toggle theme"
              className="gap-1"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </Button>
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
