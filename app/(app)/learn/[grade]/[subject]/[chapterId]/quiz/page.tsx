import QuizLoader from "@/components/QuizLoader";
import { getChapter } from "@/lib/api";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ grade: string; subject: string; chapterId: string }>;
}) {
  const { chapterId } = await params;
  const seed = getChapter(chapterId) ?? null;
  return <QuizLoader chapterId={chapterId} seed={seed} />;
}
