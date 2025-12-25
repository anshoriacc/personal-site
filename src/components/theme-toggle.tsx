"use client";

import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { setTheme, theme, systemTheme } = useTheme();
  const isDark =
    theme === "dark" || (theme === "system" && systemTheme === "dark");

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      onClick={toggleTheme}
      aria-label="toggle theme"
      className="rounded-full text-white group bg-white/20"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "dark" : "light"}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.3 }}
          whileHover={{ rotate: [0, -15, 6, -1, 0] }}
          className="flex items-center justify-center p-1"
        >
          {isDark ? (
            <Sun className="size-4 group-hover:fill-white" />
          ) : (
            <Moon className="size-4 group-hover:fill-white" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};
