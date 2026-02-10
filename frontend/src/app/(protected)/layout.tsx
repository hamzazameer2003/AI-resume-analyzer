"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-slate">Checking session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/60 bg-white/70 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-base font-semibold">
            ResumePilot
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/resume-analysis">Resume Analysis</Link>
            <Link href="/resume-generator">Resume Builder</Link>
            <Link href="/trending-jobs">Trending Jobs</Link>
            <Link href="/career-suggestions">Career Suggestions</Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}
