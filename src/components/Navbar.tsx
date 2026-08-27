import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Play,
  Volume2,
  Bookmark,
  Sun,
  Moon,
  Upload,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  FileText
} from 'lucide-react';
import { useReadTriangle } from '../context/ReadTriangleContext';

export const Navbar: React.FC = () => {
  const {
    documentState,
    playback,
    isDarkMode,
    toggleDarkMode,
    latestProgress,
    loadSavedProgress,
    savedProgressList,
    setIsAiDrawerOpen,
    resetPdf,
  } = useReadTriangle();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookmarkMenuOpen, setIsBookmarkMenuOpen] = useState(false);
  const location = useLocation();

  const isStudioPage = location.pathname === '/app';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[11px] border-b-white ml-0.5" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>ReadTriangle</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide hidden sm:block">
              Turn Every Page Into a Voice
            </p>
          </div>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link to="/" className={`hover:text-indigo-600 dark:hover:text-white transition-colors ${location.pathname === '/' ? 'text-indigo-600 dark:text-white font-semibold' : ''}`}>
            Home
          </Link>
          <Link to="/app" className={`hover:text-indigo-600 dark:hover:text-white transition-colors ${location.pathname === '/app' ? 'text-indigo-600 dark:text-white font-semibold' : ''}`}>
            Studio Reader
          </Link>
          <Link to="/features" className={`hover:text-indigo-600 dark:hover:text-white transition-colors ${location.pathname === '/features' ? 'text-indigo-600 dark:text-white font-semibold' : ''}`}>
            Features
          </Link>
          <Link to="/how-it-works" className={`hover:text-indigo-600 dark:hover:text-white transition-colors ${location.pathname === '/how-it-works' ? 'text-indigo-600 dark:text-white font-semibold' : ''}`}>
            How It Works
          </Link>
          <Link to="/faq" className={`hover:text-indigo-600 dark:hover:text-white transition-colors ${location.pathname === '/faq' ? 'text-indigo-600 dark:text-white font-semibold' : ''}`}>
            FAQ
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Continue Reading Dropdown */}
          {savedProgressList.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsBookmarkMenuOpen(!isBookmarkMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                title="Continue Reading Bookmarks"
              >
                <Bookmark className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">Continue Reading</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isBookmarkMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                    Recent Bookmarks
                  </div>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {savedProgressList.map((p, idx) => (
                      <button
                        key={`bmark-${idx}`}
                        onClick={() => {
                          loadSavedProgress(p);
                          setIsBookmarkMenuOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-start gap-2 text-xs"
                      >
                        <FileText className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <div className="overflow-hidden">
                          <div className="font-semibold text-slate-900 dark:text-white truncate">{p.fileName}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Page {p.pageNumber} • {new Date(p.timestamp).toLocaleDateString()}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Drawer Button (When PDF loaded) */}
          {documentState.file && (
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="p-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800/60"
              title="Open ReadTriangle AI Assistant"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* CTA Studio Button */}
          {!isStudioPage && (
            <Link
              to="/app"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Open Studio</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-bg p-4 space-y-3">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-800 dark:text-slate-200">
            Home
          </Link>
          <Link to="/app" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            Studio Reader
          </Link>
          <Link to="/features" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-800 dark:text-slate-200">
            Features
          </Link>
          <Link to="/how-it-works" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-800 dark:text-slate-200">
            How It Works
          </Link>
          <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-800 dark:text-slate-200">
            FAQ
          </Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-800 dark:text-slate-200">
            About
          </Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm font-medium text-slate-800 dark:text-slate-200">
            Contact
          </Link>
        </div>
      )}
    </header>
  );
};
