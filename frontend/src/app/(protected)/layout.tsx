"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";

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
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}
