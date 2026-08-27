import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Download 
} from 'lucide-react';
import { SeoHead } from '../../components/layout/SeoHead';
import { FileDropzone } from '../../components/common/FileDropzone';
import { PrivacyBadge } from '../../components/common/PrivacyBadge';
import { ProcessingOverlay } from '../../components/common/ProcessingOverlay';
import { imagesToPdf } from '../../services/pdfToolsService';
import { downloadPdfBlob } from '../../services/pdfGeneratorService';
import { useToast } from '../../context/ToastContext';

interface SelectedImageItem {
  id: string;
  file: File;
  name: string;
  dataUrl: string;
}

export const ImageToPdfPage: React.FC = () => {
  const { success, error } = useToast();
  const [images, setImages] = useState<SelectedImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'original'>('a4');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdfBytes, setResultPdfBytes] = useState<Uint8Array | null>(null);

  const handleFilesSelected = (files: File[]) => {
    const loadedItems: SelectedImageItem[] = [];
    let count = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        loadedItems.push({
          id: 'img-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
          file,
          name: file.name,
          dataUrl,
        });
        count++;
        if (count === files.length) {
          setImages((prev) => [...prev, ...loadedItems]);
          setResultPdfBytes(null);
          success('Images Loaded', `Added ${loadedItems.length} images.`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === images.length - 1) return;

    const target = direction === 'left' ? index - 1 : index + 1;
    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setImages(updated);
    setResultPdfBytes(null);
  };

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setResultPdfBytes(null);
  };

  const handleConvert = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    try {
      const payload = images.map((img) => ({
        dataUrl: img.dataUrl,
        type: img.file.type,
      }));

      const bytes = await imagesToPdf(payload, {
        pageSize,
        margin: 36,
      });

      setResultPdfBytes(bytes);
      success('Conversion Complete', `Created multi-page PDF with ${images.length} images.`);
    } catch (err: any) {
      error('Conversion Error', err?.message || 'Failed to convert images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultPdfBytes) return;
    downloadPdfBlob(resultPdfBytes, 'converted_images.pdf');
    success('Downloaded', 'Saved converted_images.pdf');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Image to PDF Converter Online - JPG & PNG to PDF Free"
        description="Convert JPG, PNG, and WebP images to high-quality PDF documents online. Combine multiple photos into a single PDF with total privacy."
        keywords="image to PDF, JPG to PDF, PNG to PDF, convert photo to PDF, photo PDF maker"
        canonicalPath="/image-to-pdf"
      />

      {isProcessing && (
        <ProcessingOverlay
          message="Converting Images to Vector PDF..."
          submessage="Embedding image rasters and compiling pages locally in browser memory"
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center shadow-sm">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Image to PDF Converter
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Convert JPG, PNG, and WebP photos into a clean multi-page PDF document.
          </p>
        </div>

        {/* Dropzone or Gallery */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <FileDropzone
            accept="image/png,image/jpeg,image/webp"
            multiple={true}
            title="Upload images to convert"
            subtitle="Choose one or more JPG, PNG, or WebP images."
            onFilesSelected={handleFilesSelected}
          />

          {images.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-dark-border">
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Page Layout:
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as any)}
                    className="text-xs p-1.5 rounded-lg border border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface text-slate-900 dark:text-white"
                  >
                    <option value="a4">Standard A4 (Fit to Page)</option>
                    <option value="letter">US Letter (Fit to Page)</option>
                    <option value="original">Original Image Dimensions</option>
                  </select>
                </div>

                <div className="text-xs text-slate-500">
                  {images.length} Image{images.length > 1 ? 's' : ''} Selected
                </div>
              </div>

              {/* Visual image sequence grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-2 bg-slate-50 dark:bg-dark-surface rounded-xl border border-slate-200 dark:border-dark-border">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="p-1.5 bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border shadow-xs flex flex-col items-center gap-1.5"
                  >
                    <div className="w-full aspect-[1/1] bg-slate-100 dark:bg-slate-800 rounded overflow-hidden flex items-center justify-center p-1 relative">
                      <img
                        src={img.dataUrl}
                        alt={img.name}
                        className="max-w-full max-h-full object-contain"
                      />
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-slate-900/80 text-white font-mono text-[9px]">
                        Page {idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center justify-between w-full text-xs">
                      <span className="text-[10px] text-slate-500 truncate max-w-[50px]">
                        {img.name}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => handleMove(idx, 'left')}
                          disabled={idx === 0}
                          className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMove(idx, 'right')}
                          disabled={idx === images.length - 1}
                          className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemove(img.id)}
                          className="p-0.5 text-rose-500 hover:text-rose-700 ml-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-dark-border flex flex-col sm:flex-row items-center justify-end gap-3">
                {resultPdfBytes ? (
                  <button
                    onClick={handleDownload}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all text-xs sm:text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Converted PDF</span>
                  </button>
                ) : (
                  <button
                    onClick={handleConvert}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all text-xs sm:text-sm"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Convert {images.length} Images to PDF</span>
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
