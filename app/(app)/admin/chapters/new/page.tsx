import ChapterEditor from "@/components/ChapterEditor";
import PageTitle from "@/components/PageTitle";

export default function NewChapterPage() {
  return (
    <div>
      <PageTitle className="mx-auto max-w-3xl">បង្កើតមេរៀនថ្មី</PageTitle>
      <div className="mt-6">
        <ChapterEditor chapter={null} />
      </div>
    </div>
  );
}
