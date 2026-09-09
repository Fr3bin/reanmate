/** Extract an 11-character YouTube video id from an embed or watch URL. */
export function youtubeIdFromUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return match?.[1] ?? null;
}

export function youtubeEmbedSrc(url: string): string | null {
  const id = youtubeIdFromUrl(url);
  return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
}

export function youtubeThumbUrl(url: string): string | null {
  const id = youtubeIdFromUrl(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

/** Lesson page on EBC (not embeddable; open in a new tab). */
export function isExternalLessonUrl(url: string): boolean {
  if (!url.trim() || youtubeIdFromUrl(url)) return false;
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host === "ebc.edu.kh" || host.endsWith(".ebc.edu.kh");
  } catch {
    return false;
  }
}
