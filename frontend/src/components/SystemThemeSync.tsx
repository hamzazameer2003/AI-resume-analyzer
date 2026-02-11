"use client";

import { useEffect } from "react";

export default function SystemThemeSync() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = (isDark: boolean) => {
      document.documentElement.classList.toggle("dark", isDark);
    };
    apply(media.matches);
    const handler = (event: MediaQueryListEvent) => apply(event.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return null;
}
