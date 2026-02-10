import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="w-full px-6 py-5">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          ResumePilot
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-slate">
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-ink px-4 py-2 text-fog transition hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
