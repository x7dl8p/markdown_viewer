"use client";

import { FC, memo, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import MarkdownPreview from "@/components/MarkdownPreview";
import MarkdownToolbar from "@/components/MarkdownToolbar";

interface MobileLayoutProps {
  markdown: string;
  setMarkdown: (value: string) => void;
  debouncedMarkdown: string;
  theme: "light" | "dark";
}

const MobileLayout: FC<MobileLayoutProps> = ({
  markdown,
  setMarkdown,
  debouncedMarkdown,
  theme,
}) => {
  const [view, setView] = useState<"edit" | "preview">("preview");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = useCallback((text: string, wrap: boolean = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    let newText: string;
    let newCursorPos: number;

    if (wrap && start !== end) {
      const selectedText = markdown.slice(start, end);
      newText = markdown.slice(0, start) + text + selectedText + text + markdown.slice(end);
      newCursorPos = start + text.length + selectedText.length + text.length;
    } else {
      newText = markdown.slice(0, start) + text + markdown.slice(end);
      if (text === "```\n\n```") {
        newCursorPos = start + 4;
      } else {
        newCursorPos = start + text.length;
      }
    }

    setMarkdown(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [markdown, setMarkdown]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  }, [setMarkdown]);

  return (
    <div className="h-full flex flex-col relative">
      {/* Floating toggle buttons - top right */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          size="lg"
          variant={view === "edit" ? "default" : "outline"}
          onClick={() => setView("edit")}
          className="rounded-full shadow-lg"
        >
          <Edit className="h-5 w-5" />
        </Button>
        <Button
          size="lg"
          variant={view === "preview" ? "default" : "outline"}
          onClick={() => setView("preview")}
          className="rounded-full shadow-lg"
        >
          <Eye className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-hidden mt-2" >
        {view === "edit" ? (
          <textarea
            ref={textareaRef}
            className="w-full h-full p-4 resize-none focus:outline-none bg-background overflow-auto"
            value={markdown}
            onChange={handleChange}
            placeholder="Type your markdown here..."
            spellCheck={false}
          />
        ) : (
          <MarkdownPreview markdown={debouncedMarkdown} theme={theme} />
        )}
      </div>

      {/* Toolbar - sticky at the bottom above footer, only in edit mode */}
      {view === "edit" && (
        <div className="fixed left-0 right-0 z-40 bg-background border-t" style={{ bottom: "64px" }}>
          <MarkdownToolbar
            onInsert={insertText}
            markdown={markdown}
            setMarkdown={setMarkdown}
          />
        </div>
      )}
    </div>
  );
};

export default memo(MobileLayout);
