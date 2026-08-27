import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Globe, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-bg text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[9px] border-b-white ml-0.5" />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">ReadTriangle</span>
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              "Turn Every Page Into a Voice."
            </p>
            <p className="text-xs leading-relaxed max-w-sm text-slate-500 dark:text-slate-400">
              ReadTriangle is a premium multilingual PDF reading platform that allows users to upload readable PDFs and listen to contents as natural, human-like synthetic speech.
            </p>
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 pt-2">
              <span className="flex items-center gap-1 text-[11px]"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Client-side Privacy</span>
              <span className="flex items-center gap-1 text-[11px]"><Globe className="w-3.5 h-3.5 text-indigo-500" /> Multilingual Voices</span>
            </div>
          </div>

          {/* Col 2: Core SEO Features */}
          <div className="space-y-2.5">
            <div className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Features</div>
            <ul className="space-y-2">
              <li><Link to="/pdf-to-audio" className="hover:text-indigo-600 dark:hover:text-white transition-colors">PDF to Audio</Link></li>
              <li><Link to="/pdf-reader" className="hover:text-indigo-600 dark:hover:text-white transition-colors">PDF Reader</Link></li>
              <li><Link to="/pdf-text-to-speech" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Text to Speech PDF</Link></li>
              <li><Link to="/pdf-voice-reader" className="hover:text-indigo-600 dark:hover:text-white transition-colors">PDF Voice Reader</Link></li>
              <li><Link to="/ai-pdf-reader" className="hover:text-indigo-600 dark:hover:text-white transition-colors">AI PDF Reader</Link></li>
              <li><Link to="/multilingual-pdf-reader" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Multilingual Reader</Link></li>
              <li><Link to="/pdf-audiobook" className="hover:text-indigo-600 dark:hover:text-white transition-colors">PDF Audiobook</Link></li>
            </ul>
          </div>

          {/* Col 3: Platform */}
          <div className="space-y-2.5">
            <div className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Platform</div>
            <ul className="space-y-2">
              <li><Link to="/app" className="hover:text-indigo-600 dark:hover:text-white transition-colors font-medium text-indigo-600 dark:text-indigo-400">Studio Reader</Link></li>
              <li><Link to="/features" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Features Overview</Link></li>
              <li><Link to="/how-it-works" className="hover:text-indigo-600 dark:hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/faq" className="hover:text-indigo-600 dark:hover:text-white transition-colors">FAQ & Support</Link></li>
              <li><Link to="/about" className="hover:text-indigo-600 dark:hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Col 4: Legal & Policy */}
          <div className="space-y-2.5">
            <div className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Legal & Trust</div>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/copyright-policy" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Copyright Policy</Link></li>
              <li><Link to="/privacy-policy#cookies" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} ReadTriangle. All rights reserved. Built for fast, private document listening.</p>
          <div className="flex items-center gap-6">
            <Link to="/sitemap.xml" target="_blank" className="hover:text-slate-900 dark:hover:text-white">Sitemap</Link>
            <Link to="/privacy-policy" className="hover:text-slate-900 dark:hover:text-white">Privacy</Link>
            <Link to="/terms-and-conditions" className="hover:text-slate-900 dark:hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
