import React from 'react';
import { useJivanSetu } from '../../context/JivanSetuContext';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useJivanSetu();

  if (toasts.length === 0) return null;

  const icons = {
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    danger: <AlertCircle className="w-5 h-5 text-red-500 shrink-0 animate-bounce" />
  };

  const borders = {
    info: 'border-blue-500/30 bg-blue-50/90 dark:bg-navy-900/95',
    success: 'border-emerald-500/30 bg-emerald-50/90 dark:bg-navy-900/95',
    warning: 'border-amber-500/30 bg-amber-50/90 dark:bg-navy-900/95',
    danger: 'border-red-500/50 bg-red-50/95 dark:bg-navy-950/95'
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl backdrop-blur-md flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-3 ${borders[toast.type]}`}
        >
          {icons[toast.type]}
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-navy-950 dark:text-white truncate">
              {toast.title}
            </h5>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
