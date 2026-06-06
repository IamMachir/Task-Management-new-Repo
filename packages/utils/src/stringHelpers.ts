/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate a string to maxLen characters
 */
export function truncate(str: string, maxLen: number, ellipsis = "..."): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - ellipsis.length) + ellipsis;
}

/**
 * Get initials from a full name (e.g. "John Doe" → "JD")
 */
export function getInitials(name: string, maxChars = 2): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .slice(0, maxChars)
    .join("");
}

/**
 * Convert camelCase / PascalCase to a readable title
 */
export function toTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Check if a string is empty or whitespace only
 */
export function isBlank(str: string | undefined | null): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Count words in a string
 */
export function wordCount(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Highlight matching substring (returns parts for rendering)
 */
export function highlightMatch(
  text: string,
  query: string
): { text: string; highlight: boolean }[] {
  if (!query) return [{ text, highlight: false }];
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.split(regex).map((part) => ({
    text: part,
    highlight: regex.test(part),
  }));
}
