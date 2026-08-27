import React, { useState } from 'react';
import { 
  Scissors, 
  FileText, 
  Download, 
  CheckSquare, 
  Square, 
  Archive 
} from 'lucide-react';
import { SeoHead } from '../../components/layout/SeoHead';
import { FileDropzone } from '../../components/common/FileDropzone';
import { PrivacyBadge } from '../../components/common/PrivacyBadge';
import { ProcessingOverlay } from '../../components/common/ProcessingOverlay';
import { splitPdf, splitPdfToZip } from '../../services/pdfToolsService';
import { PdfReaderService } from '../../services/pdfReaderService';
import { downloadPdfBlob } from '../../services/pdfGeneratorService';
import { useToast } from '../../context/ToastContext';

export const SplitPdfPage: React.FC = () => {
  const { success, error, info } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageThumbnails, setPageThumbnails] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [rangeInput, setRangeInput] = useState<string>('');
  const [splitMode, setSplitMode] = useState<'selected' | 'all_zip'>('selected');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdfBytes, setResultPdfBytes] = useState<Uint8Array | null>(null);
  const [resultZipBlob, setResultZipBlob] = useState<Blob | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setIsProcessing(true);
    setResultPdfBytes(null);
    setResultZipBlob(null);

    const readerService = new PdfReaderService();
    try {
      const buffer = await selected.arrayBuffer();
      const meta = await readerService.loadDocument(buffer);
      setTotalPages(meta.numPages);

      // Generate thumbnails for pages
      const thumbs: string[] = [];
      for (let i = 1; i <= meta.numPages; i++) {
        const thumb = await readerService.generateThumbnail(i, 160);
        thumbs.push(thumb);
      }
      setPageThumbnails(thumbs);
      setSelectedPages([1]);
      setRangeInput('1');
      success('Document Loaded', `${selected.name} (${meta.numPages} pages)`);
    } catch (err: any) {
      error('Load Error', 'Could not parse the PDF file.');
    } finally {
      readerService.destroy();
      setIsProcessing(false);
    }
  };

  const togglePageSelection = (pageNum: number) => {
    let updated: number[];
    if (selectedPages.includes(pageNum)) {
      updated = selectedPages.filter((p) => p !== pageNum);
    } else {
      updated = [...selectedPages, pageNum].sort((a, b) => a - b);
    }
    setSelectedPages(updated);
    setRangeInput(updated.join(', '));
    setResultPdfBytes(null);
  };

  const selectAllPages = () => {
    const all = Array.from({ length: totalPages }, (_, i) => i + 1);
    setSelectedPages(all);
    setRangeInput(`1-${totalPages}`);
    setResultPdfBytes(null);
  };

  const deselectAllPages = () => {
    setSelectedPages([]);
    setRangeInput('');
    setResultPdfBytes(null);
  };

  const parseRangeString = (input: string): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',');
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map((n) => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          for (let p = Math.min(start, end); p <= Math.max(start, end); p++) {
            if (p >= 1 && p <= totalPages) pages.add(p);
          }
        }
      } else {
        const p = parseInt(trimmed, 10);
        if (!isNaN(p) && p >= 1 && p <= totalPages) pages.add(p);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleRangeInputChange = (val: string) => {
    setRangeInput(val);
    const parsed = parseRangeString(val);
    setSelectedPages(parsed);
    setResultPdfBytes(null);
  };

  const handleSplit = async () => {
    if (!file) return;

    if (splitMode === 'selected' && selectedPages.length === 0) {
      info('No Pages Selected', 'Please select at least one page to extract.');
      return;
    }

    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      if (splitMode === 'selected') {
        const bytes = await splitPdf(buffer, selectedPages);
        setResultPdfBytes(bytes);
        success('Pages Extracted', `Extracted ${selectedPages.length} pages.`);
      } else {
        const zipBlob = await splitPdfToZip(buffer, file.name.replace('.pdf', ''));
        setResultZipBlob(zipBlob);
        success('Split to ZIP Complete', `Prepared ZIP containing all ${totalPages} pages.`);
      }
    } catch (err: any) {
      error('Split Failed', err?.message || 'Error occurred while splitting PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadExtracted = () => {
    if (!resultPdfBytes || !file) return;
    const outName = `${file.name.replace('.pdf', '')}_extracted_pages.pdf`;
    downloadPdfBlob(resultPdfBytes, outName);
  };

  const handleDownloadZip = () => {
    if (!resultZipBlob || !file) return;
    const url = URL.createObjectURL(resultZipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace('.pdf', '')}_pages.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Split PDF Online - Extract Pages from PDF Free"
        description="Split PDF pages or extract custom page ranges from your documents online. Fast, secure, and private client-side processing."
        keywords="split PDF, extract pages from PDF, separate PDF pages, split PDF to zip, free PDF splitter"
        canonicalPath="/split-pdf"
      />

      {isProcessing && (
        <ProcessingOverlay
          message="Processing PDF Pages..."
          submessage="Extracting page vectors and compiling document structures locally"
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-sm">
            <Scissors className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Split & Extract PDF Pages
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Extract selected page ranges or separate every single page into an individual PDF file or ZIP archive.
          </p>
        </div>

        {/* Dropzone or Split Workspace */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {!file ? (
            <FileDropzone
              accept="application/pdf"
              title="Upload a PDF to split"
              subtitle="Select any PDF document. All pages are extracted locally."
              onFilesSelected={handleFileSelected}
            />
          ) : (
            <div className="space-y-6">
              {/* Document bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-rose-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">
                      {file.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {totalPages} Pages • {Math.round(file.size / 1024)} KB
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setFile(null)}
                  className="text-xs text-slate-500 hover:text-rose-600 font-medium"
                >
                  Choose Different File
                </button>
              </div>

              {/* Mode Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setSplitMode('selected')}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    splitMode === 'selected'
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                      : 'border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Scissors className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm">Extract Selected Pages</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Combine chosen pages into a single new PDF document.
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSplitMode('all_zip')}
                  className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    splitMode === 'all_zip'
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                      : 'border-slate-200 dark:border-dark-border bg-white dark:bg-dark-surface text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Archive className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm">Split Every Page (ZIP)</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Save each page as its own individual PDF file packaged in a ZIP.
                    </div>
                  </div>
                </button>
              </div>

              {/* Page Selection Controls */}
              {splitMode === 'selected' && (
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Page Range:
                      </span>
                      <input
                        type="text"
                        value={rangeInput}
                        onChange={(e) => handleRangeInputChange(e.target.value)}
                        placeholder="e.g. 1-3, 5, 8"
                        className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface text-slate-900 dark:text-white w-48 font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={selectAllPages}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={deselectAllPages}
                        className="text-slate-500 hover:underline font-medium"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-2 bg-slate-50 dark:bg-dark-surface rounded-xl border border-slate-200 dark:border-dark-border">
                    {pageThumbnails.map((thumb, idx) => {
                      const pageNum = idx + 1;
                      const isSelected = selectedPages.includes(pageNum);
                      return (
                        <div
                          key={pageNum}
                          onClick={() => togglePageSelection(pageNum)}
                          className={`relative cursor-pointer rounded-xl border-2 p-1.5 flex flex-col items-center gap-1.5 transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 shadow-sm'
                              : 'border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card hover:border-slate-400'
                          }`}
                        >
                          <div className="relative w-full aspect-[1/1.3] bg-white rounded overflow-hidden flex items-center justify-center">
                            {thumb ? (
                              <img src={thumb} alt={`Page ${pageNum}`} className="w-full h-full object-contain" />
                            ) : (
                              <FileText className="w-8 h-8 text-slate-300" />
                            )}
                            <div className="absolute top-1 right-1">
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-indigo-600 fill-white" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400 fill-white" />
                              )}
                            </div>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            Page {pageNum}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  {splitMode === 'selected'
                    ? `${selectedPages.length} of ${totalPages} pages selected`
                    : `Will produce ${totalPages} individual PDF files`}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {resultPdfBytes ? (
                    <button
                      onClick={handleDownloadExtracted}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all text-xs sm:text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Extracted PDF</span>
                    </button>
                  ) : resultZipBlob ? (
                    <button
                      onClick={handleDownloadZip}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all text-xs sm:text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download All Pages (.ZIP)</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSplit}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all text-xs sm:text-sm"
                    >
                      <Scissors className="w-4 h-4" />
                      <span>{splitMode === 'selected' ? 'Extract Pages Now' : 'Split to ZIP Now'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <PrivacyBadge />
      </div>
    </div>
  );
};
