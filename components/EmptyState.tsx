export default function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line bg-surface px-6 py-14 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-section text-3xl">
        📚
      </span>
      <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">{body}</p>
    </div>
  );
}
