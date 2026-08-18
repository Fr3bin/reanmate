import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ChapterStudy from "@/components/ChapterStudy";
import { getChapter, getSubject } from "@/lib/api";
import { toKhmerNumber } from "@/lib/format";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ grade: string; subject: string; chapterId: string }>;
}) {
  const { chapterId } = await params;
  const chapter = getChapter(chapterId);
  if (!chapter || chapter.status !== "approved") notFound();

  const subject = getSubject(chapter.subject);

  return (
    <div>
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

      <h1 className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold text-primary sm:text-2xl">
        មេរៀនទី{toKhmerNumber(chapter.sortOrder)} — {chapter.title}
      </h1>

      <div className="mt-5">
        <ChapterStudy chapter={chapter} />
      </div>
    </div>
  );
}
