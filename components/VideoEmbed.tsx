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
    <div>
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full rounded-xl border border-line bg-black"
        />
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl bg-primary-dark text-white">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-2xl text-primary-dark">
            ▶
          </span>
          <p className="text-sm text-white/80">វីដេអូមេរៀន MoEYS នឹងបង្ហាញនៅទីនេះ</p>
        </div>
      )}
      <p className="mt-2 text-xs text-ink-muted">{credit}</p>
    </div>
  );
}
