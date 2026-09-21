import type { User } from "@/lib/types";
import { readUser } from "@/lib/auth-user";
export { homeForRole } from "@/lib/auth-user";

export class AuthError extends Error {
  constructor(public status: number, public code?: string) {
    super(code ?? "AUTHENTICATION_FAILED");
  }
}

async function request(path: string, body?: Record<string, string>): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(`/auth/${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      credentials: "include",
      cache: "no-store",
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new AuthError(503, "SERVICE_UNAVAILABLE");
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    console.error(`[Auth] ${path} failed:`, response.status, payload);
    throw new AuthError(response.status, payload?.code);
  }
  return payload;
}

async function authenticate(path: string, body: Record<string, string>): Promise<User> {
  const user = readUser(await request(path, body));
  if (!user) throw new AuthError(502, "INVALID_RESPONSE");
  return user;
}

export function login(email: string, password: string): Promise<User> {
  return authenticate("sign-in/email", { email: email.trim().toLowerCase(), password });
}

export async function sendPasswordResetCode(email: string): Promise<void> {
  await request("email-otp/request-password-reset", {
    email: email.trim().toLowerCase(),
  });
}

export async function resetPassword(email: string, code: string, password: string): Promise<void> {
  await request("email-otp/reset-password", {
    email: email.trim().toLowerCase(),
    otp: code.trim(),
    password,
  });
}

export function signup(email: string, password: string, displayName: string): Promise<User> {
  return authenticate("sign-up/email", {
    email: email.trim().toLowerCase(), password, name: displayName.trim(),
  });
}

export async function signInWithGoogle(callbackURL: string): Promise<void> {
  const payload = await request("sign-in/social", {
    provider: "google",
    callbackURL,
    errorCallbackURL: "/login",
  });
  if (!payload || typeof payload !== "object" || !("url" in payload)) {
    throw new AuthError(502, "INVALID_RESPONSE");
  }
  const url = (payload as { url?: unknown }).url;
  if (typeof url !== "string" || !url) throw new AuthError(502, "INVALID_RESPONSE");
  window.location.assign(url);
}

export async function getSession(): Promise<User | null> {
  return readUser(await request("get-session"));
}

export async function clearSession(): Promise<void> {
  await request("sign-out", {});
}

export function authErrorMessage(error: unknown, signup = false): string {
  if (error instanceof AuthError) {
    if (error.status >= 500) return "មិនអាចភ្ជាប់សេវាបានទេ។ សូមព្យាយាមម្ដងទៀត។";
    if (error.status === 429) return "អ្នកបានព្យាយាមច្រើនដងពេក។ សូមរង់ចាំមួយនាទី។";
    if (error.code === "INVALID_OTP") return "លេខកូដមិនត្រឹមត្រូវទេ។";
    if (error.code === "OTP_EXPIRED") return "លេខកូដផុតកំណត់ហើយ។ សូមផ្ញើកូដថ្មី។";
    if (error.code === "PROVIDER_NOT_FOUND") return "Google sign-in មិនទាន់បានកំណត់ទេ។";
    if (error.code === "USER_ALREADY_EXISTS" || error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
      return "អ៊ីមែលនេះមានគណនីរួចហើយ។ សូមចូលគណនី។";
    }
    // Surface the real error code so the developer can diagnose the problem.
    if (error.code) return `Auth error: ${error.code} (${error.status})`;
  }
  return signup ? "មិនអាចបង្កើតគណនីបានទេ។ សូមពិនិត្យព័ត៌មានរបស់អ្នក។"
    : "អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ។";
}
