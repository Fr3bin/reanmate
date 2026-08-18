/**
 * Data access layer — mock implementation.
 *
 * Every function mirrors an endpoint in docs/API-CONTRACT.md. When the
 * Node.js + MongoDB backend is ready, replace the bodies with fetch calls;
 * signatures and return types must stay the same.
 */

import chaptersJson from "@/content/chapters.json";
import cannedRepliesJson from "@/content/canned-replies.json";
import generatedSampleJson from "@/content/generated-sample.json";
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
 * POST /chapters/:id/messages — mock tutor reply.
 * Picks a keyword-matched canned reply, otherwise rotates fallbacks.
 */
export function getMockTutorReply(userMessage: string, messageCount: number): string {
  const { keywordReplies, fallbackReplies } = cannedRepliesJson;
  const lower = userMessage.toLowerCase();
  const match = keywordReplies.find((entry) =>
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
): Promise<GeneratedChapterContent> {
  await new Promise((resolve) => setTimeout(resolve, 1800));
  return generatedSampleJson[subject] as GeneratedChapterContent;
}
