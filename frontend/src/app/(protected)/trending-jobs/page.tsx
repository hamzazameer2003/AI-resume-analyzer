"use client";

import { useEffect, useState } from "react";
import { getJson } from "@/lib/api";

type Job = {
  title: string;
  summary?: string;
  companies?: string[];
  opportunities?: string;
};

export default function TrendingJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem("token") || "";
    getJson<Job[]>("/api/trending-jobs", token)
      .then(setJobs)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Trending Jobs</h1>
        <p className="text-sm text-slate dark:text-slate-300">Live market signals, companies, and opportunity hints.</p>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <div key={job.title} className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
            <h3 className="text-lg font-semibold">{job.title}</h3>
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
