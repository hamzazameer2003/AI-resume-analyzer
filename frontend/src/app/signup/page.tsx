"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL, postJson } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await postJson("/api/auth/signup", { name, email, password, confirmPassword });
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-fog dark:bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl sm:p-8 dark:border-white/10 dark:bg-slate-900/70">
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="mt-2 text-sm text-slate dark:text-slate-300">We will send an OTP to verify your email.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink dark:border-white/10 dark:bg-slate-950 dark:text-slate-100"
              placeholder="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-ink px-4 py-3 text-sm text-fog transition hover:-translate-y-0.5 dark:bg-slate-100 dark:text-slate-900"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Create account"}
            </button>
          </form>
          <div className="mt-4 flex flex-col items-stretch gap-3 text-sm text-slate sm:flex-row sm:items-center sm:justify-between dark:text-slate-300">
            <span className="text-left">
              Already have an account? <Link href="/login">Login</Link>
            </span>
            <a
              href={`${API_URL}/api/auth/google`}
              className="rounded-full border border-ink/10 px-4 py-3 text-center text-sm text-ink transition hover:-translate-y-0.5 dark:border-white/10 dark:text-slate-100"
            >
              Continue with Google
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
