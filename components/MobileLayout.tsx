"use client";

import { FC, memo, useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Highlighter } from "lucide-react";
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
  const [showHighlightBtn, setShowHighlightBtn] = useState(false);
  const [highlightBtnPos, setHighlightBtnPos] = useState({ top: 0, left: 0 });

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

  const handleTextSelect = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end && view === "edit") {
      // Text is selected
      const rect = textarea.getBoundingClientRect();
      const textBeforeSelection = markdown.slice(0, start);
      const lines = textBeforeSelection.split('\n').length;

      // Position the button near the selection
      setHighlightBtnPos({
        top: rect.top + (lines * 20) - textarea.scrollTop + 40,
        left: rect.left + rect.width / 2 - 30,
      });
      setShowHighlightBtn(true);
    } else {
      setShowHighlightBtn(false);
    }
  }, [markdown, view]);

  const handleHighlight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      const selectedText = markdown.slice(start, end);
      const newText = markdown.slice(0, start) + "==" + selectedText + "==" + markdown.slice(end);
      setMarkdown(newText);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2 + selectedText.length + 2, start + 2 + selectedText.length + 2);
      }, 0);
    }
    setShowHighlightBtn(false);
  }, [markdown, setMarkdown]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.addEventListener('mouseup', handleTextSelect);
    textarea.addEventListener('touchend', handleTextSelect);
    textarea.addEventListener('keyup', handleTextSelect);

    return () => {
      textarea.removeEventListener('mouseup', handleTextSelect);
      textarea.removeEventListener('touchend', handleTextSelect);
      textarea.removeEventListener('keyup', handleTextSelect);
    };
  }, [handleTextSelect]);

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

      {/* Floating highlight button when text is selected */}
      {showHighlightBtn && view === "edit" && (
        <Button
          size="sm"
          onClick={handleHighlight}
          className="fixed z-50 shadow-lg rounded-full h-9 w-9 p-0"
          style={{
            top: `${highlightBtnPos.top}px`,
            left: `${highlightBtnPos.left}px`,
          }}
        >
          <Highlighter className="h-4 w-4" />
        </Button>
      )}

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
