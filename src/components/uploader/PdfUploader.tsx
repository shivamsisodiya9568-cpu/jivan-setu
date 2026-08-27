import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Loader2,
  Sparkles,
  ScanText
} from 'lucide-react';
import { useReadTriangle } from '../../context/ReadTriangleContext';

export const PdfUploader: React.FC = () => {
  const { documentState, uploadPdf, resetPdf } = useReadTriangle();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadPdf(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadPdf(e.target.files[0]);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Zone */}
      {!documentState.file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-lg scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-900'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,application/pdf"
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
              <Upload className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Drag & Drop your PDF here
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Books, Study Material, Research Papers, Notes, Articles & Scanned Documents
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all">
              <FileText className="w-4 h-4" />
              <span>Browse PDF File</span>
            </div>

            <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-2">
              Supports vector text PDFs & scanned image PDFs (Tesseract OCR enabled)
            </div>
          </div>
        </div>
      ) : (
        /* Document Status Card */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {documentState.fileName}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span>{formatBytes(documentState.fileSize)}</span>
                  <span>•</span>
                  <span>{documentState.totalPages} Page(s)</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    {documentState.detectedLanguage}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace</span>
              </button>
              <button
                onClick={resetPdf}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,application/pdf"
                className="hidden"
              />
            </div>
          </div>

          {/* OCR Processing Status */}
          {documentState.ocrProgress && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-xl flex items-center gap-3 text-xs text-amber-800 dark:text-amber-300">
              <ScanText className="w-4 h-4 animate-spin shrink-0 text-amber-600" />
              <div className="flex-1 overflow-hidden truncate">
                <span className="font-semibold">{documentState.ocrProgress.statusText}</span>
              </div>
            </div>
          )}

          {/* Scanned PDF Badge */}
          {documentState.isScanned && !documentState.ocrProgress && (
            <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 rounded-xl flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Scanned document recognized. Text extracted via OCR engine.</span>
            </div>
          )}
        </div>
      )}

      {/* Invalid File Error Banner */}
      {documentState.error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 rounded-xl flex items-center gap-3 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in duration-200">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
          <div className="flex-1">
            <div className="font-bold">Processing Failed</div>
            <div>{documentState.error}</div>
          </div>
        </div>
      )}
    </div>
  );
};
