/**
 * Save data to localStorage with error handling
 */
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    if (typeof window === 'undefined') return; // Skip during SSR
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error(`Failed to save to localStorage with key "${key}":`, error);
    throw new Error(`Failed to save data to localStorage`);
  }
};

/**
 * Load data from localStorage with error handling
 */
export const loadFromLocalStorage = <T>(key: string): T | null => {
  try {
    if (typeof window === 'undefined') return null; // Skip during SSR
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error(`Failed to load from localStorage with key "${key}":`, error);
    return null;
  }
};

/**
 * Remove data from localStorage
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    if (typeof window === 'undefined') return; // Skip during SSR
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove from localStorage with key "${key}":`, error);
  }
};

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false; // Skip during SSR
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};
