import React from 'react';
import { Sparkles, Cpu, ShieldCheck, Zap } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
      {/* Intro */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About Pragati Sahayak</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Pioneering Modern Aesthetic Typography
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Pragati Sahayak Font Generator is a high-performance web platform built to give creators, gamers, and developers instant access to 50+ universal Unicode typography styles without installing fonts.
        </p>
      </div>

      {/* Tech Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Unicode Mathematical Symbols
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            We map standard ASCII alphabets into official Unicode mathematical alphanumeric symbols (U+1D400 to U+1D7FF), enclosed alphanumerics, and diacritical marks.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Client-Side & Zero Tracking
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            All text computation, character conversions, and favorites storage occur 100% inside your web browser. No text is sent to backend servers.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Lightning Performance
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Built with modern React and Vite, achieving sub-millisecond transforms and full offline capability through Progressive Web App (PWA) caching.
          </p>
        </div>
      </div>

      {/* Story & Vision */}
      <div className="p-8 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Why We Built Pragati Sahayak
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Traditional font generator websites are often cluttered with invasive advertisements, slow rendering speeds, and rigid interfaces. We engineered <strong>Pragati Sahayak Font Generator</strong> to provide a clean, modern SaaS-grade experience that respects user privacy and delivers instant results.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Whether you are designing a sleek bio for social media, assembling a Free Fire or PUBG clan tag, creating eye-catching headlines on LinkedIn, or personalizing romantic notes, our platform offers an intuitive toolkit with intelligent recommendations via the Pragati Font Agent.
        </p>
      </div>

      {/* Standards */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <span>© 2026 Pragati Sahayak. Released under MIT license.</span>
        <div className="flex items-center gap-2">
          <span>Unicode Standard 15.0+ Compatible</span>
        </div>
      </div>
    </div>
  );
};
