import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  FileText, 
  Download, 
  Archive 
} from 'lucide-react';
import { SeoHead } from '../../components/layout/SeoHead';
import { FileDropzone } from '../../components/common/FileDropzone';
import { PrivacyBadge } from '../../components/common/PrivacyBadge';
import { ProcessingOverlay } from '../../components/common/ProcessingOverlay';
import { pdfToImages } from '../../services/pdfToolsService';
import { useToast } from '../../context/ToastContext';

export const PdfToImagePage: React.FC = () => {
  const { success, error } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'image/png' | 'image/jpeg'>('image/png');
  const [scale, setScale] = useState<number>(2.0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [renderedImages, setRenderedImages] = useState<string[]>([]);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  const handleFileSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setRenderedImages([]);
    setZipBlob(null);
    setIsProcessing(true);

    try {
      const buffer = await selected.arrayBuffer();
      const result = await pdfToImages(buffer, scale, format);
      setRenderedImages(result.images);
      setZipBlob(result.zipBlob);
      success('Conversion Complete', `Rendered ${result.images.length} high-DPI page images.`);
    } catch (err: any) {
      error('Render Error', err?.message || 'Failed to convert PDF to images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSingle = (dataUrl: string, pageNum: number) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    const ext = format === 'image/png' ? 'png' : 'jpg';
    link.download = `${file?.name.replace('.pdf', '')}_page_${pageNum}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadZip = () => {
    if (!zipBlob || !file) return;
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file.name.replace('.pdf', '')}_images.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    success('ZIP Downloaded', 'Exported all pages in ZIP.');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="PDF to Image Converter Online - Convert PDF to PNG & JPG Free"
        description="Convert PDF pages to high-resolution PNG and JPG images online for free. Download individual images or batch download all pages as a ZIP archive."
        keywords="PDF to image, PDF to PNG, PDF to JPG, extract images from PDF, free PDF to image converter"
        canonicalPath="/pdf-to-image"
      />

      {isProcessing && (
        <ProcessingOverlay
          message="Rendering High-Resolution Canvas Images..."
          submessage="Rasterizing vector page layers and packaging images locally in browser memory"
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-950/70 text-fuchsia-600 dark:text-fuchsia-400 mx-auto flex items-center justify-center shadow-sm">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            PDF to Image Converter
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Render crisp, high-DPI images for every page in your PDF document. Download individually or as a ZIP.
          </p>
        </div>

        {/* Dropzone or Gallery */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {!file ? (
            <FileDropzone
              accept="application/pdf"
              title="Upload PDF to convert to images"
              subtitle="Select any PDF document. Rendering executes completely on your device."
              onFilesSelected={handleFileSelected}
            />
          ) : (
            <div className="space-y-6">
              {/* Document bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-fuchsia-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">
                      {file.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {renderedImages.length} Pages Rendered • {Math.round(file.size / 1024)} KB
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500">Format:</span>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value as any)}
                      className="text-xs p-1 rounded-lg border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface text-slate-800 dark:text-slate-200"
                    >
                      <option value="image/png">PNG</option>
                      <option value="image/jpeg">JPG</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500">DPI:</span>
                    <select
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="text-xs p-1 rounded-lg border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface text-slate-800 dark:text-slate-200"
                    >
                      <option value="1.5">Standard (1.5x)</option>
                      <option value="2.0">High-DPI (2.0x)</option>
                      <option value="3.0">Ultra (3.0x)</option>
                    </select>
                  </div>

                  {zipBlob && (
                    <button
                      onClick={handleDownloadZip}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                    >
                      <Archive className="w-4 h-4" />
                      <span>Download ZIP</span>
                    </button>
                  )}
                  <button
                    onClick={() => setFile(null)}
                    className="text-xs text-slate-500 hover:text-fuchsia-600 font-medium px-2 py-1"
                  >
                    Convert Another
                  </button>
                </div>
              </div>

              {/* Rendered Images Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[550px] overflow-y-auto p-3 bg-slate-50 dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border">
                {renderedImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-xs flex flex-col items-center gap-2 group"
                  >
                    <div className="relative w-full aspect-[1/1.3] bg-white rounded overflow-hidden flex items-center justify-center p-1 border border-slate-100 dark:border-slate-800">
                      <img
                        src={imgUrl}
                        alt={`Page ${idx + 1}`}
                        className="max-w-full max-h-full object-contain"
                      />
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-slate-900/80 text-white font-mono text-[9px]">
                        Page {idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center justify-between w-full pt-1 border-t border-slate-100 dark:border-dark-border">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Page {idx + 1}
                      </span>
                      <button
                        onClick={() => handleDownloadSingle(imgUrl, idx + 1)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save Image</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <PrivacyBadge />
      </div>
    </div>
  );
};
