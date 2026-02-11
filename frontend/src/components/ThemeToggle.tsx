"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const preferred = stored === "dark" ? "dark" : "light";
    setTheme(preferred);
    document.documentElement.classList.toggle("dark", preferred === "dark");
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    window.localStorage.setItem("theme", next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-ink/20 bg-white/70 px-3 py-1 text-xs text-ink transition hover:-translate-y-0.5 dark:border-white/20 dark:bg-slate-900/60 dark:text-slate-100"
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
