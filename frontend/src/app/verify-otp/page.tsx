"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { postJson } from "@/lib/api";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailFromQuery = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await postJson("/api/auth/verify-otp", { email, otp });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-fog">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 p-8 shadow-xl">
          <h1 className="text-2xl font-semibold">Verify your email</h1>
          <p className="mt-2 text-sm text-slate">Enter the OTP sent to your email.</p>
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
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-ink px-4 py-3 text-sm text-fog transition hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
