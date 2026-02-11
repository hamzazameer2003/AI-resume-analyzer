"use client";

import { useMemo, useState } from "react";
import { API_URL } from "@/lib/api";

type AnalysisResult = {
  provider?: string;
  atsScore?: number;
  pros?: string[];
  cons?: string[];
  suggestions?: string[];
  raw?: string;
};

export default function ResumeAnalysisPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = window.localStorage.getItem("token") || "";
      const formData = new FormData();
      formData.append("jobTitle", jobTitle);
      if (file) formData.append("resume", file);

      const res = await fetch(`${API_URL}/api/resume-analysis/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Analysis failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  const scoreLabel = useMemo(() => {
    if (!result?.atsScore && result?.atsScore !== 0) return "Not scored yet";
    if (result.atsScore >= 80) return "Strong match";
    if (result.atsScore >= 60) return "Good potential";
    if (result.atsScore >= 40) return "Needs improvement";
    return "Low match";
  }, [result?.atsScore]);

  function downloadReport() {
    if (!result) return;
    const lines = [
      `ATS Score: ${result.atsScore ?? "N/A"} (${scoreLabel})`,
      "",
      "Strengths:",
      ...(result.pros?.length ? result.pros.map((p) => `- ${p}`) : ["- None detected"]),
      "",
      "Weak Spots:",
      ...(result.cons?.length ? result.cons.map((c) => `- ${c}`) : ["- None detected"]),
      "",
      "Suggestions:",
      ...(result.suggestions?.length
        ? result.suggestions.map((s, i) => `${i + 1}. ${s}`)
        : ["- No suggestions yet"]),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume-analysis.txt";
    link.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Resume Analysis</h1>
        <p className="text-sm text-slate dark:text-slate-300">
          Upload your resume and target role to get ATS insights.
        </p>
      </div>
      <form
        className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/70"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Target job title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
          <input
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 rounded-xl bg-ink px-4 py-3 text-sm text-fog transition hover:-translate-y-0.5 dark:bg-slate-100 dark:text-slate-900"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </form>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {result && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
              <p className="text-xs uppercase tracking-widest text-slate dark:text-slate-300">
                ATS Score
              </p>
              <div className="mt-4 flex items-center gap-6">
                <div className="relative h-24 w-24">
                  <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
                    <path
                      className="fill-none stroke-slate-200 dark:stroke-slate-800"
                      strokeWidth="3.5"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="fill-none stroke-ink dark:stroke-slate-100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.min(result.atsScore || 0, 100)}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold">
                    {result.atsScore ?? "--"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate dark:text-slate-300">Score verdict</div>
                  <div className="text-lg font-semibold">{scoreLabel}</div>
                  <button
                    type="button"
                    onClick={downloadReport}
                    className="mt-3 rounded-full border border-ink/20 px-3 py-1 text-xs text-ink transition hover:-translate-y-0.5 dark:border-white/20 dark:text-slate-100"
                  >
                    Download report
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                <h3 className="text-lg font-semibold">Strengths</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate dark:text-slate-300">
                  {(result.pros || []).map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                  {!result.pros?.length && <li>No strong points detected yet.</li>}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
                <h3 className="text-lg font-semibold">Weak Spots</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate dark:text-slate-300">
                  {(result.cons || []).map((item, idx) => (
                    <li key={idx}>• {item}</li>
                  ))}
                  {!result.cons?.length && <li>No issues detected yet.</li>}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
            <h3 className="text-lg font-semibold">Suggestions</h3>
            <p className="mt-2 text-sm text-slate dark:text-slate-300">
              Simple, practical improvements you can apply right away.
            </p>
            <ol className="mt-4 space-y-3 text-sm text-slate dark:text-slate-300">
              {(result.suggestions || []).map((item, idx) => (
                <li key={idx}>
                  <span className="mr-2 rounded-full bg-fog px-2 py-0.5 text-xs text-ink dark:bg-slate-800 dark:text-slate-100">
                    {idx + 1}
                  </span>
                  {item}
                </li>
              ))}
              {!result.suggestions?.length && <li>No suggestions yet.</li>}
            </ol>

            {result.raw && (
              <div className="mt-6 rounded-xl border border-dashed border-ink/20 bg-fog px-4 py-3 text-xs text-slate dark:border-white/20 dark:bg-slate-950 dark:text-slate-300">
                {result.raw}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
