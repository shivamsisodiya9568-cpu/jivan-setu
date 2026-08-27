import React, { useState } from 'react';
import { 
  Minimize2, 
  FileText, 
  Download 
} from 'lucide-react';
import { SeoHead } from '../../components/layout/SeoHead';
import { FileDropzone } from '../../components/common/FileDropzone';
import { PrivacyBadge } from '../../components/common/PrivacyBadge';
import { ProcessingOverlay } from '../../components/common/ProcessingOverlay';
import { compressPdf } from '../../services/pdfToolsService';
import { downloadPdfBlob } from '../../services/pdfGeneratorService';
import { useToast } from '../../context/ToastContext';

export const CompressPdfPage: React.FC = () => {
  const { success, error } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<{
    compressedBytes: Uint8Array;
    originalSize: number;
    newSize: number;
    reductionPercentage: number;
  } | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setIsProcessing(true);
    setCompressionResult(null);

    try {
      const buffer = await selected.arrayBuffer();
      const result = await compressPdf(buffer);
      setCompressionResult(result);
      success('Compression Complete', `Optimized document (${result.reductionPercentage}% size change).`);
    } catch (err: any) {
      error('Compression Error', err?.message || 'Could not compress the selected PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressionResult || !file) return;
    const outName = `${file.name.replace('.pdf', '')}_compressed.pdf`;
    downloadPdfBlob(compressionResult.compressedBytes, outName);
    success('Downloaded', `Saved ${outName}`);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Compress PDF Online - Reduce PDF File Size Free"
        description="Compress and optimize PDF documents online without quality loss. Reduce PDF file size with fast in-browser vector stream optimization."
        keywords="compress PDF, reduce PDF size, PDF optimizer, shrink PDF, free PDF compressor"
        canonicalPath="/compress-pdf"
      />

      {isProcessing && (
        <ProcessingOverlay
          message="Optimizing PDF Object Streams..."
          submessage="Re-encoding font subsets and stripping redundant structures safely in browser"
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 mx-auto flex items-center justify-center shadow-sm">
            <Minimize2 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Compress & Optimize PDF
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Reduce PDF file size by restructuring internal object streams, removing duplicate metadata, and optimizing vector trees.
          </p>
        </div>

        {/* Dropzone or Result */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {!file ? (
            <FileDropzone
              accept="application/pdf"
              title="Upload PDF to compress"
              subtitle="Select any PDF document. Compression executes entirely on your device."
              onFilesSelected={handleFileSelected}
            />
          ) : (
            <div className="space-y-6">
              {/* Document bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-violet-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">
                      {file.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Original Size: {formatBytes(file.size)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setCompressionResult(null);
                  }}
                  className="text-xs text-slate-500 hover:text-violet-600 font-medium"
                >
                  Compress Another File
                </button>
              </div>

              {/* Compression Metrics Cards */}
              {compressionResult && (
                <div className="space-y-6 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-center space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Original Size</span>
                      <div className="text-xl font-bold text-slate-700 dark:text-slate-300">
                        {formatBytes(compressionResult.originalSize)}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Optimized Size</span>
                      <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                        {formatBytes(compressionResult.newSize)}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 text-center space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Savings</span>
                      <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                        {compressionResult.reductionPercentage > 0 ? `-${compressionResult.reductionPercentage}%` : 'Already Optimized'}
                      </div>
                    </div>
                  </div>

                  {/* Download Button */}
                  <div className="text-center pt-2">
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/20 transition-all text-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Compressed PDF</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <PrivacyBadge />
      </div>
    </div>
  );
};
