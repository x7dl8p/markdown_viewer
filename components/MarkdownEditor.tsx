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
  const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 });

  useEffect(() => {
    if (markdown !== localValue) {
      setLocalValue(markdown);
    }
  }, [markdown]);

  // Store selection range whenever user selects text
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleSelect = () => {
      setSelectionRange({
        start: textarea.selectionStart,
        end: textarea.selectionEnd
      });
    };

    textarea.addEventListener('mouseup', handleSelect);
    textarea.addEventListener('keyup', handleSelect);
    textarea.addEventListener('select', handleSelect);

    return () => {
      textarea.removeEventListener('mouseup', handleSelect);
      textarea.removeEventListener('keyup', handleSelect);
      textarea.removeEventListener('select', handleSelect);
    };
  }, []);

  const insertText = useCallback((text: string, wrap: boolean = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = selectionRange.start;
    const end = selectionRange.end;
    let newText: string;
    let newCursorPos: number;

    if (wrap && start !== end) {
      // Text is selected - wrap it
      const selectedText = localValue.slice(start, end);
      newText = localValue.slice(0, start) + text + selectedText + text + localValue.slice(end);
      newCursorPos = start + text.length + selectedText.length + text.length;
    } else if (wrap && start === end) {
      // No text selected but wrap mode - insert placeholder with wrapping
      if (text === "==") {
        // Special case for highlight - insert with placeholder
        const placeholder = "highlighted text";
        newText = localValue.slice(0, start) + text + placeholder + text + localValue.slice(end);
        newCursorPos = start + text.length + placeholder.length + text.length;
      } else if (text === "**") {
        const placeholder = "bold text";
        newText = localValue.slice(0, start) + text + placeholder + text + localValue.slice(end);
        newCursorPos = start + text.length + placeholder.length + text.length;
      } else if (text === "*") {
        const placeholder = "italic text";
        newText = localValue.slice(0, start) + text + placeholder + text + localValue.slice(end);
        newCursorPos = start + text.length + placeholder.length + text.length;
      } else {
        newText = localValue.slice(0, start) + text + localValue.slice(end);
        newCursorPos = start + text.length;
      }
    } else {
      // No wrap mode - just insert
      newText = localValue.slice(0, start) + text + localValue.slice(end);
      if (text === "```\n\n```") {
        newCursorPos = start + 4;
      } else {
        newCursorPos = start + text.length;
      }
    }

    setLocalValue(newText);
    setMarkdown(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      setSelectionRange({ start: newCursorPos, end: newCursorPos });
    }, 0);
  }, [localValue, selectionRange, setMarkdown]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    setMarkdown(newValue);
  }, [setMarkdown]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check if Ctrl/Cmd + H is pressed for manual highlight
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (start !== end) {
        const selectedText = localValue.slice(start, end);
        const newText = localValue.slice(0, start) + "==" + selectedText + "==" + localValue.slice(end);
        setLocalValue(newText);
        setMarkdown(newText);

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + 2 + selectedText.length + 2, start + 2 + selectedText.length + 2);
        }, 0);
      }
    }
  }, [localValue, setMarkdown]);

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
        onKeyDown={handleKeyDown}
        placeholder="Type your markdown here..."
        spellCheck={false}
      />
    </div>
  );
};

export default memo(MarkdownEditor);
