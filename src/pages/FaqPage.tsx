import React from 'react';
import { SeoHead } from '../components/common/SeoHead';

export const FaqPage: React.FC = () => {
  const faqs = [
    { q: 'What is ReadTriangle?', a: 'ReadTriangle is a premium multilingual PDF reading platform that allows users to upload readable PDFs and listen to contents as natural, human-like synthetic speech.' },
    { q: 'Can ReadTriangle read any PDF?', a: 'ReadTriangle processes both text-based vector PDFs and scanned image-based PDFs using Tesseract OCR.' },
    { q: 'Can I convert a PDF book into audio?', a: 'Yes! ReadTriangle processes long books in intelligent chapter chunks and provides downloadable speech audio.' },
    { q: 'Does ReadTriangle support Hindi, Spanish, Japanese, and Chinese?', a: 'Yes. ReadTriangle supports Hindi, English, Spanish, Japanese, Chinese, French, German, Italian, Portuguese, Korean, and more.' },
    { q: 'Are male and female voices available?', a: 'Yes. ReadTriangle features filterable Male and Female voices categorized by tone (Natural, Warm, Deep, Calm, Professional).' },
    { q: 'Do I need an account to use ReadTriangle?', a: 'No. You can start reading and listening to your PDFs immediately without registration.' },
    { q: 'Are uploaded PDFs stored on servers?', a: 'No. All PDF parsing, canvas rendering, and reading progress execute client-side inside your browser sandbox.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <SeoHead
        title="Frequently Asked Questions"
        description="Comprehensive FAQ for ReadTriangle PDF to speech platform."
        canonicalUrl="https://readtriangle.com/faq"
      />

      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h1>
        <p className="text-xs text-slate-500">Find answers to common questions regarding ReadTriangle.</p>
      </div>

      <div className="space-y-4 text-xs">
        {faqs.map((f, idx) => (
          <div key={`faq-pg-${idx}`} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{f.q}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
