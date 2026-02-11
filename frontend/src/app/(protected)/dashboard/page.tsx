"use client";

import { useEffect, useState } from "react";
import { getJson } from "@/lib/api";

type DashboardData = {
  user: string | null;
  resumes: Array<{
    id?: string;
    jobTitle?: string;
    atsScore?: number;
  }>;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem("token") || "";
    getJson<DashboardData>("/api/dashboard", token)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-sm text-slate dark:text-slate-300">All your resume scores and insights.</p>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {(data?.resumes || []).map((resume, index) => (
          <div
            key={resume.id || index}
            className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70"
          >
            <p className="text-sm text-slate dark:text-slate-300">{resume.jobTitle || "Target Role"}</p>
            <p className="text-2xl font-semibold">{resume.atsScore ?? "--"}</p>
            <p className="text-xs text-slate dark:text-slate-300">ATS Score</p>
          </div>
        ))}
        {!data?.resumes?.length && (
          <div className="rounded-2xl border border-dashed border-ink/20 p-8 text-sm text-slate dark:border-white/20 dark:text-slate-300">
            No resumes yet. Upload one to see scores here.
          </div>
        )}
      </div>
    </div>
  );
}
