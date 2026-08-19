import React from 'react';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-500 mb-1">
          <FileText className="w-4 h-4" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Terms of Use
        </h1>
        <p className="text-xs text-slate-500 mt-1">Last updated: August 2026</p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using Pragati Sahayak Font Generator, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use this website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Permitted Use & Generated Content
          </h2>
          <p>
            All generated Unicode stylized text is free for both personal and commercial use across social media platforms, websites, games, graphic design, and publications. You retain full rights to any original text you enter.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Disclaimer of Warranties
          </h2>
          <p>
            The service is provided on an "as is" and "as available" basis without warranties of any kind. While Unicode glyphs are supported by most modern platforms, rendering compatibility may vary depending on third-party apps and device operating systems.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Changes to Service
          </h2>
          <p>
            We reserve the right to modify, enhance, or discontinue features of the platform at any time without notice.
          </p>
        </section>
      </div>
    </div>
  );
};
