"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const token = isClient ? window.localStorage.getItem("token") : null;

  useEffect(() => {
    if (isClient && !token) {
      router.replace("/login");
    }
  }, [isClient, token, router]);

  if (!isClient || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-slate">Checking session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/60 bg-white/70 px-6 py-4 dark:border-white/10 dark:bg-slate-900/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-base font-semibold">
            ResumePilot
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate dark:text-slate-300">
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
