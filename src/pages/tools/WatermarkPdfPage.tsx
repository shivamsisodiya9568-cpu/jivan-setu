import React, { useState } from 'react';
import { 
  Stamp, 
  FileText, 
  Download 
} from 'lucide-react';
import { SeoHead } from '../../components/layout/SeoHead';
import { FileDropzone } from '../../components/common/FileDropzone';
import { PrivacyBadge } from '../../components/common/PrivacyBadge';
import { ProcessingOverlay } from '../../components/common/ProcessingOverlay';
import { addWatermarkToPdf } from '../../services/pdfToolsService';
import { downloadPdfBlob } from '../../services/pdfGeneratorService';
import { WatermarkSettings } from '../../types';
import { useToast } from '../../context/ToastContext';

export const WatermarkPdfPage: React.FC = () => {
  const { success, error } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultPdfBytes, setResultPdfBytes] = useState<Uint8Array | null>(null);

  const [settings, setSettings] = useState<WatermarkSettings>({
    text: 'CONFIDENTIAL',
    fontSize: 48,
    opacity: 0.25,
    rotation: -45,
    color: '#4f46e5',
    layer: 'over',
    diagonal: true,
  });

  const handleFileSelected = (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    setResultPdfBytes(null);
    success('File Uploaded', `${files[0].name}`);
  };

  const handleApplyWatermark = async () => {
    if (!file) return;
    if (!settings.text.trim()) {
      error('Empty Watermark', 'Please enter a watermark text.');
      return;
    }

    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = await addWatermarkToPdf(buffer, settings);
      setResultPdfBytes(bytes);
      success('Watermark Applied', 'Watermark added across all document pages.');
    } catch (err: any) {
      error('Watermark Error', err?.message || 'Failed to apply watermark.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultPdfBytes || !file) return;
    const outName = `${file.name.replace('.pdf', '')}_watermarked.pdf`;
    downloadPdfBlob(resultPdfBytes, outName);
    success('Downloaded', `Saved ${outName}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Add Watermark to PDF Online - Free PDF Watermarker"
        description="Add customizable text watermarks to your PDF documents online. Choose opacity, rotation, font size, and color with total browser privacy."
        keywords="add watermark to PDF, PDF watermarker, watermark PDF online, stamp PDF, draft watermark PDF"
        canonicalPath="/add-watermark"
      />

      {isProcessing && (
        <ProcessingOverlay
          message="Applying Watermark..."
          submessage="Drawing vector text overlay across all PDF pages in browser memory"
        />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-sm">
            <Stamp className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Add Watermark to PDF
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Apply customizable text watermarks across all document pages. Control opacity, rotation, and color.
          </p>
        </div>

        {/* Dropzone or Settings Workspace */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {!file ? (
            <FileDropzone
              accept="application/pdf"
              title="Upload PDF to watermark"
              subtitle="Select any PDF document. Watermarking is processed locally."
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

              {/* Watermark Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border">
                {/* Text Input */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={settings.text}
                    onChange={(e) => setSettings({ ...settings, text: e.target.value })}
                    placeholder="e.g. CONFIDENTIAL, DRAFT, SAMPLE"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-900 dark:text-white font-semibold"
                  />
                  <div className="flex gap-2 pt-1">
                    {['CONFIDENTIAL', 'DRAFT', 'SAMPLE', 'COPY'].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setSettings({ ...settings, text: preset })}
                        className="px-2 py-0.5 text-[10px] rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opacity Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Opacity</span>
                    <span className="font-mono">{Math.round(settings.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.9"
                    step="0.05"
                    value={settings.opacity}
                    onChange={(e) => setSettings({ ...settings, opacity: parseFloat(e.target.value) })}
                    className="w-full cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Font Size */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Font Size</span>
                    <span className="font-mono">{settings.fontSize} pt</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    step="2"
                    value={settings.fontSize}
                    onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value, 10) })}
                    className="w-full cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Rotation Angle */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>Rotation Angle</span>
                    <span className="font-mono">{settings.rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    step="5"
                    value={settings.rotation}
                    onChange={(e) => setSettings({ ...settings, rotation: parseInt(e.target.value, 10) })}
                    className="w-full cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Color Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Color
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {[
                      { name: 'Indigo', hex: '#4f46e5' },
                      { name: 'Red', hex: '#dc2626' },
                      { name: 'Slate', hex: '#475569' },
                      { name: 'Amber', hex: '#d97706' },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setSettings({ ...settings, color: c.hex })}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          settings.color === c.hex ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
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
                    <span>Download Watermarked PDF</span>
                  </button>
                ) : (
                  <button
                    onClick={handleApplyWatermark}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all text-xs sm:text-sm"
                  >
                    <Stamp className="w-4 h-4" />
                    <span>Apply Watermark to All Pages</span>
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
