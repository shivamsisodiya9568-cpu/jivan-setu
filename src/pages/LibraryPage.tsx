import React, { useState } from 'react';
import { BookOpen, Search, Copy, Check } from 'lucide-react';
import { FONT_STYLES, CATEGORIES } from '../data/fontStyles';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';

export const LibraryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const toast = useToast();

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789';

  const filtered = FONT_STYLES.filter((s) => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory;
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCopySet = async (id: string, text: string, name: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      toast.success('Character Set Copied', `"${name}" alphabet copied to clipboard.`);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-500 mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Unicode Styles Reference</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Font Styles Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Browse the complete catalog of all 50+ built-in Unicode transformations, complete character set maps, and typography descriptions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search font styles in catalog..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                activeCategory === cat.id
                  ? 'bg-brand-600 text-white border-brand-500'
                  : 'bg-white dark:bg-dark-card border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Library Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((style) => {
          const sampleSet = style.generator(ALPHABET);
          const isCopied = copiedId === style.id;

          return (
            <div
              key={style.id}
              className="rounded-2xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-slate-800/80 p-6 flex flex-col justify-between shadow-sm hover:border-brand-500/40 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {style.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{style.description}</p>
                  </div>
                  <span className="shrink-0 text-[10px] uppercase font-bold text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                    {style.category}
                  </span>
                </div>

                {/* Character preview */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-dark-bg/80 border border-slate-200/60 dark:border-slate-800/60 text-base leading-relaxed break-words font-sans text-slate-800 dark:text-slate-200">
                  {sampleSet}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {style.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-xs text-slate-400">ID: {style.id}</span>
                <button
                  onClick={() => handleCopySet(style.id, sampleSet, style.name)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-600 hover:bg-brand-500 text-white shadow-sm shadow-brand-600/20'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied Set ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Character Set</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
