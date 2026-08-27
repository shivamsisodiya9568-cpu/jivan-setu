import React from 'react';
import { SeoHead } from '../components/common/SeoHead';
import { ShieldCheck, Heart, Globe, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <SeoHead
        title="About ReadTriangle"
        description="Learn about ReadTriangle's mission to make reading accessible through natural multilingual AI speech."
        canonicalUrl="https://readtriangle.com/about"
      />

      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">About ReadTriangle</h1>
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">"Turn Every Page Into a Voice."</p>
      </div>

      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
        <p>
          <strong>ReadTriangle</strong> was engineered to bridge the gap between reading written text and auditory comprehension. Whether studying academic research papers, reading literature, or listening to manuals on the move, ReadTriangle turns documents into clear, human-sounding speech.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">Privacy-First Engineering</h4>
            <p className="text-[11px] text-slate-500">Document extraction and canvas rendering execute client-side in the browser.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2">
            <Globe className="w-5 h-5 text-indigo-500" />
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">Multilingual Speech Access</h4>
            <p className="text-[11px] text-slate-500">Support for native speech in Hindi, English, Spanish, Japanese, Chinese, and more.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
