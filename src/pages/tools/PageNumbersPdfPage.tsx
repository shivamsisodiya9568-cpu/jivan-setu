import React, { useState } from 'react';
import { 
  Hash, 
  FileText, 
  Download 
} from 'lucide-react';
import { SeoHead } from '../../components/layout/SeoHead';
import { FileDropzone } from '../../components/common/FileDropzone';
import { PrivacyBadge } from '../../components/common/PrivacyBadge';
import { ProcessingOverlay } from '../../components/common/ProcessingOverlay';
import { addPageNumbersToPdf } from '../../services/pdfToolsService';
import { downloadPdfBlob } from '../../services/pdfGeneratorService';
import { PageNumberSettings } from '../../types';
import { useToast } from '../../context/ToastContext';

export const PageNumbersPdfPage: React.FC = () => {
  const { success, error } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdfBytes, setResultPdfBytes] = useState<Uint8Array | null>(null);

  const [settings, setSettings] = useState<PageNumberSettings>({
    position: 'bottom-center',
    format: 'page-of-total',
    startFrom: 1,
    fontSize: 10,
    color: '#475569',
    includeFirstPage: true,
  });

  const handleFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    setResultPdfBytes(null);
    success('File Uploaded', `${files[0].name}`);
  };

  const handleApplyNumbers = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = await addPageNumbersToPdf(buffer, settings);
      setResultPdfBytes(bytes);
      success('Page Numbers Added', 'Numbered headers/footers applied.');
    } catch (err: any) {
      error('Error', err?.message || 'Failed to add page numbers.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultPdfBytes || !file) return;
    const outName = `${file.name.replace('.pdf', '')}_numbered.pdf`;
    downloadPdfBlob(resultPdfBytes, outName);
    success('Downloaded', `Saved ${outName}`);
  };

  const positions = [
    { id: 'top-left', label: 'Top Left' },
    { id: 'top-center', label: 'Top Center' },
    { id: 'top-right', label: 'Top Right' },
    { id: 'bottom-left', label: 'Bottom Left' },
    { id: 'bottom-center', label: 'Bottom Center' },
    { id: 'bottom-right', label: 'Bottom Right' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Add Page Numbers to PDF Online - Free PDF Numbering"
        description="Add page numbers and headers to your PDF documents online for free. Choose custom positions, formats, and offsets."
        keywords="add page numbers to PDF, PDF page numbers, number PDF pages, paginate PDF, free PDF numberer"
        canonicalPath="/add-page-numbers"
      />

      {isProcessing && (
        <ProcessingOverlay
          message="Numbering PDF Pages..."
          submessage="Injecting vector page numbers and coordinates locally in your browser"
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-sm">
            <Hash className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Add Page Numbers to PDF
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Insert customized page numbering into your existing documents with precise layout control.
          </p>
        </div>

        {/* Dropzone or Settings */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {!file ? (
            <FileDropzone
              accept="application/pdf"
              title="Upload PDF to number"
              subtitle="Select any PDF document. Page numbering is processed locally."
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
                      {Math.round(file.size / 1024)} KB
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setFile(null)}
                  className="text-xs text-slate-500 hover:text-indigo-600 font-medium"
                >
                  Choose Different File
                </button>
              </div>

              {/* Numbering Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border">
                {/* Position Grid */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Number Position on Page
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {positions.map((pos) => (
                      <button
                        key={pos.id}
                        onClick={() => setSettings({ ...settings, position: pos.id as any })}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          settings.position === pos.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number Format */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Number Format
                  </label>
                  <select
                    value={settings.format}
                    onChange={(e) => setSettings({ ...settings, format: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white"
                  >
                    <option value="page-of-total">Page 1 of 10</option>
                    <option value="simple-number">1</option>
                    <option value="dash-number">— 1 —</option>
                  </select>
                </div>

                {/* Starting Number */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Start Numbering From
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={settings.startFrom}
                    onChange={(e) => setSettings({ ...settings, startFrom: parseInt(e.target.value, 10) || 1 })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white"
                  />
                </div>

                {/* Include First Page Option */}
                <div className="flex items-center gap-2 sm:col-span-2 pt-2">
                  <input
                    type="checkbox"
                    id="includeFirst"
                    checked={settings.includeFirstPage}
                    onChange={(e) => setSettings({ ...settings, includeFirstPage: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="includeFirst" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Include page number on the very first cover page
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-dark-border flex flex-col sm:flex-row items-center justify-end gap-3">
                {resultPdfBytes ? (
                  <button
                    onClick={handleDownload}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all text-xs sm:text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Numbered PDF</span>
                  </button>
                ) : (
                  <button
                    onClick={handleApplyNumbers}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all text-xs sm:text-sm"
                  >
                    <Hash className="w-4 h-4" />
                    <span>Apply Page Numbers</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <PrivacyBadge />
      </div>
    </div>
  );
};
