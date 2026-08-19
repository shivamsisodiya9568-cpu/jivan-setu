import React from 'react';
import { X, Wand2, Sparkles, RefreshCw } from 'lucide-react';
import { TextCustomizerOptions } from '../types';

interface TextCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: TextCustomizerOptions;
  onChange: (options: TextCustomizerOptions) => void;
  onReset: () => void;
}

const PRESET_DECORATIONS = [
  { label: 'Sparkles', prefix: '✨ ', suffix: ' ✨' },
  { label: 'Hearts', prefix: '💖 ', suffix: ' 💖' },
  { label: 'Royal Crown', prefix: '꧁👑 ', suffix: ' 👑꧂' },
  { label: 'Japanese Wings', prefix: '꧁༺ ', suffix: ' ༻꧂' },
  { label: 'Shooting Star', prefix: '★彡 ', suffix: ' 彡★' },
  { label: 'Cyber Bolt', prefix: '⚡『 ', suffix: ' 』⚡' },
  { label: 'Battle Swords', prefix: '⚔️ ', suffix: ' ⚔️' },
  { label: 'Dark Skull', prefix: '☠️ ', suffix: ' ☠️' },
  { label: 'Box Brackets', prefix: '【 ', suffix: ' 】' },
  { label: 'Corner Quotes', prefix: '『 ', suffix: ' 』' },
  { label: 'Diamond Lux', prefix: '◈ ', suffix: ' ◈' },
  { label: 'Butterflies', prefix: 'ʚĭɞ ', suffix: ' ʚĭɞ' },
  { label: 'Sakura Petals', prefix: '🌸 ', suffix: ' 🌸' },
  { label: 'Flame Fire', prefix: '🔥 ', suffix: ' 🔥' },
];

export const TextCustomizerModal: React.FC<TextCustomizerModalProps> = ({
  isOpen,
  onClose,
  options,
  onChange,
  onReset
}) => {
  if (!isOpen) return null;

  const handleDecorationPreset = (prefix: string, suffix: string) => {
    onChange({
      ...options,
      prefix,
      suffix
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-brand-500" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Text Decorator & Customizer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-6 pt-5">
          {/* Case Transformation */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Letter Case Transformation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'none', label: 'Default' },
                { id: 'uppercase', label: 'UPPERCASE' },
                { id: 'lowercase', label: 'lowercase' },
                { id: 'capitalize', label: 'Capitalize Words' },
                { id: 'alternating', label: 'aLtErNaTiNg' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...options,
                      caseTransform: item.id as TextCustomizerOptions['caseTransform']
                    })
                  }
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    options.caseTransform === item.id
                      ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/25'
                      : 'bg-slate-50 dark:bg-dark-card text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-brand-500/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Aesthetic Decoration Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Aesthetic Frame Presets
              </label>
              <span className="text-[11px] text-brand-500 dark:text-brand-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 1-Click Apply
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {PRESET_DECORATIONS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDecorationPreset(preset.prefix, preset.suffix)}
                  className={`p-2 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                    options.prefix === preset.prefix && options.suffix === preset.suffix
                      ? 'bg-brand-500/15 border-brand-500 text-brand-600 dark:text-brand-400 font-semibold'
                      : 'bg-slate-50 dark:bg-dark-card border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{preset.label}</span>
                  <span className="text-xs">{preset.prefix.trim()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Prefix & Suffix Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Custom Prefix
              </label>
              <input
                type="text"
                value={options.prefix}
                onChange={(e) => onChange({ ...options, prefix: e.target.value })}
                placeholder="e.g. ★ "
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Custom Suffix
              </label>
              <input
                type="text"
                value={options.suffix}
                onChange={(e) => onChange({ ...options, suffix: e.target.value })}
                placeholder="e.g.  ★"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Customizer
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/25 transition-all"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
