import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Search,
  Copy,
  Check,
  Trash2,
  Download,
  ArrowRight
} from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';

export const FavoritesPage: React.FC = () => {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const toast = useToast();

  const filteredFavorites = favorites.filter(
    (f) =>
      f.styleName.toLowerCase().includes(search.toLowerCase()) ||
      f.styledText.toLowerCase().includes(search.toLowerCase()) ||
      f.originalText.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = async (id: string, text: string, name: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      toast.success('Copied!', `"${name}" copied to clipboard.`);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCopyAll = async () => {
    if (favorites.length === 0) return;
    const all = favorites.map((f) => `${f.styleName}:\n${f.styledText}`).join('\n\n');
    const success = await copyToClipboard(all);
    if (success) {
      toast.success('Copied All Favorites', `${favorites.length} saved styles copied.`);
    }
  };

  const handleExportJson = () => {
    if (favorites.length === 0) return;
    const blob = new Blob([JSON.stringify(favorites, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pragati-favorites-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported Favorites', 'Favorites saved to JSON file.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500 mb-1">
            <Heart className="w-4 h-4 fill-rose-500" />
            <span>Saved Styles</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Favorite Fonts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Your saved font styles stored securely in your browser's local storage.
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/20 transition-all"
            >
              <Copy className="w-4 h-4" />
              <span>Copy All ({favorites.length})</span>
            </button>

            <button
              onClick={handleExportJson}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Export as JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={clearFavorites}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 border border-slate-200 dark:border-slate-800 transition-colors"
              title="Clear all favorites"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl mt-8 p-8 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">No Favorite Fonts Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Click the heart icon on any font style in the Generator or Agent to save your top picks here for quick access.
          </p>
          <Link
            to="/generator"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/25 transition-all"
          >
            <span>Explore Generator</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your favorites..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Favorites List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredFavorites.map((item) => {
              const isCopied = copiedId === item.id;
              return (
                <div
                  key={item.id}
                  className="group rounded-2xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-slate-800/80 p-5 flex flex-col justify-between hover:border-brand-500/40 transition-all shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                        {item.styleName}
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>

                    <div
                      onClick={() => handleCopy(item.id, item.styledText, item.styleName)}
                      className="cursor-pointer p-4 rounded-xl bg-slate-50 dark:bg-dark-bg/60 border border-slate-200/60 dark:border-slate-800/60 text-lg text-slate-900 dark:text-slate-100 break-words my-2 hover:bg-brand-500/5 transition-colors"
                      title="Click to copy"
                    >
                      {item.styledText}
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Original: <span className="font-mono text-slate-500">{item.originalText}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleCopy(item.id, item.styledText, item.styleName)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-brand-600 hover:bg-brand-500 text-white'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied ✓</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
