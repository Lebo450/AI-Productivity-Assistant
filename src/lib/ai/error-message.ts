export function readableError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  if (!raw.trim()) return "Something went wrong. Please try again.";
  try {
    const parsed = JSON.parse(raw);
    const message = parsed?.error?.message || parsed?.error || parsed?.message;
    if (typeof message === "string" && message.trim()) return message.trim();
  } catch {
    // Not JSON, so the message arrived as plain text and can be shown as is.
  }
  return raw;
}
