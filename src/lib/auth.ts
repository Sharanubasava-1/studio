// src/lib/auth.ts

export function getStoredAuthHeader(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("authHeader");
}

export function isLoggedIn(): boolean {
  return !!getStoredAuthHeader();
}