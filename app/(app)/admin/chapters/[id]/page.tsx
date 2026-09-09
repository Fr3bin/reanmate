import EditChapterClient from "@/components/EditChapterClient";
import { getChapter } from "@/lib/api";

export default async function EditChapterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seed = getChapter(id) ?? null;
  return <EditChapterClient id={id} seed={seed} />;
}
