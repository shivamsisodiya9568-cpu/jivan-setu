import React, { useState } from 'react';
import { Copy, Check, Heart, Share2, Sparkles } from 'lucide-react';
import { FontStyleDefinition } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { shareContent } from '../utils/share';
import { useToast } from '../context/ToastContext';

interface FontCardProps {
  styleDef: FontStyleDefinition;
  text: string;
  isFavorite: boolean;
  onToggleFavorite: (item: {
    styleId: string;
    styleName: string;
    originalText: string;
    styledText: string;
    category: string;
  }) => void;
}

export const FontCard: React.FC<FontCardProps> = ({
  styleDef,
  text,
  isFavorite,
  onToggleFavorite
}) => {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const generatedText = text.trim() ? styleDef.generator(text) : styleDef.example;

  const handleCopy = async () => {
    const success = await copyToClipboard(generatedText);
    if (success) {
      setCopied(true);
      toast.success('Copied to Clipboard!', `"${styleDef.name}" text copied.`);
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Copy Failed', 'Please select and copy the text manually.');
    }
  };

  const handleFavorite = () => {
    onToggleFavorite({
      styleId: styleDef.id,
      styleName: styleDef.name,
      originalText: text || 'Pragati Sahayak',
      styledText: generatedText,
      category: styleDef.category
    });
  };

  const handleShare = async () => {
    const res = await shareContent({
      title: `${styleDef.name} - Pragati Sahayak Font Generator`,
      text: generatedText
    });
    if (res.method === 'clipboard' && res.success) {
      toast.info('Shareable Text Copied', 'Paste anywhere to share.');
    }
  };

  return (
    <div className="group relative rounded-2xl bg-white dark:bg-dark-card border border-slate-200/80 dark:border-slate-800/80 p-5 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-200 tracking-tight group-hover:text-brand-400 transition-colors">
              {styleDef.name}
            </h3>
            {styleDef.isPopular && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Sparkles className="w-2.5 h-2.5" />
                Popular
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-md">
            {styleDef.category}
          </span>
        </div>

        {/* Generated Text Preview Container */}
        <div
          onClick={handleCopy}
          className="cursor-pointer my-3 p-4 rounded-xl bg-slate-50 dark:bg-dark-bg/60 border border-slate-200/60 dark:border-slate-800/60 hover:bg-brand-500/5 dark:hover:bg-brand-500/5 transition-colors group/text relative overflow-hidden"
          title="Click to copy"
        >
          <div className="text-lg sm:text-xl font-normal text-slate-800 dark:text-slate-100 break-words select-all leading-relaxed font-sans">
            {generatedText}
          </div>
          <span className="absolute bottom-1.5 right-2 text-[10px] font-medium text-slate-400 dark:text-slate-500 opacity-0 group-hover/text:opacity-100 transition-opacity">
            Click to copy
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-4">
          {styleDef.description}
        </p>
      </div>

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
        <div className="text-[11px] text-slate-400 dark:text-slate-500">
          {generatedText.length} chars
        </div>

        <div className="flex items-center gap-1.5">
          {/* Favorite */}
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 border-transparent'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent transition-colors"
            title="Share text"
            aria-label="Share font text"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 shadow-sm ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/20'
            }`}
            aria-label={`Copy ${styleDef.name}`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
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
    </div>
  );
};
