"use client";

import { FC, memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  preprocessMarkdown,
  getMarkdownComponents,
} from "@/lib/markdownParser";

interface MarkdownPreviewProps {
  markdown: string;
  theme: "light" | "dark";
}

const MarkdownPreview: FC<MarkdownPreviewProps> = ({ markdown, theme }) => {
  const processedMarkdown = useMemo(() => preprocessMarkdown(markdown), [markdown]);
  const components = useMemo(() => getMarkdownComponents(theme), [theme]);

  return (
    <div className="h-full rounded-md border overflow-auto">
      <div className="bg-muted/40 px-4 py-2 border-b font-medium text-xl">
        Preview
      </div>
      <div className="prose dark:prose-invert max-w-none p-4 break-words">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={components}
        >
          {processedMarkdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default memo(MarkdownPreview);
