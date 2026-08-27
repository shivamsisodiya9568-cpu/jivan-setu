import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Upload, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Printer, 
  Download, 
  Search, 
  Sidebar, 
  RotateCw, 
  Sun, 
  Moon, 
  FileText, 
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { SeoHead } from '../components/layout/SeoHead';
import { FileDropzone } from '../components/common/FileDropzone';
import { PrivacyBadge } from '../components/common/PrivacyBadge';
import { ProcessingOverlay } from '../components/common/ProcessingOverlay';
import { PdfReaderService, PdfDocumentMeta } from '../services/pdfReaderService';
import { useToast } from '../context/ToastContext';

export const PdfReaderPage: React.FC = () => {
  const { success, error, info } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [docMeta, setDocMeta] = useState<PdfDocumentMeta | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.25);
  const [rotation, setRotation] = useState<number>(0);
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'sepia'>('light');
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<{ pageNumber: number; matchCount: number; snippets: string[] }[]>([]);
  const [showSearchBox, setShowSearchBox] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readerRef = useRef<PdfReaderService | null>(null);

  // Initialize service instance
  useEffect(() => {
    readerRef.current = new PdfReaderService();
    return () => {
      if (readerRef.current) {
        readerRef.current.destroy();
      }
    };
  }, []);

  // Load document
  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0 || !readerRef.current) return;
    const selected = files[0];
    setFile(selected);
    setIsProcessing(true);
    setSearchResults([]);
    setSearchQuery('');

    try {
      const buffer = await selected.arrayBuffer();
      const meta = await readerRef.current.loadDocument(buffer);
      setDocMeta(meta);
      setCurrentPage(1);

      // Render thumbnails asynchronously
      const thumbs: string[] = [];
      for (let i = 1; i <= Math.min(meta.numPages, 40); i++) {
        const t = await readerRef.current.generateThumbnail(i, 140);
        thumbs.push(t);
      }
      setThumbnails(thumbs);
      success('Document Ready', `${selected.name} (${meta.numPages} pages)`);
    } catch (err: any) {
      error('Load Error', err?.message || 'Could not render PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Render current page when page, scale, or rotation changes
  useEffect(() => {
    if (!readerRef.current || !docMeta || !canvasRef.current) return;

    let active = true;
    readerRef.current
      .renderPageToCanvas(currentPage, canvasRef.current, scale, rotation)
      .catch((err) => {
        if (active) console.warn('Render page error:', err);
      });

    return () => {
      active = false;
    };
  }, [currentPage, scale, rotation, docMeta]);

  const handleNextPage = () => {
    if (docMeta && currentPage < docMeta.numPages) {
      setCurrentPage((p) => p + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const handleZoomIn = () => {
    setScale((s) => Math.min(3.0, s + 0.25));
  };

  const handleZoomOut = () => {
    setScale((s) => Math.max(0.5, s - 0.25));
  };

  const handleFitWidth = () => {
    setScale(1.4);
  };

  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!readerRef.current || !searchQuery.trim()) return;

    setIsProcessing(true);
    try {
      const results = await readerRef.current.searchDocument(searchQuery);
      setSearchResults(results);
      if (results.length > 0) {
        setCurrentPage(results[0].pageNumber);
        success('Search Matches', `Found matches across ${results.length} pages.`);
      } else {
        info('No Matches', 'Search term not found in this document.');
      }
    } catch {
      // ignore
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadOriginal = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 min-h-screen">
      <SeoHead
        title="Online PDF Reader - High-Performance Document Viewer Free"
        description="Clean, fast, and distraction-free online PDF Reader. Read documents in your browser with full-text search, sidebar thumbnails, zoom, spread view, and night mode."
        keywords="PDF reader, online PDF viewer, open PDF in browser, free PDF reader, view PDF online"
        canonicalPath="/pdf-reader"
      />

      {isProcessing && (
        <ProcessingOverlay
          message="Rendering Document..."
          submessage="Drawing vector layers with WebAssembly canvas engine"
        />
      )}

      {/* Reader Main Top Action Toolbar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs sticky top-16 z-30 shadow-md">
        {/* Left: Document Info & Sidebar toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-2 rounded-xl transition-colors ${
              showSidebar ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
            title="Toggle Thumbnails Sidebar"
          >
            <Sidebar className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 max-w-[200px] sm:max-w-xs truncate">
            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-200 truncate">
              {docMeta?.title && docMeta.title !== 'Untitled Document' ? docMeta.title : file?.name || 'Document Reader'}
            </span>
          </div>
        </div>

        {/* Center: Page Navigation & Zoom */}
        {docMeta && (
          <div className="flex items-center gap-2">
            {/* Page Navigation */}
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-mono text-slate-300 px-1">
                {currentPage} / {docMeta.numPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage >= docMeta.numPages}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
              <button
                onClick={handleZoomOut}
                className="p-1 text-slate-400 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-[11px] text-slate-300 w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1 text-slate-400 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Right: Actions (Search, Themes, Print, Fullscreen, Upload New) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {docMeta && (
            <>
              {/* Search Toggle */}
              <button
                onClick={() => setShowSearchBox(!showSearchBox)}
                className={`p-2 rounded-xl transition-colors ${
                  showSearchBox ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title="Search Text"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Rotate View */}
              <button
                onClick={handleRotate}
                className="p-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl"
                title="Rotate View Clockwise"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Theme Toggle */}
              <div className="hidden md:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setThemeMode('light')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${themeMode === 'light' ? 'bg-white text-slate-950' : 'text-slate-400'}`}
                >
                  Light
                </button>
                <button
                  onClick={() => setThemeMode('dark')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${themeMode === 'dark' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setThemeMode('sepia')}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${themeMode === 'sepia' ? 'bg-[#fdf6e2] text-amber-950' : 'text-slate-400'}`}
                >
                  Sepia
                </button>
              </div>

              {/* Print */}
              <button
                onClick={handlePrint}
                className="p-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl"
                title="Print PDF"
              >
                <Printer className="w-4 h-4" />
              </button>

              {/* Download Original */}
              <button
                onClick={handleDownloadOriginal}
                className="p-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </>
          )}

          {/* Load new file button */}
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open PDF</span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFileSelected(Array.from(e.target.files));
              }}
            />
          </label>
        </div>
      </div>

      {/* Floating In-Document Search Overlay */}
      {showSearchBox && (
        <div className="bg-slate-900 border-b border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
          <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search inside this document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Search
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-slate-400">Jump to Match:</span>
              {searchResults.slice(0, 8).map((res) => (
                <button
                  key={res.pageNumber}
                  onClick={() => setCurrentPage(res.pageNumber)}
                  className={`px-2 py-1 rounded font-semibold ${
                    currentPage === res.pageNumber ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Page {res.pageNumber} ({res.matchCount})
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowSearchBox(false)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Reader Stage */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Thumbnails Sidebar */}
        {docMeta && showSidebar && (
          <aside className="w-48 sm:w-56 bg-slate-950 border-r border-slate-800 p-3 overflow-y-auto space-y-3 shrink-0 flex flex-col">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Pages ({docMeta.numPages})
            </div>

            <div className="space-y-2 flex-1">
              {Array.from({ length: docMeta.numPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const thumb = thumbnails[idx];
                const isCurrent = currentPage === pageNum;

                return (
                  <div
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`p-2 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-1.5 ${
                      isCurrent
                        ? 'border-indigo-500 bg-indigo-950/40 shadow-sm'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                    }`}
                  >
                    <div className="w-full aspect-[1/1.3] bg-white rounded overflow-hidden flex items-center justify-center p-1">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={`Page ${pageNum}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <FileText className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-300">
                      Page {pageNum}
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* Center Canvas Viewport */}
        <main
          className={`flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center transition-colors duration-200 ${
            themeMode === 'sepia'
              ? 'bg-[#f4ecd8]'
              : themeMode === 'light'
              ? 'bg-slate-200'
              : 'bg-slate-900'
          }`}
        >
          {!docMeta ? (
            <div className="max-w-md w-full p-8 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-950/70 text-indigo-400 mx-auto flex items-center justify-center">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No Document Loaded</h3>
                <p className="text-xs text-slate-400">
                  Select or drop any PDF document to read with full-text search, zoom, and thumbnails.
                </p>
              </div>

              <FileDropzone
                accept="application/pdf"
                title="Select PDF Document"
                subtitle="100% private in-browser rendering"
                onFilesSelected={handleFileSelected}
              />
            </div>
          ) : (
            <div className="shadow-2xl rounded overflow-hidden border border-slate-800 transition-all duration-150">
              <canvas ref={canvasRef} className="block mx-auto max-w-full h-auto" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
