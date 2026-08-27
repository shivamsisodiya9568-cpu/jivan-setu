import { ShieldCheck } from 'lucide-react';
import { SeoHead } from '../components/layout/SeoHead';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Privacy Policy - Pragati Sahayak PDF Generator"
        description="Official Privacy Policy for Pragati Sahayak PDF Generator. Learn how we enforce client-side processing, zero server storage, and complete document privacy."
        keywords="privacy policy, PDF privacy, zero server storage, local document processing"
        canonicalPath="/privacy-policy"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full space-y-8 text-slate-800 dark:text-slate-200">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/40">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Server Storage Guarantee</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Effective Date: October 24, 2026 | Last Updated: October 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border space-y-8 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 shadow-xs">
          {/* Section 1: Overview */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              1. Overview & Privacy Principles
            </h2>
            <p>
              Pragati Sahayak ("we," "our," or "the Platform") provides browser-based PDF generation, document editing, and voice-assisted reading tools. We believe that privacy is a fundamental human right. Unlike conventional online PDF utilities, Pragati Sahayak was engineered from the ground up to process your documents directly inside your web browser.
            </p>
          </section>

          {/* Section 2: Uploaded Documents */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              2. Document Processing & In-Browser Execution
            </h2>
            <p>
              When you upload a PDF, image, or text file into the PDF Generator, PDF Tools (Merge, Split, Rotate, Compress, Watermark), PDF Reader, or Book Reader:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600 dark:text-slate-400">
              <li><strong>Local Memory Isolation:</strong> All file parsing, vector layout compilation, rasterization, and merging occur within your device's memory using JavaScript and WebAssembly.</li>
              <li><strong>No Server Uploads:</strong> Your documents are never transmitted across the network to our servers or any third-party infrastructure for core document operations.</li>
              <li><strong>No Permanent Storage:</strong> We do not store copies of your documents, metadata, or created PDFs on any server database. When you close or refresh your browser tab, the memory space is cleared.</li>
            </ul>
          </section>

          {/* Section 3: Local Storage */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              3. Local Browser Storage (localStorage)
            </h2>
            <p>
              We utilize your browser’s native <code>localStorage</code> solely to provide a seamless user experience across sessions:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600 dark:text-slate-400">
              <li>Your UI theme selection (Dark Mode, Light Mode, System Mode).</li>
              <li>Your current reading progress, last read page number, and preferred speech rate.</li>
              <li>Your custom Google Gemini API key if you explicitly choose to configure the optional BYOK assistant (stored securely in your browser only).</li>
            </ul>
            <p>You may clear this data at any time through your browser settings.</p>
          </section>

          {/* Section 4: Voice & Speech Synthesis */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              4. Voice & Text-to-Speech Processing
            </h2>
            <p>
              The Read Aloud feature relies on the W3C Web Speech API embedded within your web browser (such as Google Chrome, Apple Safari, Microsoft Edge, or Mozilla Firefox). Speech synthesis is processed through your operating system's installed audio voices.
            </p>
          </section>

          {/* Section 5: Analytics */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              5. Analytics & Cookies
            </h2>
            <p>
              Pragati Sahayak does not use invasive third-party tracking cookies or advertising pixels. We do not sell, rent, or trade your personal data with data brokers or advertisers.
            </p>
          </section>

          {/* Section 6: User Rights */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              6. Your Rights & Data Control
            </h2>
            <p>
              Because we do not store your documents or require personal accounts, you retain complete and absolute sovereignty over your files. You can delete generated documents from your local disk at your sole discretion.
            </p>
          </section>

          {/* Section 7: Contact Info */}
          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-dark-border">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              7. Contact & Legal Entity
            </h2>
            <p>
              For privacy-related inquiries, data protection questions, or technical verification:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border space-y-1 font-mono text-xs">
              <div>Entity: Pragati Sahayak Initiative</div>
              <div>Email: privacy@pragatisahayak.com</div>
              <div>Address: [Insert Business / Organization Address]</div>
              <div>Jurisdiction: [Insert Governing Jurisdiction]</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
