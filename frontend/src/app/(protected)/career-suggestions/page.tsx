"use client";

import { useEffect, useState } from "react";
import { getJson } from "@/lib/api";

type ResumeOption = {
  id: string;
  jobTitle?: string;
  atsScore?: number;
};

type DashboardResponse = {
  resumes: ResumeOption[];
};

type SuggestionsResponse = {
  resumeId: string | null;
  resumeJobTitle: string;
  suggestions: string[];
};

export default function CareerSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [resumes, setResumes] = useState<ResumeOption[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [resumeTitle, setResumeTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem("token") || "";
    getJson<DashboardResponse>("/api/dashboard", token)
      .then((data) => {
        const list = data.resumes || [];
        setResumes(list);
        if (list.length && list[0].id) {
          setSelectedResumeId(list[0].id);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, []);

  useEffect(() => {
    const token = window.localStorage.getItem("token") || "";
    const query = selectedResumeId ? `?resumeId=${selectedResumeId}` : "";
    getJson<SuggestionsResponse>(`/api/career/suggestions${query}`, token)
      .then((data) => {
        setSuggestions(data.suggestions || []);
        setResumeTitle(data.resumeJobTitle || "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, [selectedResumeId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Career Suggestions</h1>
        <p className="text-sm text-slate dark:text-slate-300">Guided roles based on your resume analysis.</p>
      </div>
      <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
        <label className="text-xs uppercase tracking-widest text-slate dark:text-slate-300">
          Select Resume
        </label>
        <select
          className="mt-2 w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
          value={selectedResumeId}
          onChange={(e) => setSelectedResumeId(e.target.value)}
          disabled={!resumes.length}
        >
          {!resumes.length && <option value="">No resumes available</option>}
          {resumes.map((resume, idx) => (
            <option key={resume.id} value={resume.id}>
              {resume.jobTitle || `Resume ${idx + 1}`} {typeof resume.atsScore === "number" ? `- ATS ${resume.atsScore}` : ""}
            </option>
          ))}
        </select>
        {resumeTitle && (
          <p className="mt-2 text-xs text-slate dark:text-slate-300">
            Suggestions for role focus: {resumeTitle}
          </p>
        )}
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
