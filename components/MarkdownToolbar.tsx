// MarkdownToolbar.tsx
"use client";

import { FC, memo, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Quote,
  Link,
  Minus,
  Save,
  RotateCcw,
  CheckSquare,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DEFAULT_MARKDOWN } from "@/content/defaultMarkdown";

interface MarkdownToolbarProps {
  onInsert: (text: string, wrap?: boolean) => void;
  markdown: string;
  setMarkdown: (markdown: string) => void;
}

const MarkdownToolbar: FC<MarkdownToolbarProps> = ({ onInsert, markdown, setMarkdown }) => {
  const handleSave = useCallback(() => {
    try {
      localStorage.setItem('awsm-md-content', markdown);
      localStorage.setItem('awsm-md-saved-at', new Date().toISOString());
      toast({
        title: 'Saved locally!',
        description: 'Your markdown has been saved to browser storage.',
      });
    } catch (error) {
      toast({
        title: 'Failed to save',
        description: 'Could not save to local storage.',
        variant: 'destructive',
      });
    }
  }, [markdown]);

  const handleDiscard = useCallback(() => {
    try {
      localStorage.removeItem('awsm-md-content');
      localStorage.removeItem('awsm-md-saved-at');
      setMarkdown(DEFAULT_MARKDOWN);
      toast({
        title: 'Reset to default!',
        description: 'Your changes have been discarded and reset to default.',
      });
    } catch (error) {
      toast({
        title: 'Failed to reset',
        description: 'Could not reset to default.',
        variant: 'destructive',
      });
    }
  }, [setMarkdown]);

  return (
    <div className="bg-muted/40 px-2 py-1.5 border-b font-medium text-sm flex items-center gap-1 overflow-x-auto scrollbar-hide">
      <Button variant="outline" size="icon" className="h-7 w-7 shrink-0" onClick={() => onInsert("**bold text**", true)}>
        <Bold className="h-3.5 w-3.5" />
      </Button>
      <Button variant="outline" size="icon" className="h-7 w-7 shrink-0" onClick={() => onInsert("*italic text*", true)}>
        <Italic className="h-3.5 w-3.5" />
      </Button>
      <Button variant="outline" size="icon" className="h-7 w-7 shrink-0" onClick={() => onInsert("```\n code here \n```")}>
        <Code className="h-3.5 w-3.5" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-7 px-2 text-xs shrink-0">
            <List className="h-3.5 w-3.5 mr-1" />
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onInsert("- 1\n- 2\n- 3\n")}>
            Unordered List
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsert("- A.\n   - 1\n- B.\n   - \n")}>
            Ordered List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" size="icon" className="h-7 w-7 shrink-0" onClick={() => onInsert("> Quote text\n")}>
        <Quote className="h-3.5 w-3.5" />
      </Button>
      <Button variant="outline" size="icon" className="h-7 w-7 shrink-0" onClick={() => onInsert("\n\n---\n")}>
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <Button variant="outline" size="icon" className="h-7 w-7 shrink-0" onClick={() => onInsert("[Link embedded Text](https://example.com)\n")}>
        <Link className="h-3.5 w-3.5" />
      </Button>
      <Button variant="outline" size="icon" className="h-7 w-7 shrink-0" onClick={() => onInsert("- [ ] Task item\n")}>
        <CheckSquare className="h-3.5 w-3.5" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-7 px-2 text-xs shrink-0">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onInsert("!!! note Note Title\n    This is a note admonition.\n\n")}>
            <span className="w-2 h-2 rounded-full bg-[#cba6f7] mr-2"></span>
            Note
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsert("!!! info Info Title\n    This is an info admonition.\n\n")}>
            <span className="w-2 h-2 rounded-full bg-[#74c7ec] mr-2"></span>
            Info
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsert("!!! warning Warning Title\n    This is a warning admonition.\n\n")}>
            <span className="w-2 h-2 rounded-full bg-[#fab387] mr-2"></span>
            Warning
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsert("!!! danger Danger Title\n    This is a danger admonition.\n\n")}>
            <span className="w-2 h-2 rounded-full bg-[#eba0ac] mr-2"></span>
            Danger
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsert("!!! greentext Greentext Title\n    This is a greentext admonition.\n\n")}>
            <span className="w-2 h-2 rounded-full bg-[#a6e3a1] mr-2"></span>
            Greentext
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex-1 min-w-2" />

      <div className="flex items-center border rounded-md overflow-hidden shrink-0">
        <Button variant="ghost" className="h-7 px-2 text-xs gap-1 rounded-none border-r hover:bg-accent" onClick={handleSave}>
          <Save className="h-3.5 w-3.5" />
          Save
        </Button>
        <Button variant="ghost" className="h-7 px-2 text-xs gap-1 rounded-none hover:bg-accent" onClick={handleDiscard}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default memo(MarkdownToolbar);