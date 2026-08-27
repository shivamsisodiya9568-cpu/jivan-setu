import { SavedProgress, CleanupSettings } from '../types/reader';

const STORAGE_KEY_PROGRESS = 'readtriangle_progress';
const STORAGE_KEY_CLEANUP = 'readtriangle_cleanup_settings';

export class StorageService {
  /**
   * Save reading position and settings
   */
  public static saveProgress(progress: SavedProgress): void {
    try {
      const existing = this.getAllProgress();
      const filtered = existing.filter(p => p.documentId !== progress.documentId);
      filtered.unshift(progress);
      // Keep top 10 recent documents
      const trimmed = filtered.slice(0, 10);
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(trimmed));
    } catch (err) {
      console.warn('Could not save progress to localStorage:', err);
    }
  }

  /**
   * Get progress for a specific document ID or file name
   */
  public static getProgress(documentId: string): SavedProgress | null {
    const list = this.getAllProgress();
    return list.find(p => p.documentId === documentId || p.fileName === documentId) || null;
  }

  /**
   * Get latest saved progress across all documents
   */
  public static getLatestProgress(): SavedProgress | null {
    const list = this.getAllProgress();
    return list.length > 0 ? list[0] : null;
  }

  /**
   * Get all saved progress items
   */
  public static getAllProgress(): SavedProgress[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Clear progress for a document
   */
  public static removeProgress(documentId: string): void {
    try {
      const list = this.getAllProgress().filter(p => p.documentId !== documentId && p.fileName !== documentId);
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  /**
   * Save text cleanup preferences
   */
  public static saveCleanupSettings(settings: CleanupSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY_CLEANUP, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }

  /**
   * Load text cleanup preferences
   */
  public static getCleanupSettings(): CleanupSettings {
    const defaults: CleanupSettings = {
      removePageNumbers: true,
      removeHeaders: true,
      removeFooters: true,
      fixHyphenation: true,
      normalizeSpaces: true,
    };

    try {
      const raw = localStorage.getItem(STORAGE_KEY_CLEANUP);
      return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
    } catch {
      return defaults;
    }
  }
}
