import { useState, useEffect, useCallback } from 'react';
import { GenerationHistoryItem } from '../types';

const HISTORY_STORAGE_KEY = 'pragati_font_history';
const MAX_HISTORY_ITEMS = 25;

export function useHistory() {
  const [history, setHistory] = useState<GenerationHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to persist history to localStorage', e);
    }
  }, [history]);

  const addHistoryItem = useCallback((text: string, styleCount: number) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2) return;

    setHistory((prev) => {
      // Remove duplicate if it already exists to bring it to top
      const filtered = prev.filter((item) => item.text.toLowerCase() !== trimmed.toLowerCase());
      const newItem: GenerationHistoryItem = {
        id: 'hist-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        text: trimmed,
        timestamp: Date.now(),
        styleCount
      };
      return [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    addHistoryItem,
    deleteHistoryItem,
    clearHistory
  };
}
