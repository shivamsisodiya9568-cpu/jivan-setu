import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Headphones, Sparkles, ShieldCheck, ArrowRight, CheckCircle2, ScanText, Globe, BookOpen } from 'lucide-react';
import { PdfUploader } from '../components/uploader/PdfUploader';
import { SeoHead } from '../components/common/SeoHead';

export const SeoLandingPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const pageMetaMap: Record<string, { title: string; desc: string; headline: string; sub: string }> = {
    '/pdf-to-audio': {
      title: 'PDF to Audio Converter',
      desc: 'Convert any PDF book, study document, or article into natural speech audio with ReadTriangle.',
      headline: 'Convert Any PDF Into Natural Speech Audio',
      sub: 'Listen to books, research papers, and study material aloud with natural multilingual voices.',
    },
    '/pdf-reader': {
      title: 'Multilingual PDF Reader with Voice',
      desc: 'Read and listen to PDFs with synchronized sentence highlighting, zoom, and chapter navigation.',
      headline: 'Premium PDF Reader with Built-In Voice',
      sub: 'A beautiful reading software experience with synchronized text highlighting and speech.',
    },
    '/pdf-text-to-speech': {
      title: 'PDF Text to Speech',
      desc: 'Listen to PDF documents aloud using neural text-to-speech engine across multiple languages.',
      headline: 'Neural PDF Text to Speech Engine',
      sub: 'Turn written PDF pages into fluent, natural human-like speech in seconds.',
    },
    '/pdf-voice-reader': {
      title: 'PDF Voice Reader',
      desc: 'High-quality PDF voice reader supporting male and female neural voices.',
      headline: 'Natural PDF Voice Reader',
      sub: 'Select from natural, warm, deep, and professional voices across Hindi, English, Spanish, Japanese, and more.',
    },
    '/ai-pdf-reader': {
      title: 'AI PDF Reader & Summarizer',
      desc: 'Ask your PDF questions, generate chapter summaries, and listen to summaries aloud with AI.',
      headline: 'AI-Powered PDF Reader & Document Companion',
      sub: 'Extract key takeaways, ask questions about document pages, and listen to AI summaries.',
    },
    '/multilingual-pdf-reader': {
      title: 'Multilingual PDF Reader',
      desc: 'Read Hindi, English, Spanish, Japanese, Chinese, French, and German PDFs with native voices.',
      headline: 'Native Multilingual PDF Speech Reader',
      sub: 'Automatic language detection and native voice assignment for global documents.',
    },
    '/pdf-audiobook': {
      title: 'PDF to Audiobook Generator',
      desc: 'Turn any PDF e-book into an audiobook with chapter navigation and offline progress saving.',
      headline: 'Turn PDF Books Into Audiobooks',
      sub: 'Listen to your favourite e-books with chapter jump bookmarks and custom playback speeds.',
    },
    '/features': {
      title: 'ReadTriangle Features Overview',
      desc: 'Explore all features of ReadTriangle including OCR, sentence highlighting, and natural speech.',
      headline: 'ReadTriangle Platform Features',
      sub: 'Everything you need to convert, read, listen, and study PDF documents.',
    },
  };

  const meta = pageMetaMap[path] || {
    title: 'PDF to Voice Reader',
    desc: 'Listen to PDFs aloud with natural voices.',
    headline: 'Turn Every Page Into a Voice',
    sub: 'Multilingual PDF reading platform.',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors pb-16">
      <SeoHead
        title={meta.title}
        description={meta.desc}
        canonicalUrl={`https://readtriangle.com${path}`}
      />

      {/* Hero Header */}
      <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          {meta.headline}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          {meta.sub}
        </p>

        {/* Uploader Box */}
        <div className="pt-4 max-w-3xl mx-auto">
          <PdfUploader />
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">How ReadTriangle Processes PDFs</h2>
            <p>
              ReadTriangle executes a complete pipeline: PDF Upload → Text Extraction / OCR → Language Detection → Natural Neural TTS → Synchronized Audio Reading.
            </p>
            <ul className="space-y-2 pl-4 list-disc text-slate-600 dark:text-slate-400">
              <li><strong>Natural Speech Synthesis:</strong> Powered by neural voices in Hindi, English, Spanish, Japanese, Chinese, French, and German.</li>
              <li><strong>Scanned Document OCR:</strong> Built-in Tesseract OCR recognizes text from scanned PDF pages without manual copying.</li>
              <li><strong>Synchronized Read-Along:</strong> Currently spoken sentences are highlighted in real time as speech progresses.</li>
              <li><strong>Offline Browser Privacy:</strong> Document text and rendering execute client-side inside your browser sandbox.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
