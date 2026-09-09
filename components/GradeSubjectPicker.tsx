"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BackLink from "@/components/BackLink";
import Breadcrumb from "@/components/Breadcrumb";
import PageTitle from "@/components/PageTitle";
import { SUBJECTS } from "@/lib/api";
import { getMergedApproved } from "@/lib/catalog-overlay";
import { toKhmerNumber } from "@/lib/format";
import type { Grade, SubjectId } from "@/lib/types";

export default function GradeSubjectPicker({
  grade,
  seedCounts,
}: {
  grade: Grade;
  seedCounts: Record<SubjectId, number>;
}) {
  const [counts, setCounts] = useState(seedCounts);

  useEffect(() => {
    setCounts({
      math: getMergedApproved(grade, "math").length,
      history: getMergedApproved(grade, "history").length,
    });
  }, [grade]);

  return (
    <div>
      <BackLink href="/home" label="ត្រឡប់ទៅទំព័រដើម" />
      <div className="mt-1 hidden sm:block">
        <Breadcrumb
          items={[
            { href: "/home", label: "ទំព័រដើម" },
            { label: `ថ្នាក់ទី${toKhmerNumber(grade)}` },
          ]}
        />
      </div>

      <PageTitle className="mt-4">
        ថ្នាក់ទី{toKhmerNumber(grade)} — ជ្រើសរើសមុខវិជ្ជា
      </PageTitle>

      <div className="stagger mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5">
        {SUBJECTS.map((subject) => {
          const count = counts[subject.id];
          return (
            <Link
              key={subject.id}
              href={`/learn/${grade}/${subject.id}`}
              className="group ui-card flex items-center gap-4 p-5 sm:gap-5 sm:p-6"
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-semibold sm:h-14 sm:w-14 ${
                  subject.id === "math"
                    ? "bg-primary-light text-primary"
                    : "bg-section text-primary"
                }`}
              >
                {subject.id === "math" ? "គ" : "ប"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-ink group-hover:text-primary">
                  {subject.nameKm}
                </p>
                <p className="text-sm text-ink-muted">
                  {count > 0
                    ? `មេរៀនចំនួន ${toKhmerNumber(count)}`
                    : "មេរៀននឹងមកដល់ឆាប់ៗ"}
                </p>
              </div>
              <span className="text-primary/50 transition group-hover:translate-x-1 group-hover:text-primary">
                →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
