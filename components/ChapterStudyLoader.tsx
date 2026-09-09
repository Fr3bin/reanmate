"use client";

import { useEffect, useState } from "react";
import BackLink from "@/components/BackLink";
import Breadcrumb from "@/components/Breadcrumb";
import ChapterStudy from "@/components/ChapterStudy";
import EmptyState from "@/components/EmptyState";
import PageTitle from "@/components/PageTitle";
import { getSubject } from "@/lib/api";
import { getMergedChapter } from "@/lib/catalog-overlay";
import { toKhmerNumber } from "@/lib/format";
import type { Chapter } from "@/lib/types";

export default function ChapterStudyLoader({
  chapterId,
  seed,
}: {
  chapterId: string;
  seed: Chapter | null;
}) {
  const [chapter, setChapter] = useState<Chapter | null>(
    seed?.status === "approved" ? seed : null,
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const merged = getMergedChapter(chapterId);
    setChapter(merged?.status === "approved" ? merged : null);
    setHydrated(true);
  }, [chapterId]);

  if (!chapter) {
    if (!hydrated) {
      return <p className="text-sm text-ink-muted">កំពុងផ្ទុក…</p>;
    }
    return (
      <EmptyState
        title="រកមិនឃើញមេរៀន"
        body="មេរៀននេះមិនមាន ឬមិនទាន់អនុម័តទេ។"
        actionHref="/home"
        actionLabel="ត្រឡប់ទៅទំព័រដើម"
      />
    );
  }

  const subject = getSubject(chapter.subject);

  return (
    <div>
      <BackLink
        href={`/learn/${chapter.grade}/${chapter.subject}`}
        label={`ត្រឡប់ទៅ${subject.nameKm}`}
      />
      <div className="mt-1 hidden sm:block">
        <Breadcrumb
          items={[
            { href: "/home", label: "ទំព័រដើម" },
            {
              href: `/learn/${chapter.grade}`,
              label: `ថ្នាក់ទី${toKhmerNumber(chapter.grade)}`,
            },
            {
              href: `/learn/${chapter.grade}/${chapter.subject}`,
              label: subject.nameKm,
            },
            { label: chapter.title },
          ]}
        />
      </div>

      <PageTitle className="mt-4">
        មេរៀនទី{toKhmerNumber(chapter.sortOrder)} — {chapter.title}
      </PageTitle>

      <div className="mt-5">
        <ChapterStudy chapter={chapter} />
      </div>
    </div>
  );
}
