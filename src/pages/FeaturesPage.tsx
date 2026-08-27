import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Layers, 
  Volume2, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  X, 
  ArrowRight,
  Zap,
  Lock,
  Cpu
} from 'lucide-react';
import { SeoHead } from '../components/layout/SeoHead';
import { PrivacyBadge } from '../components/common/PrivacyBadge';
import { FEATURES_DATA } from '../data/featuresList';

export const FeaturesPage: React.FC = () => {
  const comparisonRows = [
    { feature: '100% Client-Side Processing', pragati: true, others: false, note: 'Files never leave your local device memory.' },
    { feature: 'Synchronized Text-to-Speech (Read Aloud)', pragati: true, others: false, note: 'Native Web Speech API with sentence highlighting.' },
    { feature: 'Vector PDF Generator Studio', pragati: true, others: true, note: 'Create documents from scratch with headings and images.' },
    { feature: 'Merge, Split, Rotate & Compress', pragati: true, others: true, note: 'Full suite of document manipulation utilities.' },
    { feature: 'No Sign-Up or Email Required', pragati: true, others: false, note: 'Instant frictionless access.' },
    { feature: 'Zero File Size Artificial Paywalls', pragati: true, others: false, note: 'Process large files constrained only by device RAM.' },
    { feature: 'Offline Heuristic Assistant', pragati: true, others: false, note: 'Private offline summarization without server API calls.' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Features & Technical Architecture - Pragati Sahayak PDF"
        description="Explore the features and technical capabilities of Pragati Sahayak PDF Generator. Vector compilation, browser-native text to speech, and zero-server privacy."
        keywords="PDF features, client-side PDF, private PDF tools, PDF generator features, speech synthesis PDF"
        canonicalPath="/features"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engineering & Capabilities</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Designed for Speed, Polish & Absolute Privacy
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Discover why Pragati Sahayak is built differently from traditional server-dependent document converters.
          </p>
        </div>

        {/* Features Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES_DATA.map((feat) => (
            <div
              key={feat.id}
              className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                  {feat.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>

                <ul className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-dark-border">
                  {feat.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="pt-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
              How We Compare
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              A transparent comparison between Pragati Sahayak and conventional online document tools.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-dark-surface border-b border-slate-200 dark:border-dark-border text-slate-500 font-semibold">
                  <tr>
                    <th className="p-4">Capability</th>
                    <th className="p-4 text-indigo-600 dark:text-indigo-400 font-bold">Pragati Sahayak</th>
                    <th className="p-4">Traditional Online PDF Services</th>
                    <th className="p-4 hidden md:table-cell">Technical Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-dark-hover/50">
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">{row.feature}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                          <Check className="w-4 h-4" /> Yes
                        </span>
                      </td>
                      <td className="p-4">
                        {row.others ? (
                          <span className="text-slate-600 dark:text-slate-400">Yes (Server Upload)</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-500">
                            <X className="w-4 h-4" /> No / Restricted
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-slate-500 hidden md:table-cell">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <PrivacyBadge />
      </div>
    </div>
  );
};
