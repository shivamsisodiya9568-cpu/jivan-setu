import React from 'react';
import { SeoHead } from '../components/common/SeoHead';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-xs leading-relaxed">
      <SeoHead
        title="Privacy Policy"
        description="ReadTriangle Privacy Policy detailing data handling, client-side processing, and security architecture."
        canonicalUrl="https://readtriangle.com/privacy-policy"
      />

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-slate-500">Effective Date: August 27, 2026 | ReadTriangle Platform</p>
      </div>

      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 text-slate-700 dark:text-slate-300">
        <section className="space-y-2">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">1. Client-Side Processing Architecture</h3>
          <p>
            ReadTriangle prioritizes privacy. Document parsing (`pdf-lib`, `pdfjs-dist`), text extraction, Tesseract OCR rendering, and Web Speech Synthesis run locally inside your browser sandbox.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">2. Uploaded Document Data</h3>
          <p>
            PDF files uploaded to ReadTriangle are not stored on external servers or uploaded to third-party databases. File binary content remains strictly within your temporary browser memory during the active session.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">3. Local Progress Storage</h3>
          <p>
            Reading progress, page bookmarks, selected playback speeds, and voice preferences are stored locally in your browser using `localStorage` and `IndexedDB`. You can clear this data at any time via your browser settings.
          </p>
        </section>

        <section className="space-y-2" id="cookies">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">4. Cookie Policy</h3>
          <p>
            ReadTriangle uses essential local storage keys strictly required for reading preferences and dark mode settings. No invasive cross-site tracking cookies are deployed.
          </p>
        </section>
      </div>
    </div>
  );
};
