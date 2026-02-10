"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";

export default function ResumeAnalysisPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");
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
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Resume Analysis</h1>
        <p className="text-sm text-slate">Upload your resume and target role to get ATS insights.</p>
      </div>
      <form className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink"
            placeholder="Target job title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
          <input
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 rounded-xl bg-ink px-4 py-3 text-sm text-fog transition hover:-translate-y-0.5"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </form>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {result && (
        <pre className="rounded-2xl bg-ink/90 p-6 text-xs text-fog/90">{result}</pre>
      )}
    </div>
  );
}
