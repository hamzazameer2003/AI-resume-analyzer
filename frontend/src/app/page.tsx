import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import FeatureCard from "@/components/FeatureCard";

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
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-8">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-xs text-slate shadow-sm dark:bg-slate-900/70 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Built for fast career clarity
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Resume intelligence with an ATS edge and AI-driven upgrades.
            </h1>
            <p className="text-base text-slate md:text-lg dark:text-slate-300">
              Analyze, improve, and generate resumes that match the role you want. Stay on top of
              trending jobs and get clear next steps.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="rounded-full bg-ink px-5 py-2.5 text-sm text-fog transition hover:-translate-y-0.5 dark:bg-slate-100 dark:text-slate-900"
              >
                Start Free
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-ink/20 px-5 py-2.5 text-sm text-ink transition hover:-translate-y-0.5 dark:border-white/20 dark:text-slate-100"
              >
                Already a member
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-6 top-6 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
            <div className="absolute -left-6 bottom-6 h-40 w-40 rounded-full bg-accent/20 blur-2xl" />
            <div className="relative rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl animate-float dark:border-white/10 dark:bg-slate-900/70">
              <p className="text-sm text-slate dark:text-slate-300">Latest Resume ATS Score</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="text-5xl font-semibold">82</div>
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

        <section className="rounded-3xl border border-white/70 bg-white/70 p-8 shadow-lg dark:border-white/10 dark:bg-slate-900/70">
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

        <section className="flex flex-col items-center gap-4 rounded-3xl bg-ink px-8 py-10 text-center text-fog shadow-xl dark:bg-slate-950">
          <h3 className="text-2xl font-semibold">Ready to unlock your next role?</h3>
          <p className="text-sm text-fog/70">Sign in to access every feature. No login, no access.</p>
          <Link
            href="/signup"
            className="rounded-full bg-fog px-5 py-2.5 text-sm text-ink transition hover:-translate-y-0.5 dark:bg-slate-100 dark:text-slate-900"
          >
            Create your account
          </Link>
        </section>
      </section>
    </main>
  );
}
