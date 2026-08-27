import React, { useState } from 'react';
import { 
  Layers, 
  FileText, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Download 
} from 'lucide-react';
import { SeoHead } from '../../components/layout/SeoHead';
import { FileDropzone } from '../../components/common/FileDropzone';
import { PrivacyBadge } from '../../components/common/PrivacyBadge';
import { ProcessingOverlay } from '../../components/common/ProcessingOverlay';
import { mergePdfFiles } from '../../services/pdfToolsService';
import { downloadPdfBlob } from '../../services/pdfGeneratorService';
import { useToast } from '../../context/ToastContext';

interface SelectedPdfItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

export const MergePdfPage: React.FC = () => {
  const { success, error, info } = useToast();
  const [files, setFiles] = useState<SelectedPdfItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Uint8Array | null>(null);
  const [outputFilename, setOutputFilename] = useState('merged_document.pdf');

  const handleFilesAdded = (newFiles: File[]) => {
    const items: SelectedPdfItem[] = newFiles.map((file) => ({
      id: 'pdf-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      file,
      name: file.name,
      size: file.size,
    }));
    setFiles((prev) => [...prev, ...items]);
    setMergedBlob(null);
    success('Files Added', `Added ${newFiles.length} PDF file(s).`);
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setMergedBlob(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === files.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    setFiles(newFiles);
    setMergedBlob(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      info('Merge Requirement', 'Please add at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    try {
      const buffers = await Promise.all(files.map((f) => f.file.arrayBuffer()));
      const merged = await mergePdfFiles(buffers);
      setMergedBlob(merged);
      success('Merge Complete', 'Your PDF files were merged into a single document.');
    } catch (err: any) {
      console.error(err);
      error('Merge Failed', err?.message || 'Could not merge the selected PDF files.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlob) return;
    downloadPdfBlob(mergedBlob, outputFilename || 'merged_document.pdf');
    success('Downloaded', `Saved ${outputFilename}`);
  };

  const handleReset = () => {
    setFiles([]);
    setMergedBlob(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Merge PDF Online - Combine Multiple PDF Files Free"
        description="Merge and combine multiple PDF documents into one single file online for free. Reorder pages, organize documents, and download instantly without uploading to servers."
        keywords="merge PDF, combine PDF, join PDF files, merge PDF online, free PDF merger"
        canonicalPath="/merge-pdf"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Pragati Sahayak Merge PDF',
          applicationCategory: 'Utility',
          operatingSystem: 'All',
        }}
      />

      {isProcessing && (
        <ProcessingOverlay
          message="Merging PDF Documents..."
          submessage="Combining page objects and vector structures locally in your browser"
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-sm">
            <Layers className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Merge PDF Files
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Combine multiple PDF documents into a single organized file in seconds. Drag and drop to arrange the sequence.
          </p>
        </div>

        {/* Dropzone or File List */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <FileDropzone
            accept="application/pdf"
            multiple={true}
            title="Upload PDF files to merge"
            subtitle="Select two or more PDF documents. Files are processed locally."
            onFilesSelected={handleFilesAdded}
          />

          {files.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-dark-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Document Sequence ({files.length} files)
                </span>
                <button
                  onClick={handleReset}
                  className="text-xs text-rose-500 hover:text-rose-600 font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* List of files */}
              <div className="space-y-2">
                {files.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        ({Math.round(item.size / 1024)} KB)
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === files.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1 text-rose-400 hover:text-rose-600 ml-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Merge Actions */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="w-full sm:w-auto flex items-center gap-2">
                  <input
                    type="text"
                    value={outputFilename}
                    onChange={(e) => setOutputFilename(e.target.value)}
                    placeholder="merged_document.pdf"
                    className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-slate-900 dark:text-white w-full sm:w-64"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {mergedBlob ? (
                    <button
                      onClick={handleDownload}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all text-xs sm:text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Merged PDF</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleMerge}
                      disabled={files.length < 2}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-md transition-all text-xs sm:text-sm"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Merge {files.length} PDFs Now</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <PrivacyBadge />

        {/* SEO Informative Content Guide */}
        <div className="pt-8 border-t border-slate-200 dark:border-dark-border space-y-6 text-slate-700 dark:text-slate-300">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              How to Merge PDF Files Online
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Merging PDFs allows you to combine separate reports, scanned receipts, agreements, and book chapters into one unified file. Pragati Sahayak executes the entire merging process directly within your web browser using high-performance vector operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border space-y-1.5">
              <span className="font-bold text-indigo-600 text-sm">Step 1</span>
              <h4 className="font-semibold text-slate-900 dark:text-white">Upload PDFs</h4>
              <p className="text-slate-500 dark:text-slate-400">
                Drag and drop or select two or more PDF files from your device.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border space-y-1.5">
              <span className="font-bold text-indigo-600 text-sm">Step 2</span>
              <h4 className="font-semibold text-slate-900 dark:text-white">Order Pages</h4>
              <p className="text-slate-500 dark:text-slate-400">
                Use the arrow controls to organize the order of your documents.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border space-y-1.5">
              <span className="font-bold text-indigo-600 text-sm">Step 3</span>
              <h4 className="font-semibold text-slate-900 dark:text-white">Download Output</h4>
              <p className="text-slate-500 dark:text-slate-400">
                Click Merge and download your newly consolidated PDF instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
