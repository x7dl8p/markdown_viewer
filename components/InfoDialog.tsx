"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { preprocessMarkdown, getMarkdownComponents } from "@/lib/markdownParser";
import { useTheme } from "next-themes";
import { infoContent } from "@/content/infoContent";

const InfoDialog: FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>("about");
  const { theme } = useTheme();

  const processedContent = preprocessMarkdown(
    infoContent[selectedSection as keyof typeof infoContent]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[60vw] max-h-[80vh] p-0 overflow-hidden">
        <div className="flex flex-grow h-[80vh]">
          {/* Sidebar */}
          <div className="w-48 border-r bg-muted/30 p-4 overflow-y-auto">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg">Information</DialogTitle>
            </DialogHeader>
            <nav className="space-y-1">
              {[
                { id: "about", label: "About" },
                { id: "syntax", label: "Syntax Guide" },
                { id: "shortcuts", label: "Shortcuts" },
                { id: "privacy", label: "Privacy" },
                { id: "contact", label: "Contact" },
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={getMarkdownComponents((theme || "light") as "light" | "dark")}
              >
                {processedContent}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
