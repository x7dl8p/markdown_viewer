"use client";

import { FC } from "react";
import { FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExportOptions from "./ExportOptions";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  mounted: boolean;
  handleExport: (format: "md" | "html" | "pdf") => void;
}

const Header: FC<HeaderProps> = ({
  theme,
  setTheme,
  mounted,
  handleExport,
}) => {
  return (
    <header className="border-b bg-card">
      <div className="mx-2 px-4 py-3 flex items-center justify-between">
        <div className="flex flex-row items-center justify-center">
          <FileText className="h-8 w-8 text-primary mb-1 mr-2" />
          <h1 className="text-2xl font-bold">Awsm MD</h1>
        </div>
        <div className="flex items-center gap-2">
          <ExportOptions handleExport={handleExport} />
          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} setTheme={setTheme} mounted={mounted} />
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                window.open(
                  "https://mohammad.is-a.dev",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
