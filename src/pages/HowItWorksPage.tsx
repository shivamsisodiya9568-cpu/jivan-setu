import React from 'react';
import { SeoHead } from '../components/common/SeoHead';
import { Upload, ScanText, Globe, Headphones, Sparkles } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      <SeoHead
        title="How It Works"
        description="Learn how ReadTriangle converts PDFs into natural speech audio using OCR, language detection, and neural text-to-speech."
        canonicalUrl="https://readtriangle.com/how-it-works"
      />

      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          How ReadTriangle Works
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The step-by-step technical architecture powering ReadTriangle.
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 font-bold flex items-center justify-center shrink-0">1</div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">PDF Upload & Page Extraction</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Drag & drop any readable PDF. PDF.js extracts vector text and structural outline page by page.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 font-bold flex items-center justify-center shrink-0">2</div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Scanned PDF OCR</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              For scanned image pages, Tesseract.js recognizes characters and extracts textual content.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 font-bold flex items-center justify-center shrink-0">3</div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Language Detection & Natural TTS</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              The engine detects the language (Hindi, English, Spanish, Japanese...) and pairs it with native neural speech synthesis.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 font-bold flex items-center justify-center shrink-0">4</div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Synchronized Read-Along Playback</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Listen to your document with synchronized sentence highlights, auto page scrolling, and offline position saving.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
