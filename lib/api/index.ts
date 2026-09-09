/**
 * Data access layer.
 *
 * Catalog reads stay mocked from JSON so the demo runs without a server.
 * Chat generate + auth use fetch when NEXT_PUBLIC_API_URL is set
 * (see lib/api/remote.ts). Signatures match docs/API-CONTRACT.md.
 */

import chaptersJson from "@/content/chapters.json";
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

const chapters = chaptersJson as Chapter[];

export const GRADES: Grade[] = [10, 11, 12];

export const SUBJECTS: Subject[] = [
  { id: "math", nameKm: "គណិតវិទ្យា" },
  { id: "history", nameKm: "ប្រវត្តិវិទ្យា" },
];

export function getSubject(id: SubjectId): Subject {
  return SUBJECTS.find((s) => s.id === id)!;
}

/** GET /chapters?grade=&subject= — students only ever see approved chapters */
export function getApprovedChapters(grade: Grade, subject: SubjectId): Chapter[] {
  return chapters
    .filter((c) => c.grade === grade && c.subject === subject && c.status === "approved")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/** GET /chapters/:id */
export function getChapter(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

/** Next approved chapter in the same grade+subject, for the quiz success banner */
export function getNextChapter(current: Chapter): Chapter | undefined {
  return getApprovedChapters(current.grade, current.subject).find(
    (c) => c.sortOrder > current.sortOrder,
  );
}

/** GET /admin/chapters — admin sees drafts too */
export function getAllChapters(): Chapter[] {
  return [...chapters].sort(
    (a, b) => a.grade - b.grade || a.subject.localeCompare(b.subject) || a.sortOrder - b.sortOrder,
  );
}

/**
 * POST /chapters/:id/messages — mock study-buddy reply.
 * Matches keywords only for the current chapter so G10 answers
 * never appear on G11/G12 lessons (and vice versa).
 */
export function getMockTutorReply(
  userMessage: string,
  messageCount: number,
  chapterId: string,
): string {
  const { keywordReplies, fallbackReplies } = cannedRepliesJson;
  const lower = userMessage.toLowerCase();
  const match = keywordReplies.find(
    (entry) =>
      entry.chapters.includes(chapterId) &&
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
