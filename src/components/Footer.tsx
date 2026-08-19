import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, FileText, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-100 dark:bg-dark-surface border-t border-slate-200/80 dark:border-slate-800/80 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-dark-bg rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-sky-400">
                    PS
                  </span>
                </div>
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-400 transition-colors">
                  Pragati Sahayak
                </span>
                <span className="block text-[11px] font-medium tracking-wider uppercase text-brand-600 dark:text-brand-400 -mt-1">
                  Font Generator
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Create stylish, unique, and copy-ready text in seconds. The ultimate Unicode font generation platform with AI recommendations, 50+ aesthetic styles, and instant copy.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                100% Client-Side
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 font-medium">
                Unicode Standard
              </span>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Font Tools
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/generator" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  Font Generator
                </Link>
              </li>
              <li>
                <Link to="/agent" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  Pragati Font Agent
                </Link>
              </li>
              <li>
                <Link to="/fonts" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  Font Styles Library
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  My Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/generator?category=popular" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  Popular Styles
                </Link>
              </li>
              <li>
                <Link to="/generator?category=gaming" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  Gaming Clan Tags
                </Link>
              </li>
              <li>
                <Link to="/generator?category=social" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  Instagram Bio Fonts
                </Link>
              </li>
              <li>
                <Link to="/generator?category=gothic" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  Gothic & Fraktur
                </Link>
              </li>
              <li>
                <Link to="/generator?category=cute" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  Cute & Aesthetic
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & About */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Platform & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/about" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                  About Platform
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <p>© 2026 Pragati Sahayak. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline mx-0.5" /> for creators everywhere
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
