import type { User, UserRole } from "@/lib/types";

export function readUser(payload: unknown): User | null {
  if (!payload || typeof payload !== "object" || !("user" in payload)) return null;
  const user = payload.user;
  if (!user || typeof user !== "object") return null;
  const value = user as Record<string, unknown>;
  if (typeof value.id !== "string" || typeof value.email !== "string") return null;
  return {
    id: value.id,
    email: value.email,
    role: value.role === "admin" ? "admin" : "student",
    displayName: typeof value.displayName === "string" ? value.displayName
      : typeof value.name === "string" ? value.name : value.email,
  };
}

export function homeForRole(role: UserRole): string {
  return role === "admin" ? "/admin" : "/home";
}

export function destinationAfterLogin(next: string | null, role: UserRole): string {
  if (next && /^\/(home|learn|admin)(\/|\?|$)/.test(next) && !next.includes("\\")) {
    if (role !== "admin" && /^\/admin(\/|\?|$)/.test(next)) return "/home";
    return next;
  }
  return homeForRole(role);
}
