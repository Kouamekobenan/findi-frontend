export function safeImageUrl(url: string | undefined | null, fallback: string): string {
  if (!url) return fallback;
  if (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return fallback;
}
