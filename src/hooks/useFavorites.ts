import { useState, useEffect } from 'react';
import { FavoriteItem } from '../types';

const FAVORITES_STORAGE_KEY = 'pragati_font_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to persist favorites to localStorage', e);
    }
  }, [favorites]);

  const toggleFavorite = (item: {
    styleId: string;
    styleName: string;
    originalText: string;
    styledText: string;
    category: string;
  }): boolean => {
    const existingIndex = favorites.findIndex((f) => f.styleId === item.styleId);
    if (existingIndex !== -1) {
      setFavorites((prev) => prev.filter((f) => f.styleId !== item.styleId));
      return false; // removed
    } else {
      const newFav: FavoriteItem = {
        id: 'fav-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        ...item,
        savedAt: Date.now()
      };
      setFavorites((prev) => [newFav, ...prev]);
      return true; // added
    }
  };

  const isFavorite = (styleId: string): boolean => {
    return favorites.some((f) => f.styleId === styleId);
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id && f.styleId !== id));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    removeFavorite,
    clearFavorites
  };
}
