import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Wand2,
  History,
  Copy,
  Download,
  Sparkles
} from 'lucide-react';
import { FONT_STYLES, CATEGORIES } from '../data/fontStyles';
import { FontStyleDefinition, FontCategory, TextCustomizerOptions } from '../types';
import { FontCard } from '../components/FontCard';
import { TextCustomizerModal } from '../components/TextCustomizerModal';
import { HistoryModal } from '../components/HistoryModal';
import { useFavorites } from '../hooks/useFavorites';
import { useHistory } from '../hooks/useHistory';
import { useToast } from '../context/ToastContext';
import { copyToClipboard } from '../utils/clipboard';

export const GeneratorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as FontCategory) || 'all';
  const initialText = searchParams.get('text') ? decodeURIComponent(searchParams.get('text')!) : 'Pragati Sahayak';

  const [inputText, setInputText] = useState(initialText);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FontCategory>(initialCategory);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [customizerOptions, setCustomizerOptions] = useState<TextCustomizerOptions>({
    prefix: '',
    suffix: '',
    caseTransform: 'none',
    zalgoIntensity: 3
  });

  const { toggleFavorite, isFavorite } = useFavorites();
  const { history, addHistoryItem, deleteHistoryItem, clearHistory } = useHistory();
  const toast = useToast();

  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category') as FontCategory);
    }
  }, [searchParams]);

  // Processed text with customizer options
  const processedText = useMemo(() => {
    let text = inputText;
    if (!text) return '';

    switch (customizerOptions.caseTransform) {
      case 'uppercase':
        text = text.toUpperCase();
        break;
      case 'lowercase':
        text = text.toLowerCase();
        break;
      case 'capitalize':
        text = text.replace(/\b\w/g, (c) => c.toUpperCase());
        break;
      case 'alternating':
        text = Array.from(text)
          .map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()))
          .join('');
        break;
    }

    if (customizerOptions.prefix) {
      text = customizerOptions.prefix + text;
    }
    if (customizerOptions.suffix) {
      text = text + customizerOptions.suffix;
    }

    return text;
  }, [inputText, customizerOptions]);

  const handleInputBlur = () => {
    if (inputText.trim()) {
      addHistoryItem(inputText, FONT_STYLES.length);
    }
  };

  const filteredStyles = useMemo(() => {
    return FONT_STYLES.filter((style: FontStyleDefinition) => {
      const matchesCategory =
        selectedCategory === 'all'
          ? true
          : selectedCategory === 'popular'
          ? style.isPopular || style.category === 'popular'
          : style.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        style.name.toLowerCase().includes(q) ||
        style.description.toLowerCase().includes(q) ||
        style.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyAll = async () => {
    if (!processedText.trim()) return;
    const allText = filteredStyles
      .map((s) => `${s.name}:\n${s.generator(processedText)}`)
      .join('\n\n');
    const success = await copyToClipboard(allText);
    if (success) {
      toast.success('Copied All Styles!', `${filteredStyles.length} styles copied to clipboard.`);
    }
  };

  const handleExportTxt = () => {
    if (!processedText.trim()) return;
    const content = filteredStyles
      .map((s) => `[${s.name}]\n${s.generator(processedText)}\n`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pragati-fonts-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported TXT', 'All generated font styles downloaded.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Advanced Font Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time client-side Unicode transformations with instant copy and customization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            <span>Decorate</span>
          </button>

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <History className="w-4 h-4" />
            <span>History ({history.length})</span>
          </button>

          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/20 transition-all"
            title="Copy all generated font styles"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Copy All</span>
          </button>

          <button
            onClick={handleExportTxt}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Export as .txt file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Input Container */}
      <div className="mt-6">
        <div className="relative rounded-2xl bg-white dark:bg-dark-card border-2 border-brand-500/40 p-4 shadow-xl">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Input Text
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onBlur={handleInputBlur}
              placeholder="Type your text here to transform..."
              className="w-full pr-16 bg-transparent text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
              autoFocus
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="px-2 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Active Decorator Indicator */}
          {(customizerOptions.prefix || customizerOptions.suffix || customizerOptions.caseTransform !== 'none') && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-brand-500">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Active modifiers:{' '}
                {customizerOptions.caseTransform !== 'none' && `[${customizerOptions.caseTransform}] `}
                {customizerOptions.prefix && `prefix: "${customizerOptions.prefix}" `}
                {customizerOptions.suffix && `suffix: "${customizerOptions.suffix}"`}
              </span>
              <button
                onClick={() =>
                  setCustomizerOptions({
                    prefix: '',
                    suffix: '',
                    caseTransform: 'none',
                    zalgoIntensity: 3
                  })
                }
                className="ml-auto underline hover:text-brand-400"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by font style name or tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="text-xs text-slate-500">
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredStyles.length}</strong> styles
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as FontCategory)}
                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  active
                    ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/20'
                    : 'bg-white dark:bg-dark-card border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-brand-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6">
        {filteredStyles.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Search className="w-10 h-10 text-slate-400 mx-auto mb-3 stroke-1" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">No styles matched your filter</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Clear your search or switch to "All Styles" to view all available Unicode transformations.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredStyles.map((styleDef) => (
              <FontCard
                key={styleDef.id}
                styleDef={styleDef}
                text={processedText}
                isFavorite={isFavorite(styleDef.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <TextCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        options={customizerOptions}
        onChange={setCustomizerOptions}
        onReset={() =>
          setCustomizerOptions({
            prefix: '',
            suffix: '',
            caseTransform: 'none',
            zalgoIntensity: 3
          })
        }
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectText={(txt) => setInputText(txt)}
        onDeleteItem={deleteHistoryItem}
        onClearAll={clearHistory}
      />
    </div>
  );
};
