"use client";

import { useEffect, useState } from "react";
import BackLink from "@/components/BackLink";
import ChapterEditor from "@/components/ChapterEditor";
import EmptyState from "@/components/EmptyState";
import PageTitle from "@/components/PageTitle";
import { getMergedChapter } from "@/lib/catalog-overlay";
import type { Chapter } from "@/lib/types";

export default function EditChapterClient({
  id,
  seed,
}: {
  id: string;
  seed: Chapter | null;
}) {
  const [chapter, setChapter] = useState<Chapter | null>(seed);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setChapter(getMergedChapter(id) ?? null);
    setHydrated(true);
  }, [id]);

  if (!hydrated && !chapter) {
    return <p className="text-sm text-ink-muted">កំពុងផ្ទុក…</p>;
  }

  if (!chapter) {
    return (
      <EmptyState
        title="រកមិនឃើញមេរៀន"
        body="មេរៀននេះមិនមានទេ ឬត្រូវបានលុបពីព្រាងលើឧបករណ៍នេះ។"
        actionHref="/admin"
        actionLabel="ត្រឡប់ទៅបញ្ជីមេរៀន"
      />
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-3xl">
        <BackLink href="/admin" label="ត្រឡប់ទៅបញ្ជីមេរៀន" />
      </div>
      <PageTitle className="mx-auto mt-3 max-w-3xl">
        កែសម្រួលមេរៀន — {chapter.title}
      </PageTitle>
      <div className="mt-6">
        <ChapterEditor key={chapter.id} chapter={chapter} />
      </div>
    </div>
  );
}
