import React from 'react';
import { X, History, Trash2, ArrowRight, Clock } from 'lucide-react';
import { GenerationHistoryItem } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: GenerationHistoryItem[];
  onSelectText: (text: string) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectText,
  onDeleteItem,
  onClearAll
}) => {
  if (!isOpen) return null;

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-brand-500" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Generation History
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <History className="w-10 h-10 mx-auto mb-2 opacity-40 stroke-1" />
              <p className="text-sm font-medium">No generation history yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Typed texts will automatically be saved locally.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-dark-card border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/40 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
                    {item.text}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(item.timestamp)}</span>
                    <span>•</span>
                    <span>{item.styleCount} styles generated</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onSelectText(item.text);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 transition-colors"
                    title="Reuse text"
                  >
                    <span>Use</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete history item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400">{history.length} items saved</span>
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
