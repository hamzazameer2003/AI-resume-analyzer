"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { API_URL, postJson } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await postJson<{ token: string }>("/api/auth/login", { email, password });
      window.localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const tokenFromQuery = searchParams.get("token");
    if (tokenFromQuery) {
      window.localStorage.setItem("token", tokenFromQuery);
      router.push("/dashboard");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-fog">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 p-8 shadow-xl">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-slate">Log in to access your dashboard and features.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-ink"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-ink px-4 py-3 text-sm text-fog transition hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="mt-4 flex items-center justify-between text-sm text-slate">
            <Link href="/signup">Create account</Link>
            <a
              href={`${API_URL}/api/auth/google`}
              className="rounded-full border border-ink/10 px-3 py-1 text-xs"
            >
              Login with Google
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
