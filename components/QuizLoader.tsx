"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import QuizRunner from "@/components/QuizRunner";
import { getMergedChapter, getMergedNext } from "@/lib/catalog-overlay";
import type { Chapter } from "@/lib/types";

export default function QuizLoader({
  chapterId,
  seed,
}: {
  chapterId: string;
  seed: Chapter | null;
}) {
  const [chapter, setChapter] = useState<Chapter | null>(
    seed?.status === "approved" ? seed : null,
  );
  const [nextChapter, setNextChapter] = useState<{
    id: string;
    title: string;
    grade: number;
    subject: string;
  } | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const merged = getMergedChapter(chapterId);
    const approved = merged?.status === "approved" ? merged : null;
    setChapter(approved);
    if (approved) {
      const next = getMergedNext(approved);
      setNextChapter(
        next
          ? {
              id: next.id,
              title: next.title,
              grade: next.grade,
              subject: next.subject,
            }
          : null,
      );
    } else {
      setNextChapter(null);
    }
    setHydrated(true);
  }, [chapterId]);

  if (!chapter) {
    if (!hydrated) {
      return <p className="text-sm text-ink-muted">កំពុងផ្ទុក…</p>;
    }
    return (
      <EmptyState
        title="រកមិនឃើញតេស្ត"
        body="មេរៀននេះមិនមាន ឬមិនទាន់អនុម័តទេ។"
        actionHref="/home"
        actionLabel="ត្រឡប់ទៅទំព័រដើម"
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <QuizRunner chapter={chapter} nextChapter={nextChapter} />
    </div>
  );
}
