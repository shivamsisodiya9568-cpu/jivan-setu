import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Wand2,
  History,
  Bot,
  Zap,
  Copy,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Smartphone
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

const SAMPLE_TEXTS = [
  'Pragati Sahayak',
  'Stay Hungry Stay Foolish',
  'Pro Gamer 2026',
  'Dream Big Work Hard',
  'aesthetic vibes ✨',
  'Tech Innovation Lab'
];

export const HomePage: React.FC = () => {
  const [inputText, setInputText] = useState('Pragati Sahayak');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FontCategory>('all');
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

  // Apply transformation helper
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

  const handleRandomSample = () => {
    const random = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setInputText(random);
    toast.info('Sample text loaded', random);
  };

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

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Pragati Sahayak Font Generator work?',
      a: 'Our platform converts standard alphanumeric characters into corresponding Unicode mathematical symbols, enclosed letters, diacritical marks, and stylized glyphs entirely within your browser. These are universal Unicode characters, meaning you can copy and paste them directly into Instagram, Discord, TikTok, WhatsApp, LinkedIn, Twitter, and games without needing custom font files.'
    },
    {
      q: 'Are these fonts compatible with Instagram, Discord, and Free Fire?',
      a: 'Yes! Because they are standard Unicode characters, they work across almost all modern social media apps, gaming usernames, bios, captions, emails, and web browsers.'
    },
    {
      q: 'What is the Pragati Font Agent?',
      a: 'The Pragati Font Agent is an AI-powered assistant designed to recommend the ideal font styles based on your prompt (for example: "I need a cool gaming clan tag" or "Give me a cute aesthetic bio font for Priya"). It analyzes intent and generates tailored recommendations instantly.'
    },
    {
      q: 'Is my data secure and private?',
      a: '100% private. All text transformations and formatting are computed locally in your web browser. None of your entered text is sent to or stored on external servers.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 bg-brand-600/15 dark:bg-brand-600/20 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-600 dark:text-brand-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>50+ Premium Unicode Styles • 100% Free & Fast</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Pragati Sahayak <br className="hidden sm:inline" />
            <span className="shimmer-text">Font Generator</span>
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Create stylish, unique, and copy-ready text in seconds. Perfect for Instagram bios, Discord handles, gaming tags, and creative design.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/generator"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4" />
              <span>Generate Fonts</span>
            </Link>
            <Link
              to="/agent"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-dark-surface hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition-all hover:scale-105"
            >
              <Bot className="w-4 h-4 text-brand-400" />
              <span>AI Font Agent</span>
            </Link>
            <Link
              to="/fonts"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span>Explore 50+ Styles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Main Instant Live Input Box */}
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="relative rounded-2xl bg-white dark:bg-dark-card border-2 border-brand-500/40 dark:border-brand-500/30 shadow-2xl p-2 sm:p-3 transition-all focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onBlur={handleInputBlur}
                  placeholder="Type something here..."
                  className="w-full pl-4 pr-24 sm:pr-32 py-3 sm:py-4 bg-transparent text-lg sm:text-2xl font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  aria-label="Enter text to generate fonts"
                />

                <div className="absolute right-2 flex items-center gap-1.5">
                  {inputText && (
                    <button
                      type="button"
                      onClick={() => setInputText('')}
                      className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleRandomSample}
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Load random sample"
                  >
                    🎲 Sample
                  </button>
                </div>
              </div>

              {/* Input Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 px-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomizerOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 font-medium transition-colors"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Decorate & Case</span>
                    {(customizerOptions.prefix || customizerOptions.suffix || customizerOptions.caseTransform !== 'none') && (
                      <span className="w-2 h-2 rounded-full bg-brand-500 inline-block" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsHistoryOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>History ({history.length})</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyAll}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-slate-400">Quick ideas:</span>
              {['Gamer Tag', 'Instagram Bio', 'Priya ❤️', 'Alpha Wolf', 'CEO & Founder'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setInputText(chip)}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-brand-500/40 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Font Filter & Grid Section */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search font styles (e.g. bold, gaming, gothic, cute)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end text-xs text-slate-500">
              <span>Showing {filteredStyles.length} of {FONT_STYLES.length} styles</span>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="hover:text-brand-400 font-medium"
              >
                Reset filters
              </button>
            </div>
          </div>

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

        {filteredStyles.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Search className="w-10 h-10 text-slate-400 mx-auto mb-3 stroke-1" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">No matching font styles found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Try searching for a different keyword like "bold", "cursive", "gaming", or select "All Styles".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-500"
            >
              Show All 50+ Styles
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
      </section>

      {/* Features Showcase Section */}
      <section className="py-16 bg-slate-50 dark:bg-dark-surface/60 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Why Creators Choose Pragati Sahayak
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Engineered with speed, precision, and privacy at its core.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                Instant Real-Time Engine
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Zero lag or loading screens. Transformations compute on every keystroke in less than a millisecond.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                100% Client-Side Privacy
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Your text never touches a server. Everything runs locally in your browser with complete confidentiality.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                Pragati Font Agent
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                AI-style recommendations that understand context like gaming tags, romantic names, or corporate bios.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                PWA & Offline Ready
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Install as a standalone app on your phone or computer and generate fonts even without an internet connection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agent Banner CTA */}
      <section className="py-12 bg-gradient-to-r from-brand-900/40 via-indigo-900/40 to-slate-900/40 border-y border-brand-500/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300">
              <Sparkles className="w-3 h-3" />
              <span>Smart Recommendation Agent</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Need personalized font recommendations?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Ask the Pragati Font Agent for tailored styles for Instagram bios, gaming IDs, and invitations.
            </p>
          </div>

          <Link
            to="/agent"
            className="shrink-0 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-brand-500 to-indigo-600 text-white shadow-xl shadow-brand-500/25 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Bot className="w-4 h-4" />
            <span>Launch Pragati Font Agent</span>
          </Link>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Everything you need to know about Unicode font generation.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-card overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-brand-500' : 'text-slate-400'}`} />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

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
