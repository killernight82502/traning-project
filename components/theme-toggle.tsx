"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative group bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/50 text-purple-400 p-2 rounded-lg transition-all duration-300"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className="text-lg">
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
