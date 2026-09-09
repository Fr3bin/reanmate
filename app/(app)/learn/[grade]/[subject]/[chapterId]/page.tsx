import ChapterStudyLoader from "@/components/ChapterStudyLoader";
import { getChapter } from "@/lib/api";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ grade: string; subject: string; chapterId: string }>;
}) {
  const { chapterId } = await params;
  const seed = getChapter(chapterId) ?? null;
  return <ChapterStudyLoader chapterId={chapterId} seed={seed} />;
}
