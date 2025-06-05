// MarkdownEditor.tsx
"use client";

import { FC } from "react";

interface MarkdownEditorProps {
  markdown: string;
  setMarkdown: (value: string) => void;
}

const MarkdownEditor: FC<MarkdownEditorProps> = ({ markdown, setMarkdown }) => {
  return (
    <div className="h-full rounded-md border">
      <div className="bg-muted/40 px-4 py-2 border-b font-medium text-sm">Editor</div>
      <textarea
        className="w-full h-full p-4 resize-none focus:outline-none bg-background rounded-md"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Type your markdown here..."
      />
    </div>
  );
};

export default MarkdownEditor;