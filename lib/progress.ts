/**
 * Client-side progress + chat persistence (localStorage).
 * Stands in for backend endpoints until the Node/Mongo API exists.
 */

import type { ChatMessage } from "@/lib/types";

const PROGRESS_KEY = "ai-tutor:progress";
const LAST_CHAPTER_KEY = "ai-tutor:last-chapter";
const chatKey = (chapterId: string) => `ai-tutor:chat:${chapterId}`;

export interface StoredProgress {
  [chapterId: string]: { bestScorePercent: number; completedAt: string | null };
}

export interface LastVisited {
  chapterId: string;
  grade: number;
  subject: string;
  title: string;
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getProgress(): StoredProgress {
  if (typeof window === "undefined") return {};
  return safeParse(localStorage.getItem(PROGRESS_KEY), {});
}

export function recordQuizResult(chapterId: string, scorePercent: number): void {
  const progress = getProgress();
  const existing = progress[chapterId];
  const best = Math.max(existing?.bestScorePercent ?? 0, scorePercent);
  progress[chapterId] = {
    bestScorePercent: best,
    completedAt:
      existing?.completedAt ?? (scorePercent >= 70 ? new Date().toISOString() : null),
  };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function isChapterCompleted(chapterId: string): boolean {
  return Boolean(getProgress()[chapterId]?.completedAt);
}

export function setLastVisited(visit: LastVisited): void {
  localStorage.setItem(LAST_CHAPTER_KEY, JSON.stringify(visit));
}

export function getLastVisited(): LastVisited | null {
  if (typeof window === "undefined") return null;
  return safeParse<LastVisited | null>(localStorage.getItem(LAST_CHAPTER_KEY), null);
}

export function getChatHistory(chapterId: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  return safeParse<ChatMessage[]>(localStorage.getItem(chatKey(chapterId)), []);
}

export function saveChatHistory(chapterId: string, messages: ChatMessage[]): void {
  localStorage.setItem(chatKey(chapterId), JSON.stringify(messages));
}
