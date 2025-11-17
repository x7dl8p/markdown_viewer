"use client";

import { FC, memo } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import MarkdownEditor from "@/components/MarkdownEditor";
import MarkdownPreview from "@/components/MarkdownPreview";

interface DesktopLayoutProps {
  markdown: string;
  setMarkdown: (value: string) => void;
  debouncedMarkdown: string;
  theme: "light" | "dark";
}

const DesktopLayout: FC<DesktopLayoutProps> = ({
  markdown,
  setMarkdown,
  debouncedMarkdown,
  theme,
}) => {
  return (
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
        <MarkdownPreview markdown={debouncedMarkdown} theme={theme} />
      </Panel>
    </PanelGroup>
  );
};

export default memo(DesktopLayout);
