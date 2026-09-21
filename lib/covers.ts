import type { Grade, SubjectId } from "@/lib/types";

/** Official MoEYS student-book covers stored in /public/covers */
export function textbookCoverSrc(grade: Grade, subject: SubjectId): string {
  return `/covers/g${grade}-${subject}.jpg`;
}
