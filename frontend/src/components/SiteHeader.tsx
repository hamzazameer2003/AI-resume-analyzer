"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { notifyAuthChanged, useIsLoggedIn } from "@/lib/auth";

const signedInLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/resume-analysis", label: "Resume Analysis" },
  { href: "/resume-generator", label: "Resume Builder" },
  { href: "/trending-jobs", label: "Trending Jobs" },
  { href: "/career-suggestions", label: "Career Suggestions" },
];

export default function SiteHeader() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();

  function handleLogout() {
    window.localStorage.removeItem("token");
    notifyAuthChanged();
    router.push("/");
  }

  return (
    <header className="w-full border-b border-white/60 bg-white/70 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/10 dark:bg-slate-900/60">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          ResumePilot
        </Link>
        {isLoggedIn ? (
          <div className="flex w-full flex-wrap items-center gap-2 text-sm text-slate sm:w-auto sm:justify-end sm:gap-4 dark:text-slate-300">
            {signedInLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-transparent px-3 py-2 text-center sm:px-0 sm:py-0"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-full border border-ink/20 px-4 py-2 text-sm text-ink transition hover:-translate-y-0.5 sm:w-auto dark:border-white/20 dark:text-slate-100"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-3 text-sm sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <Link href="/login" className="text-slate sm:text-left dark:text-slate-300">
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-ink px-4 py-2 text-center text-fog transition hover:-translate-y-0.5 dark:bg-slate-100 dark:text-slate-900"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
