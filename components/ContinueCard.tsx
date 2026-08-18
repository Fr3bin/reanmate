"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLastVisited, type LastVisited } from "@/lib/progress";
import { toKhmerNumber } from "@/lib/format";

const SUBJECT_LABELS: Record<string, string> = {
  math: "គណិតវិទ្យា",
  history: "ប្រវត្តិវិទ្យា",
};

export default function ContinueCard() {
  const [last, setLast] = useState<LastVisited | null>(null);

  useEffect(() => {
    setLast(getLastVisited());
  }, []);

  if (!last?.chapterId || !last.title) return null;

  return (
    <Link
      href={`/learn/${last.grade}/${last.subject}/${last.chapterId}`}
      className="flex flex-col gap-3 rounded-xl bg-primary p-5 text-white transition hover:bg-primary-dark sm:flex-row sm:items-center sm:justify-between sm:gap-4"
    >
      <div>
        <p className="text-sm text-gold">បន្តការសិក្សា</p>
        <p className="mt-1 text-lg font-bold">{last.title}</p>
        <p className="text-sm text-white/80">
          ថ្នាក់ទី{toKhmerNumber(last.grade)} · {SUBJECT_LABELS[last.subject] ?? last.subject}
        </p>
      </div>
      <span className="inline-flex w-full items-center justify-center rounded-md bg-cta px-4 py-2 text-sm font-bold sm:w-auto">
        បន្ត →
      </span>
    </Link>
  );
}
