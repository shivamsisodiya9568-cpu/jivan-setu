import React, { useState } from 'react';
import { 
  RotateCw, 
  RotateCcw, 
  FileText, 
  Download 
} from 'lucide-react';
import { SeoHead } from '../../components/layout/SeoHead';
import { FileDropzone } from '../../components/common/FileDropzone';
import { PrivacyBadge } from '../../components/common/PrivacyBadge';
import { ProcessingOverlay } from '../../components/common/ProcessingOverlay';
import { rotatePdfPages } from '../../services/pdfToolsService';
import { PdfReaderService } from '../../services/pdfReaderService';
import { downloadPdfBlob } from '../../services/pdfGeneratorService';
import { useToast } from '../../context/ToastContext';

export const RotatePdfPage: React.FC = () => {
  const { success, error } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageThumbnails, setPageThumbnails] = useState<string[]>([]);
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotatedPdfBytes, setRotatedPdfBytes] = useState<Uint8Array | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setIsProcessing(true);
    setRotatedPdfBytes(null);
    setRotations({});

    const readerService = new PdfReaderService();
    try {
      const buffer = await selected.arrayBuffer();
      const meta = await readerService.loadDocument(buffer);
      setTotalPages(meta.numPages);

      const thumbs: string[] = [];
      for (let i = 1; i <= meta.numPages; i++) {
        const thumb = await readerService.generateThumbnail(i, 160);
        thumbs.push(thumb);
      }
      setPageThumbnails(thumbs);
      success('Document Loaded', `${selected.name} (${meta.numPages} pages)`);
    } catch (err: any) {
      error('Load Error', 'Could not load PDF document.');
    } finally {
      readerService.destroy();
      setIsProcessing(false);
    }
  };

  const handleRotatePage = (pageZeroIndex: number, delta: number) => {
    setRotations((prev) => {
      const current = prev[pageZeroIndex] || 0;
      const next = (current + delta + 360) % 360;
      return { ...prev, [pageZeroIndex]: next };
    });
    setRotatedPdfBytes(null);
  };

  const handleRotateAll = (delta: number) => {
    const updated: Record<number, number> = {};
    for (let i = 0; i < totalPages; i++) {
      const current = rotations[i] || 0;
      updated[i] = (current + delta + 360) % 360;
    }
    setRotations(updated);
    setRotatedPdfBytes(null);
  };

  const handleResetRotations = () => {
    setRotations({});
    setRotatedPdfBytes(null);
  };

  const handleApplyRotation = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = await rotatePdfPages(buffer, rotations);
      setRotatedPdfBytes(bytes);
      success('Rotation Applied', 'Pages rotated successfully.');
    } catch (err: any) {
      error('Rotation Error', err?.message || 'Failed to rotate pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!rotatedPdfBytes || !file) return;
    const outName = `${file.name.replace('.pdf', '')}_rotated.pdf`;
    downloadPdfBlob(rotatedPdfBytes, outName);
    success('Downloaded', `Saved ${outName}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Rotate PDF Online - Rotate PDF Pages Free"
        description="Rotate PDF pages 90, 180, or 270 degrees clockwise or counterclockwise online. Save and download permanently rotated PDF files instantly."
        keywords="rotate PDF, rotate PDF pages, flip PDF, change PDF orientation, free PDF rotator"
        canonicalPath="/rotate-pdf"
      />

      {isProcessing && (
        <ProcessingOverlay
          message="Rotating PDF Pages..."
          submessage="Updating page transform matrices locally in browser memory"
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400 mx-auto flex items-center justify-center shadow-sm">
            <RotateCw className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Rotate PDF Pages
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Rotate individual pages or all pages clockwise or counterclockwise. Permanently saves orientation into the PDF file.
          </p>
        </div>

        {/* Dropzone or Rotate Workspace */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {!file ? (
            <FileDropzone
              accept="application/pdf"
              title="Upload PDF to rotate"
              subtitle="Select any PDF document to rotate pages."
              onFilesSelected={handleFileSelected}
            />
          ) : (
            <div className="space-y-6">
              {/* Document bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-cyan-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">
                      {file.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {totalPages} Pages • {Math.round(file.size / 1024)} KB
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRotateAll(90)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Rotate All +90°</span>
                  </button>

                  <button
                    onClick={handleResetRotations}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 font-medium"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Page Thumbnails Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-[500px] overflow-y-auto p-3 bg-slate-50 dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border">
                {pageThumbnails.map((thumb, idx) => {
                  const deg = rotations[idx] || 0;
                  return (
                    <div
                      key={idx}
                      className="p-2 bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-xs flex flex-col items-center gap-2"
                    >
                      <div className="relative w-full aspect-[1/1.3] bg-white rounded overflow-hidden flex items-center justify-center p-1">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={`Page ${idx + 1}`}
                            style={{ transform: `rotate(${deg}deg)` }}
                            className="max-w-full max-h-full object-contain transition-transform duration-200"
                          />
                        ) : (
                          <FileText className="w-8 h-8 text-slate-300" />
                        )}
                        {deg !== 0 && (
                          <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-cyan-600 text-white font-mono text-[9px]">
                            {deg}°
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between w-full text-xs pt-1 border-t border-slate-100 dark:border-dark-border">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {idx + 1}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleRotatePage(idx, -90)}
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded hover:bg-slate-100"
                            title="Rotate Left"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRotatePage(idx, 90)}
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded hover:bg-slate-100"
                            title="Rotate Right"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  {Object.keys(rotations).filter((k) => rotations[parseInt(k, 10)] !== 0).length} of {totalPages} pages rotated
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {rotatedPdfBytes ? (
                    <button
                      onClick={handleDownload}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all text-xs sm:text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Rotated PDF</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyRotation}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all text-xs sm:text-sm"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span>Apply & Save Rotations</span>
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
