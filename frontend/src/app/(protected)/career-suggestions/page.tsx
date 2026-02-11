"use client";

import { useEffect, useState } from "react";
import { getJson } from "@/lib/api";

export default function CareerSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem("token") || "";
    getJson<{ suggestions: string[] }>("/api/career/suggestions", token)
      .then((data) => setSuggestions(data.suggestions || []))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Career Suggestions</h1>
        <p className="text-sm text-slate dark:text-slate-300">Guided roles based on your resume analysis.</p>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {suggestions.map((item) => (
          <div key={item} className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
            {item}
          </div>
        ))}
        {!suggestions.length && (
          <div className="rounded-2xl border border-dashed border-ink/20 p-8 text-sm text-slate dark:border-white/20 dark:text-slate-300">
            No suggestions yet. Upload a resume to get tailored roles.
          </div>
        )}
      </div>
    </div>
  );
}
