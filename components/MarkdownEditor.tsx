"use client";

import { FC, useRef } from "react";
import MarkdownToolbar from "./MarkdownToolbar";

interface MarkdownEditorProps {
  markdown: string;
  setMarkdown: (value: string) => void;
}

const MarkdownEditor: FC<MarkdownEditorProps> = ({ markdown, setMarkdown }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (text: string, wrap: boolean = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    let newText: string;
    let newCursorPos: number;

    if (wrap && start !== end) {
      const selectedText = markdown.slice(start, end);
      newText =
        markdown.slice(0, start) +
        text +
        selectedText +
        text +
        markdown.slice(end);
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
  };

  return (
    <div className="h-full flex flex-col">
      <MarkdownToolbar onInsert={insertText} />
      <textarea
        ref={textareaRef}
        className="flex-1 w-full p-4 resize-none focus:outline-none bg-background overflow-auto"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Type your markdown here..."
      />
    </div>
  );
};

export default MarkdownEditor;
