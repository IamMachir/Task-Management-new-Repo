/**
 * Validate an email address
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate that a task title is non-empty and within length
 */
export function validateTaskTitle(title: string): string | null {
  if (!title || title.trim().length === 0) return "Title is required";
  if (title.trim().length < 2) return "Title must be at least 2 characters";
  if (title.length > 120) return "Title must be 120 characters or less";
  return null;
}

/**
 * Validate a date string is a valid future or present date
 */
export function validateDueDate(dateStr: string): string | null {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Invalid date";
  return null;
}

/**
 * Validate a project name
 */
export function validateProjectName(name: string): string | null {
  if (!name || name.trim().length === 0) return "Project name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  if (name.length > 60) return "Name must be 60 characters or less";
  return null;
}

/**
 * Validate a URL string
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
