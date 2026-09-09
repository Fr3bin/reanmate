import { notFound } from "next/navigation";
import SubjectChapterList from "@/components/SubjectChapterList";
import { GRADES, SUBJECTS, getApprovedChapters } from "@/lib/api";
import type { Grade, SubjectId } from "@/lib/types";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ grade: string; subject: string }>;
}) {
  const { grade: gradeParam, subject: subjectParam } = await params;
  const grade = Number(gradeParam) as Grade;
  const subjectId = subjectParam as SubjectId;
  if (!GRADES.includes(grade) || !SUBJECTS.some((s) => s.id === subjectId)) {
    notFound();
  }

  const seed = getApprovedChapters(grade, subjectId);

  return <SubjectChapterList grade={grade} subjectId={subjectId} seed={seed} />;
}
