import { isExternalLessonUrl, youtubeEmbedSrc } from "@/lib/youtube";

export default function VideoEmbed({
  embedUrl,
  credit,
  title,
}: {
  embedUrl: string;
  credit: string;
  title: string;
}) {
  const youtubeSrc = youtubeEmbedSrc(embedUrl);
  const external = isExternalLessonUrl(embedUrl);

  return (
    <div id="lesson-video" className="ui-card overflow-hidden">
      {youtubeSrc ? (
        <iframe
          src={youtubeSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="aspect-video w-full bg-black"
        />
      ) : external ? (
        <a
          href={embedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden bg-primary-dark px-5 text-white"
        >
          <p className="absolute left-4 top-4 rounded-full bg-black/25 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-gold">
            EBC
          </p>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-2xl text-primary-dark">
            ▶
          </span>
          <p className="mt-3 max-w-xs text-center text-sm font-medium leading-relaxed">{title}</p>
          <p className="mt-2 max-w-sm text-center text-xs leading-relaxed text-white/70">
            វីដេអូមេរៀននេះស្ថិតនៅលើគេហទំព័រ EBC (ត្រូវថ្នាក់ និងមេរៀននេះ)។ ចុចដើម្បីមើល — អាចត្រូវការចូលគណនី EBC។
          </p>
          <span className="mt-4 rounded-full bg-cta px-4 py-2 text-sm font-semibold text-white">
            មើលវីដេអូនៅ EBC
          </span>
        </a>
      ) : (
        <div className="relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden bg-primary-dark px-5 text-white">
          <p className="absolute left-4 top-4 rounded-full bg-black/25 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-gold">
            មេរៀន
          </p>
          <p className="max-w-xs text-center text-sm font-medium leading-relaxed">{title}</p>
          <p className="mt-2 max-w-xs text-center text-xs leading-relaxed text-white/55">
            វីដេអូមេរៀនសម្រាប់ថ្នាក់ និងមេរៀននេះនឹងបង្ហាញនៅទីនេះ។ សូមអានសង្ខេបខាងក្រោមជាមុនសិន។
          </p>
        </div>
      )}
      <p className="border-t border-line px-4 py-2.5 text-xs leading-relaxed text-ink-muted">
        {credit}
      </p>
    </div>
  );
}
