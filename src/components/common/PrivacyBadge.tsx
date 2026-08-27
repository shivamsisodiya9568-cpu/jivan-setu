import React from 'react';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';

interface PrivacyBadgeProps {
  className?: string;
  variant?: 'compact' | 'detailed';
}

export const PrivacyBadge: React.FC<PrivacyBadgeProps> = ({ className = '', variant = 'detailed' }) => {
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200/80 dark:border-emerald-800/40 ${className}`}>
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>100% Client-Side • Private & Zero-Server Storage</span>
      </div>
    );
  }

  return (
    <div className={`p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200/80 dark:border-dark-border ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs sm:text-sm">
          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span>Privacy-First Document Processing</span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
              Zero Server Upload
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-xs leading-relaxed">
            Your documents and files never leave your device. All rendering, text extraction, speech synthesis, and PDF operations execute entirely within your local browser memory sandbox.
          </p>
        </div>
      </div>
    </div>
  );
};
