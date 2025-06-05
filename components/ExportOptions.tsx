// ExportOptions.tsx
"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ExportOptionsProps {
  handleExport: (format: "md" | "html" | "pdf") => void;
}

const ExportOptions: FC<ExportOptionsProps> = ({ handleExport }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("md")}>Markdown (.md)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("html")}>HTML (.html)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf")}>PDF (.pdf)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportOptions;