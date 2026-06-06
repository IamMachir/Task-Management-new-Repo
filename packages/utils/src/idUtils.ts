/**
 * Generate a unique ID using a combination of timestamp and random string
 */
export function generateId(prefix?: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  const id = `${timestamp}-${random}`;
  return prefix ? `${prefix}-${id}` : id;
}

/**
 * Generate a short readable ID
 */
export function generateShortId(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

/**
 * Generate a slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
