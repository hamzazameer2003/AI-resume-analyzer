function normalizeApiBaseUrl(value?: string) {
  const fallback = "http://localhost:5000";
  const trimmed = String(value || fallback).trim().replace(/\/+$/, "");
  return trimmed.replace(/\/api$/i, "");
}

export const API_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${normalizedPath}`;
}

export async function postJson<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}

export async function getJson<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}

export async function deleteJson<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}
