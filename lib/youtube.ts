/** Extract an 11-character YouTube video id from an embed or watch URL. */
export function youtubeIdFromUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return match?.[1] ?? null;
}

export function youtubeThumbUrl(url: string): string | null {
  const id = youtubeIdFromUrl(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
