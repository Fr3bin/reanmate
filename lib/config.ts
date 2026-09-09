/** Public API base, e.g. http://localhost:4000/api — empty means mock mode. */
export function getApiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
}

export function isBackendConfigured(): boolean {
  return getApiBaseUrl().length > 0;
}
