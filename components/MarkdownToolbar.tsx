// MarkdownToolbar.tsx
"use client";

import { FC } from "react";
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
  const handleSave = () => {
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
  };

  const handleDiscard = () => {
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
  };

  return (
    <div className="bg-muted/40 px-4 py-2 border-b font-medium text-sm flex items-center gap-2 flex-wrap justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Headings <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onInsert("# heading1\n")}>H1</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsert("## heading2\n")}>H2</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsert("### heading3\n")}>H3</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsert("#### heading4\n")}>H4</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsert("##### heading5\n")}>H5</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsert("###### heading6\n")}>H6</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" size="sm" onClick={() => onInsert("**bold text**", true)}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={() => onInsert("*italic text*", true)}>
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={() => onInsert("```\n code here \n```")}>
        <Code className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <List className="h-4 w-4 mr-1" /> Lists{" "}
            <ChevronDown className="ml-1 h-4 w-4" />
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

      <Button variant="outline" size="sm" onClick={() => onInsert("> Quote text\n")}>
        <Quote className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={() => onInsert("\n\n---\n")}>
        <Minus className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={() => onInsert("[Link embedded Text](https://example.com)\n")}>
        <Link className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={() => onInsert("- [ ] Task item\n")}>
        <CheckSquare className="h-4 w-4" />
      </Button>

      <div className="flex-1" />

      <Button variant="outline" size="sm" onClick={handleSave} className="gap-1">
        <Save className="h-4 w-4" />
        Save
      </Button>
      <Button variant="outline" size="sm" onClick={handleDiscard} className="gap-1">
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
    </div>
  );
};

export default MarkdownToolbar;