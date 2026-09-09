/**
 * Client-side catalog overlay (localStorage).
 * Admin save/approve writes here until the Node/Mongo API exists.
 * Overlay chapters win on id merge with the JSON seed in lib/api.
 */

import { getAllChapters } from "@/lib/api";
import type { Chapter, Grade, SubjectId } from "@/lib/types";

const OVERLAY_KEY = "reanmate:catalog-overlay";

export type CatalogOverlay = Record<string, Chapter>;

function safeParse(raw: string | null): CatalogOverlay {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as CatalogOverlay;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

export function readOverlay(): CatalogOverlay {
  if (typeof window === "undefined") return {};
  return safeParse(localStorage.getItem(OVERLAY_KEY));
}

export function upsertChapter(chapter: Chapter): void {
  const overlay = readOverlay();
  overlay[chapter.id] = chapter;
  localStorage.setItem(OVERLAY_KEY, JSON.stringify(overlay));
}

export function mergeCatalog(base: Chapter[] = getAllChapters()): Chapter[] {
  const overlay = readOverlay();
  const byId = new Map(base.map((chapter) => [chapter.id, chapter]));
  for (const chapter of Object.values(overlay)) {
    if (chapter?.id) byId.set(chapter.id, chapter);
  }
  return [...byId.values()].sort(
    (a, b) =>
      a.grade - b.grade ||
      a.subject.localeCompare(b.subject) ||
      a.sortOrder - b.sortOrder,
  );
}

export function getMergedChapter(id: string): Chapter | undefined {
  return mergeCatalog().find((chapter) => chapter.id === id);
}

export function getMergedApproved(grade: Grade, subject: SubjectId): Chapter[] {
  return mergeCatalog().filter(
    (chapter) =>
      chapter.grade === grade &&
      chapter.subject === subject &&
      chapter.status === "approved",
  );
}

export function getMergedNext(current: Chapter): Chapter | undefined {
  return getMergedApproved(current.grade, current.subject).find(
    (chapter) => chapter.sortOrder > current.sortOrder,
  );
}

export function nextLocalChapterId(grade: Grade, subject: SubjectId): string {
  const existing = mergeCatalog().filter(
    (chapter) => chapter.grade === grade && chapter.subject === subject,
  );
  let n = existing.length + 1;
  let id = `local-${grade}-${subject}-${n}`;
  const ids = new Set(mergeCatalog().map((chapter) => chapter.id));
  while (ids.has(id)) {
    n += 1;
    id = `local-${grade}-${subject}-${n}`;
  }
  return id;
}
