/**
 * Data access layer.
 *
 * Every function mirrors an endpoint in docs/API-CONTRACT.md. Chapter data is
 * loaded from the Node.js + MongoDB backend; AI generation and chat replies are
 * still mocked until those backend parts are implemented.
 */

import cannedRepliesJson from "@/content/canned-replies.json";
import generatedSampleJson from "@/content/generated-sample.json";
import { isBackendConfigured } from "@/lib/config";
import type {
  Chapter,
  GeneratedChapterContent,
  Grade,
  Subject,
  SubjectId,
} from "@/lib/types";

export const GRADES: Grade[] = [10, 11, 12];

export const SUBJECTS: Subject[] = [
  { id: "math", nameKm: "គណិតវិទ្យា" },
  { id: "history", nameKm: "ប្រវត្តិវិទ្យា" },
];

export function getSubject(id: SubjectId): Subject {
  return SUBJECTS.find((s) => s.id === id)!;
}

async function apiFetch<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {};
  let url = path;
  if (typeof window === "undefined") {
    const { headers: nextHeaders } = await import("next/headers");
    const cookie = (await nextHeaders()).get("cookie");
    if (cookie) headers.cookie = cookie;
    url = `${process.env.API_URL ?? "http://localhost:4000"}${path}`;
  }
  const response = await fetch(url, {
    headers,
    credentials: "include",
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status} ${path}`);
  return response.json() as Promise<T>;
}

/** GET /chapters?grade=&subject= — students only ever see approved chapters */
export function getApprovedChapters(grade: Grade, subject: SubjectId): Promise<Chapter[]> {
  return apiFetch(`/chapters?grade=${grade}&subject=${subject}`);
}

/** GET /chapters/:id */
export async function getChapter(id: string): Promise<Chapter | undefined> {
  try {
    return await apiFetch(`/chapters/${encodeURIComponent(id)}`);
  } catch {
    return undefined;
  }
}

/** Next approved chapter in the same grade+subject, for the quiz success banner */
export async function getNextChapter(current: Chapter): Promise<Chapter | undefined> {
  return (await getApprovedChapters(current.grade, current.subject)).find(
    (c) => c.sortOrder > current.sortOrder,
  );
}

/** GET /admin/chapters — admin sees drafts too */
export function getAllChapters(): Promise<Chapter[]> {
  return apiFetch("/admin/chapters");
}

/**
 * POST /chapters/:id/messages — mock study-buddy reply.
 * Picks a keyword-matched canned reply, otherwise rotates fallbacks.
 */
export function getMockTutorReply(
  userMessage: string,
  messageCount: number,
  chapterId?: string,
): string {
  const { keywordReplies, fallbackReplies } = cannedRepliesJson;
  const lower = userMessage.toLowerCase();
  const match = keywordReplies.find(
    (entry) =>
      (!chapterId || entry.chapters.includes(chapterId)) &&
      entry.keywords.some((k) => lower.includes(k.toLowerCase())),
  );
  if (match) return match.reply;
  return fallbackReplies[messageCount % fallbackReplies.length];
}

/**
 * POST /admin/chapters/:id/generate — mock AI generation.
 * Resolves after a fake delay with sample content for the subject.
 */
export async function generateChapterContent(
  subject: SubjectId,
  chapterId?: string,
): Promise<GeneratedChapterContent> {
  if (isBackendConfigured() && chapterId) {
    const { generateChapterRemote } = await import("@/lib/api/remote");
    return generateChapterRemote(chapterId);
  }
  await new Promise((resolve) => setTimeout(resolve, 1800));
  return generatedSampleJson[subject] as GeneratedChapterContent;
}
