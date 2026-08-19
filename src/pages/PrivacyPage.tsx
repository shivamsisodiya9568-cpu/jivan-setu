import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-500 mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy & Security</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mt-1">Last updated: August 2026</p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            1. Client-Side Only Data Processing
          </h2>
          <p>
            Pragati Sahayak Font Generator operates strictly client-side. When you type or paste text into our generator, all Unicode conversion algorithms execute locally inside your web browser engine. We do not transmit, log, or store your typed text on any remote servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-brand-500" />
            2. Local Storage Usage
          </h2>
          <p>
            We use your browser's standard <code>localStorage</code> API exclusively to save:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your favorited font styles</li>
            <li>Recent generation history entries for quick reuse</li>
            <li>Your theme preference (Dark Mode or Light Mode)</li>
          </ul>
          <p>
            You can clear this data at any time directly through the application's "Clear All" buttons or via your browser cache settings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-indigo-500" />
            3. No Third-Party Tracking
          </h2>
          <p>
            We do not sell, rent, or share any personal user data. We do not use intrusive third-party cross-site trackers or ad trackers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Contact Us
          </h2>
          <p>
            If you have questions about our privacy practices, please contact us via our Contact form.
          </p>
        </section>
      </div>
    </div>
  );
};
