import { apiFetch } from "@/lib/api/http";
import type {
  AuthResponse,
  ChatMessage,
  GeneratedChapterContent,
} from "@/lib/types";

export function loginRemote(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signupRemote(
  email: string,
  password: string,
  displayName?: string,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, displayName }),
  });
}

export function sendChapterMessage(
  chapterId: string,
  content: string,
): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }> {
  return apiFetch(`/chapters/${chapterId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export function generateChapterRemote(
  chapterId: string,
): Promise<GeneratedChapterContent> {
  return apiFetch(`/admin/chapters/${chapterId}/generate`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}
