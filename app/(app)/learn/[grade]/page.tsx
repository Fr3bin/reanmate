import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import PageTitle from "@/components/PageTitle";
import { GRADES, SUBJECTS, getApprovedChapters } from "@/lib/api";
import { toKhmerNumber } from "@/lib/format";
import type { Grade } from "@/lib/types";

const SUBJECT_ICONS: Record<string, string> = { math: "∑", history: "🏛" };

export default async function GradePage({
  params,
}: {
  params: Promise<{ grade: string }>;
}) {
  const { grade: gradeParam } = await params;
  const grade = Number(gradeParam) as Grade;
  if (!GRADES.includes(grade)) notFound();

  return (
    <div>
      <Breadcrumb
        items={[
          { href: "/home", label: "ទំព័រដើម" },
          { label: `ថ្នាក់ទី${toKhmerNumber(grade)}` },
        ]}
      />

      <PageTitle className="mt-4">
        ថ្នាក់ទី{toKhmerNumber(grade)} — ជ្រើសរើសមុខវិជ្ជា
      </PageTitle>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5">
        {SUBJECTS.map((subject) => {
          const count = getApprovedChapters(grade, subject.id).length;
          return (
            <Link
              key={subject.id}
              href={`/learn/${grade}/${subject.id}`}
              className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:border-primary hover:shadow-md sm:gap-5 sm:p-6"
            >
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl font-black sm:h-16 sm:w-16 ${
                  subject.id === "math"
                    ? "bg-primary-light text-primary"
                    : "bg-section text-cta"
                }`}
              >
                {SUBJECT_ICONS[subject.id]}
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
              <span className="hidden text-primary/40 group-hover:text-primary sm:inline">
                →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
