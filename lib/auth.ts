/**
 * Client session helpers. Token is stored until the backend exists;
 * skip-login buttons still work when NEXT_PUBLIC_API_URL is unset.
 */

import type { AuthUser, UserRole } from "@/lib/types";

const TOKEN_KEY = "reanmate:token";
const USER_KEY = "reanmate:user";
const SKIP_TOKEN = "skip";

export const SKIP_STUDENT: AuthUser = {
  id: "skip-student",
  email: "student@reanmate.local",
  role: "student",
  displayName: "សិស្សសាកល្បង",
};

export const SKIP_ADMIN: AuthUser = {
  id: "skip-admin",
  email: "admin@reanmate.local",
  role: "admin",
  displayName: "Admin",
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setSession(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function homePathForRole(role: AuthUser["role"]): string {
  return role === "admin" ? "/admin" : "/home";
}

export function skipAs(role: UserRole): void {
  setSession(SKIP_TOKEN, role === "admin" ? SKIP_ADMIN : SKIP_STUDENT);
}
