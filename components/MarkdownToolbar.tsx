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
} from "lucide-react";

interface MarkdownToolbarProps {
  onInsert: (text: string, wrap?: boolean) => void;
}

const MarkdownToolbar: FC<MarkdownToolbarProps> = ({ onInsert }) => {
  return (
    <div className="bg-muted/40 px-4 py-2 border-b font-medium text-sm flex items-center gap-2 flex-wrap">
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
    </div>
  );
};

export default MarkdownToolbar;