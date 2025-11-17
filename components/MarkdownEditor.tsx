"use client";

import { FC, useRef, useState, useCallback, useEffect, memo } from "react";
import MarkdownToolbar from "./MarkdownToolbar";

interface MarkdownEditorProps {
  markdown: string;
  setMarkdown: (value: string) => void;
}

const MarkdownEditor: FC<MarkdownEditorProps> = ({ markdown, setMarkdown }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [localValue, setLocalValue] = useState(markdown);

  useEffect(() => {
    if (markdown !== localValue) {
      setLocalValue(markdown);
    }
  }, [markdown]);

  const insertText = useCallback((text: string, wrap: boolean = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    let newText: string;
    let newCursorPos: number;

    setLocalValue(current => {
      if (wrap && start !== end) {
        const selectedText = current.slice(start, end);
        newText = current.slice(0, start) + text + selectedText + text + current.slice(end);
        newCursorPos = start + text.length + selectedText.length + text.length;
      } else {
        newText = current.slice(0, start) + text + current.slice(end);
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

      return newText;
    });
  }, [setMarkdown]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    setMarkdown(newValue);
  }, [setMarkdown]);

  return (
    <div className="h-full flex flex-col">
      <MarkdownToolbar
        onInsert={insertText}
        markdown={localValue}
        setMarkdown={setMarkdown}
      />
      <textarea
        ref={textareaRef}
        className="flex-1 w-full p-4 resize-none focus:outline-none bg-background overflow-auto"
        value={localValue}
        onChange={handleChange}
        placeholder="Type your markdown here..."
        spellCheck={false}
      />
    </div>
  );
};

export default memo(MarkdownEditor);
