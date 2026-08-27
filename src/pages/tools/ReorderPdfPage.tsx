import React, { useState } from 'react';
import { 
  Layers, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Download, 
  Undo2 
} from 'lucide-react';
import { SeoHead } from '../../components/layout/SeoHead';
import { FileDropzone } from '../../components/common/FileDropzone';
import { PrivacyBadge } from '../../components/common/PrivacyBadge';
import { ProcessingOverlay } from '../../components/common/ProcessingOverlay';
import { reorderAndFilterPages } from '../../services/pdfToolsService';
import { PdfReaderService } from '../../services/pdfReaderService';
import { downloadPdfBlob } from '../../services/pdfGeneratorService';
import { useToast } from '../../context/ToastContext';

interface ReorderPageItem {
  originalIndex: number; // 0-based
  displayNumber: number; // 1-based original
  thumbnailUrl: string;
}

export const ReorderPdfPage: React.FC = () => {
  const { success, error, info } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<ReorderPageItem[]>([]);
  const [deletedPages, setDeletedPages] = useState<ReorderPageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdfBytes, setResultPdfBytes] = useState<Uint8Array | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setIsProcessing(true);
    setResultPdfBytes(null);
    setDeletedPages([]);

    const readerService = new PdfReaderService();
    try {
      const buffer = await selected.arrayBuffer();
      const meta = await readerService.loadDocument(buffer);

      const items: ReorderPageItem[] = [];
      for (let i = 1; i <= meta.numPages; i++) {
        const thumb = await readerService.generateThumbnail(i, 160);
        items.push({
          originalIndex: i - 1,
          displayNumber: i,
          thumbnailUrl: thumb,
        });
      }
      setPages(items);
      success('Document Loaded', `${selected.name} (${meta.numPages} pages)`);
    } catch (err: any) {
      error('Load Error', 'Could not parse the PDF file.');
    } finally {
      readerService.destroy();
      setIsProcessing(false);
    }
  };

  const handleMovePage = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === pages.length - 1) return;

    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    const updated = [...pages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setPages(updated);
    setResultPdfBytes(null);
  };

  const handleDeletePage = (index: number) => {
    if (pages.length <= 1) {
      info('Minimum 1 Page', 'A document must contain at least one page.');
      return;
    }
    const item = pages[index];
    setDeletedPages((prev) => [...prev, item]);
    setPages((prev) => prev.filter((_, i) => i !== index));
    setResultPdfBytes(null);
  };

  const handleRestoreDeleted = () => {
    if (deletedPages.length === 0) return;
    const lastDeleted = deletedPages[deletedPages.length - 1];
    setDeletedPages((prev) => prev.slice(0, -1));
    setPages((prev) => [...prev, lastDeleted]);
    setResultPdfBytes(null);
  };

  const handleSave = async () => {
    if (!file || pages.length === 0) return;
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const newOrderIndices = pages.map((p) => p.originalIndex);
      const bytes = await reorderAndFilterPages(buffer, newOrderIndices);
      setResultPdfBytes(bytes);
      success('Order Saved', `Successfully prepared PDF with ${pages.length} pages.`);
    } catch (err: any) {
      error('Error', err?.message || 'Could not reorganize pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultPdfBytes || !file) return;
    const outName = `${file.name.replace('.pdf', '')}_reordered.pdf`;
    downloadPdfBlob(resultPdfBytes, outName);
    success('Downloaded', `Saved ${outName}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Reorder & Delete PDF Pages Online - Page Organizer Free"
        description="Organize, reorder and delete pages from your PDF documents online for free. Visual drag-and-drop page manager."
        keywords="reorder PDF pages, delete pages from PDF, organize PDF, rearrange PDF, PDF page manager"
        canonicalPath="/reorder-pdf"
      />

      {isProcessing && (
        <ProcessingOverlay
          message="Reorganizing PDF Pages..."
          submessage="Reconstructing vector page trees and references locally"
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-sm">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Reorder & Delete PDF Pages
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Organize document pages by moving them forward or backward and removing unwanted pages.
          </p>
        </div>

        {/* Dropzone or Workspace */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {!file ? (
            <FileDropzone
              accept="application/pdf"
              title="Upload PDF to organize"
              subtitle="Select any PDF document to reorganize pages."
              onFilesSelected={handleFileSelected}
            />
          ) : (
            <div className="space-y-6">
              {/* Document bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">
                      {file.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {pages.length} Pages Active • {deletedPages.length} Deleted
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {deletedPages.length > 0 && (
                    <button
                      onClick={handleRestoreDeleted}
                      className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Undo Delete</span>
                    </button>
                  )}
                  <button
                    onClick={() => setFile(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
                  >
                    Choose Different File
                  </button>
                </div>
              </div>

              {/* Visual Pages Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-[500px] overflow-y-auto p-3 bg-slate-50 dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border">
                {pages.map((item, idx) => (
                  <div
                    key={`${item.originalIndex}-${idx}`}
                    className="p-2 bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-xs flex flex-col items-center gap-2 group"
                  >
                    <div className="relative w-full aspect-[1/1.3] bg-white rounded overflow-hidden flex items-center justify-center p-1">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={`Page ${item.displayNumber}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <FileText className="w-8 h-8 text-slate-300" />
                      )}
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-slate-900/80 text-white font-mono text-[9px]">
                        Pos #{idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center justify-between w-full text-xs pt-1 border-t border-slate-100 dark:border-dark-border">
                      <span className="text-[11px] text-slate-500">
                        Orig #{item.displayNumber}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMovePage(idx, 'left')}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded disabled:opacity-20"
                          title="Move Left"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMovePage(idx, 'right')}
                          disabled={idx === pages.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded disabled:opacity-20"
                          title="Move Right"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePage(idx)}
                          className="p-1 text-rose-400 hover:text-rose-600 rounded"
                          title="Delete Page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  {pages.length} pages will be in the output PDF
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {resultPdfBytes ? (
                    <button
                      onClick={handleDownload}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all text-xs sm:text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Reordered PDF</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all text-xs sm:text-sm"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Save & Build New PDF</span>
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
