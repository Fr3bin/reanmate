"use client";

import { useEffect, useMemo, useState } from "react";
import BackLink from "@/components/BackLink";
import Breadcrumb from "@/components/Breadcrumb";
import ChapterCard from "@/components/ChapterCard";
import EmptyState from "@/components/EmptyState";
import PageTitle from "@/components/PageTitle";
import { getSubject } from "@/lib/api";
import { getMergedApproved } from "@/lib/catalog-overlay";
import { toKhmerNumber } from "@/lib/format";
import type { Chapter, Grade, SubjectId } from "@/lib/types";

export default function SubjectChapterList({
  grade,
  subjectId,
  seed,
}: {
  grade: Grade;
  subjectId: SubjectId;
  seed: Chapter[];
}) {
  const [chapters, setChapters] = useState(seed);
  const subject = useMemo(() => getSubject(subjectId), [subjectId]);

  useEffect(() => {
    setChapters(getMergedApproved(grade, subjectId));
  }, [grade, subjectId]);

  return (
    <div>
      <BackLink
        href={`/learn/${grade}`}
        label={`ត្រឡប់ទៅថ្នាក់ទី${toKhmerNumber(grade)}`}
      />
      <div className="mt-1 hidden sm:block">
        <Breadcrumb
          items={[
            { href: "/home", label: "ទំព័រដើម" },
            { href: `/learn/${grade}`, label: `ថ្នាក់ទី${toKhmerNumber(grade)}` },
            { label: subject.nameKm },
          ]}
        />
      </div>

      <PageTitle className="mt-4">
        {subject.nameKm} — ថ្នាក់ទី{toKhmerNumber(grade)}
      </PageTitle>

      {chapters.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="មេរៀននឹងមកដល់ឆាប់ៗ"
            body={`មេរៀន${subject.nameKm}សម្រាប់ថ្នាក់ទី${toKhmerNumber(grade)} កំពុងរៀបចំ។`}
            actionHref={`/learn/${grade}`}
            actionLabel={`ត្រឡប់ទៅថ្នាក់ទី${toKhmerNumber(grade)}`}
          />
        </div>
      ) : (
        <div className="stagger mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      )}
    </div>
  );
}
