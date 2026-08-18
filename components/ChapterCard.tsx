"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isChapterCompleted } from "@/lib/progress";
import { toKhmerNumber } from "@/lib/format";
import type { Chapter } from "@/lib/types";

export default function ChapterCard({ chapter }: { chapter: Chapter }) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(isChapterCompleted(chapter.id));
  }, [chapter.id]);

  return (
    <Link
      href={`/learn/${chapter.grade}/${chapter.subject}/${chapter.id}`}
      className="group overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition hover:border-primary hover:shadow-md"
    >
      {/* Subject-colored thumbnail placeholder until real images exist */}
      <div
        className={`flex aspect-[16/7] items-center justify-center text-4xl font-black ${
          chapter.subject === "math"
            ? "bg-primary-light text-primary"
            : "bg-section text-cta"
        }`}
      >
        {chapter.subject === "math" ? "∑" : "🏛"}
      </div>

      <div className="p-4">
        <p className="text-sm text-ink-muted">មេរៀនទី{toKhmerNumber(chapter.sortOrder)}</p>
        <h3 className="mt-1 text-lg font-bold text-ink group-hover:text-primary">
          {chapter.title}
        </h3>
        <div className="mt-3">
          {completed ? (
            <span className="inline-block rounded-full bg-success-soft px-3 py-1 text-xs font-bold text-success">
              ✓ បានបញ្ចប់
            </span>
          ) : (
            <span className="inline-block rounded-full bg-bg px-3 py-1 text-xs font-medium text-ink-muted">
              មិនទាន់បញ្ចប់
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
