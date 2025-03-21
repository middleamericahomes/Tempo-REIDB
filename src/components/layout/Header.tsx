import React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
}

const Header = ({
  title = "CSV Uploader & Scoring System",
  onThemeToggle = () => {},
  isDarkMode = true,
}: HeaderProps) => {
  return (
    <header className="w-full h-16 bg-background border-b border-border flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onThemeToggle}
          className={cn(
            "rounded-full",
            isDarkMode
              ? "text-yellow-400 hover:text-yellow-500"
              : "text-slate-700 hover:text-slate-900",
          )}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
