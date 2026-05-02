"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { notifyAuthChanged, useIsLoggedIn } from "@/lib/auth";

const signedInLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/resume-analysis", label: "Resume Analysis" },
  { href: "/resume-generator", label: "Resume Builder" },
  { href: "/trending-jobs", label: "Trending Jobs" },
  { href: "/career-suggestions", label: "Career Suggestions" },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M3 6h18" />
          <path d="M3 12h18" />
          <path d="M3 18h18" />
        </>
      )}
    </svg>
  );
}

export default function SiteHeader() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    window.localStorage.removeItem("token");
    notifyAuthChanged();
    setMobileMenuOpen(false);
    router.push("/");
  }

  function handleMobileNavClick() {
    setMobileMenuOpen(false);
  }

  const guestLinks = (
    <>
      <Link
        href="/login"
        onClick={handleMobileNavClick}
        className="text-slate sm:text-left dark:text-slate-300"
      >
        Login
      </Link>
      <Link
        href="/signup"
        onClick={handleMobileNavClick}
        className="rounded-full bg-ink px-4 py-2 text-center text-fog transition hover:-translate-y-0.5 dark:bg-slate-100 dark:text-slate-900"
      >
        Get Started
      </Link>
    </>
  );

  const signedInNav = (
    <>
      {signedInLinks.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={handleMobileNavClick}
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
    </>
  );

  return (
    <header className="w-full border-b border-white/60 bg-white/70 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/10 dark:bg-slate-900/60">
      <nav className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            ResumePilot
          </Link>

          <div className="hidden sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-end sm:gap-4">
            {isLoggedIn ? signedInNav : guestLinks}
          </div>

          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:bg-white/60 sm:hidden dark:border-white/15 dark:text-slate-100 dark:hover:bg-slate-800/60"
          >
            <MenuIcon open={mobileMenuOpen} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mt-4 flex flex-col gap-3 border-t border-white/60 pt-4 text-sm text-slate dark:border-white/10 dark:text-slate-300 sm:hidden">
            {isLoggedIn ? signedInNav : guestLinks}
          </div>
        )}
      </nav>
    </header>
  );
}
