import { getApiBaseUrl } from "@/lib/config";
import { getToken } from "@/lib/auth";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const base = getApiBaseUrl();
  if (!base) {
    throw new ApiError(0, "no_backend", "ម៉ាស៊ីនមេមិនទាន់ភ្ជាប់ទេ។");
  }

  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  const token = typeof window !== "undefined" ? getToken() : null;
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${base}${path}`, { ...init, headers });
  const text = await response.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }

  if (!response.ok) {
    const err = json as { error?: { code?: string; message?: string } } | null;
    throw new ApiError(
      response.status,
      err?.error?.code ?? "http_error",
      err?.error?.message ?? `សំណើបរាជ័យ (${response.status})`,
    );
  }

  return json as T;
}
