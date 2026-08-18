import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import ChapterEditor from "@/components/ChapterEditor";
import PageTitle from "@/components/PageTitle";
import { getChapter } from "@/lib/api";

export default async function EditChapterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chapter = getChapter(id);
  if (!chapter) notFound();

  return (
    <div>
      <div className="mx-auto max-w-3xl">
        <BackLink href="/admin" label="ត្រឡប់ទៅបញ្ជីមេរៀន" />
      </div>
      <PageTitle className="mx-auto mt-3 max-w-3xl">
        កែសម្រួលមេរៀន — {chapter.title}
      </PageTitle>
      <div className="mt-6">
        <ChapterEditor chapter={chapter} />
      </div>
    </div>
  );
}
