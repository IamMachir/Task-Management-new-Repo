/**
 * Save data to localStorage with error handling
 */
export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.warn(`Failed to save "${key}" to localStorage`);
  }
}

/**
 * Load data from localStorage with a fallback default
 */
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Remove a key from localStorage
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    console.warn(`Failed to remove "${key}" from localStorage`);
  }
}

/**
 * Clear all app-related keys from localStorage
 */
export function clearStorage(prefix: string): void {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(prefix));
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    console.warn("Failed to clear localStorage");
  }
}

/**
 * Storage keys for TeamFlow
 */
export const TEAMFLOW_KEYS = {
  TASKS: "teamflow:tasks",
  PROJECTS: "teamflow:projects",
  MEMBERS: "teamflow:members",
  ACTIVE_PROJECT: "teamflow:activeProject",
} as const;

/**
 * Storage keys for PersonalFocus
 */
export const PERSONALFOCUS_KEYS = {
  TASKS: "personalfocus:tasks",
  HABITS: "personalfocus:habits",
  SETTINGS: "personalfocus:settings",
  POMODORO: "personalfocus:pomodoro",
} as const;
