// ThemeToggle.tsx
"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  mounted: boolean;
}

const ThemeToggle: FC<ThemeToggleProps> = ({ theme, setTheme, mounted }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
    </Button>
  );
};

export default ThemeToggle;