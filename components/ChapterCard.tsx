"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isChapterCompleted } from "@/lib/progress";
import { toKhmerNumber } from "@/lib/format";
import { isExternalLessonUrl, youtubeThumbUrl } from "@/lib/youtube";
import type { Chapter } from "@/lib/types";

export default function ChapterCard({ chapter }: { chapter: Chapter }) {
  const [completed, setCompleted] = useState(false);
  const thumb = youtubeThumbUrl(chapter.moeysEmbedUrl);
  const ebcLinked = isExternalLessonUrl(chapter.moeysEmbedUrl);

  useEffect(() => {
    setCompleted(isChapterCompleted(chapter.id));
  }, [chapter.id]);

  return (
    <Link
      href={`/learn/${chapter.grade}/${chapter.subject}/${chapter.id}`}
      className="ui-card group overflow-hidden"
    >
      <div
        className={`relative flex aspect-[16/8] items-end overflow-hidden px-4 py-3 ${
          chapter.subject === "math" ? "bg-primary-dark" : "bg-[#5c2e2e]"
        }`}
      >
        {thumb ? (
          <img
            src={thumb}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <div
          className={`absolute inset-0 ${
            thumb
              ? "bg-gradient-to-t from-black/70 via-black/20 to-black/10"
              : chapter.subject === "math"
                ? "bg-gradient-to-br from-primary-dark to-primary"
                : "bg-gradient-to-br from-[#5c2e2e] to-[#8a4545]"
          }`}
        />
        {completed ? (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-success px-2.5 py-0.5 text-[10px] font-semibold text-white">
            បានបញ្ចប់
          </span>
        ) : ebcLinked ? (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold text-gold">
            EBC
          </span>
        ) : null}
        <span className="absolute right-4 top-4 z-10 text-4xl text-white/25">
          {chapter.subject === "math" ? "គ" : "ប"}
        </span>
        <p className="relative z-10 text-xs font-semibold text-gold">
          មេរៀនទី{toKhmerNumber(chapter.sortOrder)}
        </p>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-ink group-hover:text-primary">
          {chapter.title}
        </h3>
        <p className="mt-1 text-xs text-ink-muted">
          វីដេអូ · AI · តេស្ត {toKhmerNumber(chapter.questions.length)} សំណួរ
        </p>
        <p className={`mt-3 text-sm font-semibold ${completed ? "text-success" : "text-cta"}`}>
          {completed ? "មើលម្តងទៀត →" : "ចូលរៀន →"}
        </p>
      </div>
    </Link>
  );
}
