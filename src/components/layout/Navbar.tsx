import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Wrench, 
  BookOpen, 
  Volume2, 
  Sparkles, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  PlusCircle, 
  HelpCircle, 
  Info,
  ChevronDown,
  Layers,
  Scissors,
  Minimize2,
  RotateCw,
  Image as ImageIcon,
  Stamp,
  Hash
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'PDF Generator', path: '/pdf-generator' },
    { name: 'PDF Reader', path: '/pdf-reader' },
    { name: 'Read Aloud', path: '/book-reader' },
    { name: 'Features', path: '/features' },
    { name: 'FAQ', path: '/faq' },
    { name: 'About', path: '/about' },
  ];

  const pdfToolsQuick = [
    { name: 'Merge PDF', path: '/merge-pdf', icon: Layers, desc: 'Combine multiple PDFs into one' },
    { name: 'Split PDF', path: '/split-pdf', icon: Scissors, desc: 'Extract pages or split into files' },
    { name: 'Compress PDF', path: '/compress-pdf', icon: Minimize2, desc: 'Optimize & reduce file size' },
    { name: 'Rotate PDF', path: '/rotate-pdf', icon: RotateCw, desc: 'Rotate specific or all pages' },
    { name: 'Image to PDF', path: '/image-to-pdf', icon: ImageIcon, desc: 'Convert JPG/PNG to PDF' },
    { name: 'PDF to Image', path: '/pdf-to-image', icon: ImageIcon, desc: 'Export high-DPI page images' },
    { name: 'Add Watermark', path: '/add-watermark', icon: Stamp, desc: 'Apply custom text watermarks' },
    { name: 'Add Page Numbers', path: '/add-page-numbers', icon: Hash, desc: 'Insert custom headers & numbers' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/85 dark:bg-dark-bg/85 backdrop-blur-md border-b border-slate-200/80 dark:border-dark-border shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
                  Pragati Sahayak
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
                  PDF
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-tight hidden sm:block">
                Generate • Read • Listen
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === '/'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-hover'
              }`}
            >
              Home
            </Link>

            <Link
              to="/pdf-generator"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                location.pathname === '/pdf-generator'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-hover'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-500" />
              PDF Generator
            </Link>

            {/* PDF Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                onBlur={() => setTimeout(() => setToolsDropdownOpen(false), 200)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  location.pathname.startsWith('/pdf-tools') ||
                  location.pathname.includes('-pdf') ||
                  location.pathname.includes('watermark') ||
                  location.pathname.includes('numbers')
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-hover'
                }`}
                aria-expanded={toolsDropdownOpen}
              >
                <Wrench className="w-4 h-4 text-slate-500" />
                <span>PDF Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-72 p-2 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-slate-200 dark:border-dark-border grid grid-cols-1 gap-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-dark-border mb-1 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">All PDF Utilities</span>
                    <Link to="/pdf-tools" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">View Hub →</Link>
                  </div>
                  {pdfToolsQuick.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-hover transition-colors group"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/70 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        <tool.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {tool.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {tool.desc}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/pdf-reader"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                location.pathname === '/pdf-reader'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-hover'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-500" />
              PDF Reader
            </Link>

            <Link
              to="/book-reader"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                location.pathname === '/book-reader' || location.pathname === '/read-pdf-aloud'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-hover'
              }`}
            >
              <Volume2 className="w-4 h-4 text-amber-500" />
              Read Aloud
            </Link>

            <Link
              to="/features"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === '/features'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-hover'
              }`}
            >
              Features
            </Link>

            <Link
              to="/faq"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === '/faq'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-hover'
              }`}
            >
              FAQ
            </Link>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-hover transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Toggle dark mode"
              title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Primary CTA Button */}
            <Link
              to="/pdf-generator"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm shadow-indigo-600/20 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create PDF</span>
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-hover focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-white dark:bg-dark-bg border-b border-slate-200 dark:border-dark-border shadow-2xl p-4 max-h-[calc(100vh-4rem)] overflow-y-auto z-50 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-1.5">
            <Link
              to="/pdf-generator"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white bg-indigo-600 font-semibold text-sm shadow-md mb-2"
            >
              <PlusCircle className="w-4 h-4" />
              Create PDF Now
            </Link>

            <Link
              to="/"
              className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-hover"
            >
              Home
            </Link>

            <Link
              to="/pdf-generator"
              className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-hover flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-indigo-500" />
              PDF Generator
            </Link>

            <Link
              to="/pdf-reader"
              className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-hover flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-emerald-500" />
              PDF Reader
            </Link>

            <Link
              to="/book-reader"
              className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-hover flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4 text-amber-500" />
              Read Aloud (Book Voice)
            </Link>

            <Link
              to="/pdf-tools"
              className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-hover flex items-center gap-2"
            >
              <Wrench className="w-4 h-4 text-indigo-500" />
              PDF Tools Suite (All 10 Tools)
            </Link>

            <div className="grid grid-cols-2 gap-1.5 pl-3 py-1 my-1 border-l-2 border-indigo-500/30">
              <Link to="/merge-pdf" className="text-xs text-slate-600 dark:text-slate-400 py-1 hover:text-indigo-600">Merge PDF</Link>
              <Link to="/split-pdf" className="text-xs text-slate-600 dark:text-slate-400 py-1 hover:text-indigo-600">Split PDF</Link>
              <Link to="/compress-pdf" className="text-xs text-slate-600 dark:text-slate-400 py-1 hover:text-indigo-600">Compress PDF</Link>
              <Link to="/rotate-pdf" className="text-xs text-slate-600 dark:text-slate-400 py-1 hover:text-indigo-600">Rotate PDF</Link>
              <Link to="/image-to-pdf" className="text-xs text-slate-600 dark:text-slate-400 py-1 hover:text-indigo-600">Image to PDF</Link>
              <Link to="/pdf-to-image" className="text-xs text-slate-600 dark:text-slate-400 py-1 hover:text-indigo-600">PDF to Image</Link>
              <Link to="/add-watermark" className="text-xs text-slate-600 dark:text-slate-400 py-1 hover:text-indigo-600">Add Watermark</Link>
              <Link to="/add-page-numbers" className="text-xs text-slate-600 dark:text-slate-400 py-1 hover:text-indigo-600">Page Numbers</Link>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-dark-border flex flex-col gap-1">
              <Link
                to="/features"
                className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-hover"
              >
                Features & Comparison
              </Link>
              <Link
                to="/faq"
                className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-hover"
              >
                Frequently Asked Questions
              </Link>
              <Link
                to="/about"
                className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-hover"
              >
                About Pragati Sahayak
              </Link>
              <Link
                to="/contact"
                className="px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-hover"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
