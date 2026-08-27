import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Scissors, 
  Minimize2, 
  RotateCw, 
  Image as ImageIcon, 
  Stamp, 
  Hash, 
  FileText, 
  BookOpen, 
  Volume2, 
  ArrowRight,
  Search,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { SeoHead } from '../components/layout/SeoHead';
import { PrivacyBadge } from '../components/common/PrivacyBadge';

export const PdfToolsHubPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const tools = [
    {
      id: 'merge-pdf',
      title: 'Merge PDF',
      desc: 'Combine multiple PDF documents into a single organized file in your chosen order.',
      path: '/merge-pdf',
      icon: Layers,
      category: 'organize',
      badge: 'Popular',
    },
    {
      id: 'split-pdf',
      title: 'Split PDF',
      desc: 'Extract specific page ranges or split entire documents into standalone PDF files or ZIP.',
      path: '/split-pdf',
      icon: Scissors,
      category: 'organize',
      badge: 'Popular',
    },
    {
      id: 'compress-pdf',
      title: 'Compress PDF',
      desc: 'Optimize internal streams and eliminate redundant metadata to reduce file size without losing readability.',
      path: '/compress-pdf',
      icon: Minimize2,
      category: 'optimize',
      badge: 'Fast',
    },
    {
      id: 'rotate-pdf',
      title: 'Rotate PDF',
      desc: 'Rotate individual pages or entire documents 90°, 180°, or 270° clockwise.',
      path: '/rotate-pdf',
      icon: RotateCw,
      category: 'organize',
      badge: 'Utility',
    },
    {
      id: 'reorder-pdf',
      title: 'Reorder & Delete Pages',
      desc: 'Visually drag and drop pages to reorganize order or delete unnecessary pages.',
      path: '/reorder-pdf',
      icon: Layers,
      category: 'organize',
      badge: 'Visual',
    },
    {
      id: 'image-to-pdf',
      title: 'Image to PDF',
      desc: 'Convert multiple PNG, JPG, or WebP graphics into a clean multi-page PDF publication.',
      path: '/image-to-pdf',
      icon: ImageIcon,
      category: 'convert',
      badge: 'Convert',
    },
    {
      id: 'pdf-to-image',
      title: 'PDF to Image (ZIP)',
      desc: 'Render high-resolution PNG or JPG images from PDF pages and download as a ZIP package.',
      path: '/pdf-to-image',
      icon: ImageIcon,
      category: 'convert',
      badge: 'Convert',
    },
    {
      id: 'add-watermark',
      title: 'Add Watermark',
      desc: 'Apply customizable text watermarks with adjustable angle, opacity, font size, and layering.',
      path: '/add-watermark',
      icon: Stamp,
      category: 'security',
      badge: 'Format',
    },
    {
      id: 'add-page-numbers',
      title: 'Add Page Numbers',
      desc: 'Inject numbered headers and footers with custom positions, formats, and margin offsets.',
      path: '/add-page-numbers',
      icon: Hash,
      category: 'format',
      badge: 'Format',
    },
    {
      id: 'pdf-generator',
      title: 'PDF Generator Studio',
      desc: 'Compose rich documents with text formatting, headings, bullet lists, and embedded images.',
      path: '/pdf-generator',
      icon: FileText,
      category: 'create',
      badge: 'Creator',
    },
    {
      id: 'pdf-reader',
      title: 'Online PDF Reader',
      desc: 'Read documents with full-text search, sidebar thumbnails, zoom, spread view, and dark mode.',
      path: '/pdf-reader',
      icon: BookOpen,
      category: 'read',
      badge: 'Reader',
    },
    {
      id: 'book-reader',
      title: 'Book Reader + Voice',
      desc: 'Listen to uploaded documents and books with browser-native text-to-speech and sentence highlighting.',
      path: '/book-reader',
      icon: Volume2,
      category: 'read',
      badge: 'Auditory',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Tools' },
    { id: 'organize', label: 'Organize & Split' },
    { id: 'convert', label: 'Convert' },
    { id: 'optimize', label: 'Optimize' },
    { id: 'format', label: 'Format & Watermark' },
    { id: 'read', label: 'Read & Voice' },
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Free Online PDF Tools Suite - Merge, Split, Compress & Convert"
        description="Comprehensive collection of free online PDF tools. Merge PDFs, split pages, compress file size, rotate documents, convert images to PDF, and add watermarks with 100% browser privacy."
        keywords="PDF tools, merge PDF, split PDF, compress PDF, rotate PDF, image to PDF, PDF to image, free online PDF tools"
        canonicalPath="/pdf-tools"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Document Suite</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Pragati Sahayak PDF Tools Hub
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            All essential PDF utilities in one privacy-first workspace. Fast, vector-accurate, and executed entirely in your browser.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search PDF tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-dark-card text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-hover'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="group p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border hover:border-indigo-500/70 dark:hover:border-indigo-500/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {tool.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-dark-border flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Open Tool</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="pt-8">
          <PrivacyBadge />
        </div>
      </div>
    </div>
  );
};
