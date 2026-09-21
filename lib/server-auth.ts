import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { readUser } from "@/lib/auth-user";

export const getServerUser = cache(async () => {
  const cookie = (await headers()).get("cookie");
  if (!cookie) return null;
  const response = await fetch(`${process.env.API_URL ?? "http://localhost:4000"}/auth/me`, {
    headers: { cookie }, cache: "no-store", signal: AbortSignal.timeout(15000),
  });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Authentication service unavailable");
  return readUser(await response.json());
});

export async function requireUser() {
  const user = await getServerUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/home");
  return user;
}
