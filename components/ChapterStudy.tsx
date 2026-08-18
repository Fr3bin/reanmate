"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ChatPanel from "@/components/ChatPanel";
import VideoEmbed from "@/components/VideoEmbed";
import { setLastVisited } from "@/lib/progress";
import type { Chapter } from "@/lib/types";

export default function ChapterStudy({ chapter }: { chapter: Chapter }) {
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    setLastVisited({
      chapterId: chapter.id,
      grade: chapter.grade,
      subject: chapter.subject,
      title: chapter.title,
    });
  }, [chapter]);

  const quizHref = `/learn/${chapter.grade}/${chapter.subject}/${chapter.id}/quiz`;

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-6">
      <div className="flex flex-col gap-6 pb-24 lg:pb-0">
        <VideoEmbed
          embedUrl={chapter.moeysEmbedUrl}
          credit={chapter.moeysCredit}
          title={chapter.title}
        />

        <section className="rounded-xl border border-line bg-surface">
          <div className="rounded-t-xl bg-section px-4 py-2">
            <h2 className="font-bold text-primary">សង្ខេបមេរៀន</h2>
          </div>
          <p className="whitespace-pre-line px-4 py-4 text-[15px]">{chapter.summary}</p>
        </section>

        <Link
          href={quizHref}
          className="min-h-12 rounded-xl bg-cta py-3.5 text-center text-lg font-bold text-white transition hover:bg-cta-dark"
        >
          ចាប់ផ្តើមតេស្ត
        </Link>
      </div>

      {/* Desktop: chat column */}
      <aside className="sticky top-20 hidden h-[calc(100vh-8rem)] overflow-hidden rounded-xl lg:block">
        <ChatPanel chapterId={chapter.id} />
      </aside>

      {/* Mobile: floating button + slide-over drawer */}
      <button
        type="button"
        onClick={() => setChatOpen(true)}
        className="fixed right-5 z-40 flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 py-3 font-bold text-white shadow-lg lg:hidden"
        style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        💬 សួរគ្រូ AI
      </button>

      {chatOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="បិទ"
            onClick={() => setChatOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="absolute inset-x-0 bottom-0 top-16 flex flex-col rounded-t-2xl bg-surface">
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="py-2 text-center text-sm text-ink-muted"
            >
              ▼ បិទ
            </button>
            <div className="min-h-0 flex-1 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className="h-full">
                <ChatPanel chapterId={chapter.id} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
