import React from 'react';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProcessingOverlayProps {
  message?: string;
  submessage?: string;
  progress?: number; // 0 to 100
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  message = 'Processing Document...',
  submessage = 'Executing client-side transformations safely in your browser',
  progress,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center relative">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {message}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {submessage}
          </p>
        </div>

        {progress !== undefined && (
          <div className="space-y-1.5 pt-2">
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <div className="text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
              {Math.round(progress)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
