export default function VideoEmbed({
  embedUrl,
  credit,
  title,
}: {
  embedUrl: string;
  credit: string;
  title: string;
}) {
  return (
    <div id="lesson-video" className="ui-card overflow-hidden">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="aspect-video w-full bg-black"
        />
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
