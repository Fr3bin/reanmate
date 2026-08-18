import Link from "next/link";
import { notFound } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import QuizRunner from "@/components/QuizRunner";
import { getChapter, getNextChapter, getSubject } from "@/lib/api";
import { toKhmerNumber } from "@/lib/format";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ grade: string; subject: string; chapterId: string }>;
}) {
  const { chapterId } = await params;
  const chapter = getChapter(chapterId);
  if (!chapter || chapter.status !== "approved") notFound();

  const subject = getSubject(chapter.subject);
  const next = getNextChapter(chapter);

  return (
    <div className="mx-auto max-w-3xl">
      <nav className="text-sm text-ink-muted">
        <Link
          href={`/learn/${chapter.grade}/${chapter.subject}/${chapter.id}`}
          className="hover:text-primary"
        >
          ← ត្រឡប់ទៅមេរៀន
        </Link>
      </nav>

      <PageTitle className="mt-4">
        តេស្ត — {chapter.title} ({subject.nameKm} ថ្នាក់ទី
        {toKhmerNumber(chapter.grade)})
      </PageTitle>

      <div className="mt-6">
        <QuizRunner
          chapter={chapter}
          nextChapter={
            next
              ? {
                  id: next.id,
                  title: next.title,
                  grade: next.grade,
                  subject: next.subject,
                }
              : null
          }
        />
      </div>
    </div>
  );
}
