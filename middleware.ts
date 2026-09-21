import { NextResponse, type NextRequest } from "next/server";
import { readUser } from "@/lib/auth-user";

export async function middleware(request: NextRequest) {
  const login = new URL("/login", request.url);
  login.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  const cookie = request.headers.get("cookie");
  if (!cookie) return NextResponse.redirect(login);
  try {
    const response = await fetch(`${process.env.API_URL ?? "http://localhost:4000"}/auth/me`, {
      headers: { cookie }, cache: "no-store", signal: AbortSignal.timeout(15000),
    });
    if (response.status === 401) return NextResponse.redirect(login);
    if (!response.ok) throw new Error("Authentication unavailable");
    const user = readUser(await response.json());
    if (!user) return NextResponse.redirect(login);
    if (request.nextUrl.pathname.startsWith("/admin") && user.role !== "admin") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    return NextResponse.next();
  } catch {
    login.searchParams.set("error", "unavailable");
    return NextResponse.redirect(login);
  }
}

export const config = { matcher: ["/home/:path*", "/learn/:path*", "/admin/:path*"] };
