"use client";

import { useEffect, useState } from "react";
import { getJson } from "@/lib/api";

type Job = {
  title: string;
  summary?: string;
  companies?: string[];
  opportunities?: string;
  relevanceScore?: number;
};

type ResumeOption = {
  id: string;
  jobTitle?: string;
  atsScore?: number;
};

type DashboardResponse = {
  resumes: ResumeOption[];
};

type TrendingResponse = {
  resumeId: string | null;
  resumeJobTitle: string;
  jobs: Job[];
};

export default function TrendingJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
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
    getJson<TrendingResponse>(`/api/trending-jobs${query}`, token)
      .then((data) => {
        setJobs(data.jobs || []);
        setResumeTitle(data.resumeJobTitle || "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, [selectedResumeId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Trending Jobs</h1>
        <p className="text-sm text-slate dark:text-slate-300">Live market signals, companies, and opportunity hints.</p>
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
            Ranked against role focus: {resumeTitle}
          </p>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <div key={job.title} className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">{job.title}</h3>
              {typeof job.relevanceScore === "number" && (
                <span className="rounded-full bg-fog px-2 py-1 text-xs text-ink dark:bg-slate-800 dark:text-slate-100">
                  Match {job.relevanceScore}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-slate dark:text-slate-300">{job.summary}</p>
            {job.companies && (
              <p className="mt-3 text-xs text-slate dark:text-slate-300">Companies: {job.companies.join(", ")}</p>
            )}
            {job.opportunities && (
              <p className="mt-1 text-xs text-slate dark:text-slate-300">Opportunities: {job.opportunities}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
