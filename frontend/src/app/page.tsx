"use client";

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import FeatureCard from "@/components/FeatureCard";
import { useIsLoggedIn } from "@/lib/auth";

const features = [
  {
    title: "AI Resume Analysis",
    description: "Upload a PDF or Word file, match it to a job, and get ATS scoring with clear fixes.",
  },
  {
    title: "Career Direction",
    description: "Personalized career suggestions based on your resume signals and goals.",
  },
  {
    title: "AI Resume Builder",
    description: "Generate a professional, downloadable resume from your inputs.",
  },
  {
    title: "Trending Jobs",
    description: "Live insights into hot roles, hiring fields, and opportunity signals.",
  },
];

export default function Home() {
  const isLoggedIn = useIsLoggedIn();

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-12 pt-6 sm:gap-10 sm:px-6 sm:pb-16 sm:pt-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-xs text-slate shadow-sm dark:bg-slate-900/70 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Built for fast career clarity
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Resume intelligence with an ATS edge and AI-driven upgrades.
            </h1>
            <p className="text-base text-slate md:text-lg dark:text-slate-300">
              Analyze, improve, and generate resumes that match the role you want. Stay on top of
              trending jobs and get clear next steps.
            </p>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="rounded-full bg-ink px-5 py-3 text-center text-sm text-fog transition hover:-translate-y-0.5 dark:bg-slate-100 dark:text-slate-900"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/resume-analysis"
                    className="rounded-full border border-ink/20 px-5 py-3 text-center text-sm text-ink transition hover:-translate-y-0.5 dark:border-white/20 dark:text-slate-100"
                  >
                    Analyze Resume
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="rounded-full bg-ink px-5 py-3 text-center text-sm text-fog transition hover:-translate-y-0.5 dark:bg-slate-100 dark:text-slate-900"
                  >
                    Start Free
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-full border border-ink/20 px-5 py-3 text-center text-sm text-ink transition hover:-translate-y-0.5 dark:border-white/20 dark:text-slate-100"
                  >
                    Already a member
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-3 top-4 h-28 w-28 rounded-full bg-primary/20 blur-2xl sm:-right-6 sm:top-6 sm:h-40 sm:w-40" />
            <div className="absolute -left-3 bottom-4 h-28 w-28 rounded-full bg-accent/20 blur-2xl sm:-left-6 sm:bottom-6 sm:h-40 sm:w-40" />
            <div className="relative rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl animate-float sm:p-6 dark:border-white/10 dark:bg-slate-900/70">
              <p className="text-sm text-slate dark:text-slate-300">Latest Resume ATS Score</p>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="text-4xl font-semibold sm:text-5xl">82</div>
                <div className="text-xs text-slate dark:text-slate-300">
                  Strengths: keywords, impact metrics
                  <br />
                  Fixes: formatting & skills density
                </div>
              </div>
              <div className="mt-6 h-2 w-full rounded-full bg-fog dark:bg-slate-800">
                <div className="h-2 w-3/4 rounded-full bg-ink dark:bg-slate-100" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <section className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-lg sm:p-8 dark:border-white/10 dark:bg-slate-900/70">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate dark:text-slate-300">How it works</p>
              <h2 className="mt-3 text-2xl font-semibold">A clean, guided flow</h2>
            </div>
            <div className="space-y-4 text-sm text-slate md:col-span-2 dark:text-slate-300">
              <p>1. Upload your resume and target role.</p>
              <p>2. Review ATS scoring, pros, cons, and AI suggestions.</p>
              <p>3. Generate a polished PDF and track progress in your dashboard.</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center gap-4 rounded-3xl bg-ink px-5 py-8 text-center text-fog shadow-xl sm:px-8 sm:py-10 dark:bg-slate-950">
          <h3 className="text-xl font-semibold sm:text-2xl">Ready to unlock your next role?</h3>
          <p className="text-sm text-fog/70">
            {isLoggedIn
              ? "Jump back into your workspace and keep refining your next application."
              : "Sign in to access every feature. No login, no access."}
          </p>
          <Link
            href={isLoggedIn ? "/dashboard" : "/signup"}
            className="w-full rounded-full bg-fog px-5 py-3 text-sm text-ink transition hover:-translate-y-0.5 sm:w-auto dark:bg-slate-100 dark:text-slate-900"
          >
            {isLoggedIn ? "Open dashboard" : "Create your account"}
          </Link>
        </section>
      </section>
    </main>
  );
}
