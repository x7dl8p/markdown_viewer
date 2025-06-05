// MarkdownPreview.tsx
"use client";

import { FC } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface MarkdownPreviewProps {
  markdown: string;
  theme: "light" | "dark";
}

const MarkdownPreview: FC<MarkdownPreviewProps> = ({ markdown, theme }) => {
  const createSyntaxHighlighter = (props: any) => {
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

  return (
    <div className="h-full rounded-md border">
      <div className="bg-muted/40 px-4 py-2 border-b font-medium text-sm">Preview</div>
      <div className="prose dark:prose-invert max-w-none p-4">
        <ReactMarkdown
          components={{
            code: (props) => createSyntaxHighlighter(props),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownPreview;
