import React from 'react';
import { SeoHead } from '../components/common/SeoHead';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-xs leading-relaxed">
      <SeoHead
        title="Terms and Conditions"
        description="Terms and conditions for using ReadTriangle PDF reader and speech platform."
        canonicalUrl="https://readtriangle.com/terms-and-conditions"
      />

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Terms & Conditions</h1>
        <p className="text-slate-500">Effective Date: August 27, 2026 | ReadTriangle Platform</p>
      </div>

      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 text-slate-700 dark:text-slate-300">
        <section className="space-y-2">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">1. Acceptance of Terms</h3>
          <p>
            By accessing or using ReadTriangle, you agree to comply with and be bound by these Terms & Conditions.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">2. User Responsibilities & Uploaded Content</h3>
          <p>
            Users are solely responsible for ensuring they possess necessary legal rights or permissions for all documents uploaded to ReadTriangle.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">3. Disclaimer of Warranties</h3>
          <p>
            ReadTriangle is provided "as is" without warranty of any kind. Speech synthesis and OCR transcription quality may vary depending on document formatting.
          </p>
        </section>
      </div>
    </div>
  );
};
