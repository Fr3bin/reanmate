import { notFound } from "next/navigation";
import GradeSubjectPicker from "@/components/GradeSubjectPicker";
import { GRADES, SUBJECTS, getApprovedChapters } from "@/lib/api";
import type { Grade, SubjectId } from "@/lib/types";

export default async function GradePage({
  params,
}: {
  params: Promise<{ grade: string }>;
}) {
  const { grade: gradeParam } = await params;
  const grade = Number(gradeParam) as Grade;
  if (!GRADES.includes(grade)) notFound();

  const seedCounts = Object.fromEntries(
    SUBJECTS.map((subject) => [subject.id, getApprovedChapters(grade, subject.id).length]),
  ) as Record<SubjectId, number>;

  return <GradeSubjectPicker grade={grade} seedCounts={seedCounts} />;
}
