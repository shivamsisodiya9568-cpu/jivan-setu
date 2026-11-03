import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, Heart, Lock, Cpu, Globe2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface text-slate-600 dark:text-slate-400 text-sm transition-colors duration-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base">
                  Pragati Sahayak
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  PDF Generator & Document Workspace
                </span>
              </div>
            </Link>
            
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Create, read, edit, and listen to documents simply. Built with a strict privacy-first architecture where processing occurs locally inside your browser.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Client-Side Private</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200 dark:border-indigo-800/40">
                <Lock className="w-3.5 h-3.5" />
                <span>No Server Storage</span>
              </div>
            </div>
          </div>

          {/* Creation & Tools */}
          <div className="space-y-3">
            <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
              Document Tools
            </div>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/pdf-generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  PDF Generator
                </Link>
              </li>
              <li>
                <Link to="/merge-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link to="/split-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Split PDF
                </Link>
              </li>
              <li>
                <Link to="/compress-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link to="/rotate-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Rotate PDF Pages
                </Link>
              </li>
              <li>
                <Link to="/image-to-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Image to PDF
                </Link>
              </li>
              <li>
                <Link to="/pdf-to-image" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  PDF to Image (ZIP)
                </Link>
              </li>
            </ul>
          </div>

          {/* Reading & Voice */}
          <div className="space-y-3">
            <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
              Reading & Voice
            </div>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/pdf-reader" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Online PDF Reader
                </Link>
              </li>
              <li>
                <Link to="/book-reader" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Book Voice Reader
                </Link>
              </li>
              <li>
                <Link to="/read-pdf-aloud" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Read PDF Aloud
                </Link>
              </li>
              <li>
                <Link to="/add-watermark" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Add Watermark
                </Link>
              </li>
              <li>
                <Link to="/add-page-numbers" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Add Page Numbers
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Feature Comparison
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div className="space-y-3">
            <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider">
              Company & Legal
            </div>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About Pragati Sahayak
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  FAQ & Support
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <p>
            © {currentYear} Pragati Sahayak. All rights reserved. Built for document privacy, speed and accessibility.
          </p>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span>WebAssembly Engine</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero-Telemetry</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
