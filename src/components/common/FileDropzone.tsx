import React, { useState, useRef } from 'react';
import { Upload, FileUp, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxSizeBytes?: number;
  title?: string;
  subtitle?: string;
  onFilesSelected: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  accept = 'application/pdf',
  multiple = false,
  maxSizeBytes = 100 * 1024 * 1024, // 100MB default
  title = 'Drop your document here, or browse',
  subtitle = 'Supports PDF documents up to 100MB. Processed locally.',
  onFilesSelected,
  className = '',
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndForward = (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    setErrorMessage(null);

    const validFiles: File[] = [];
    const acceptedTypes = accept.split(',').map((t) => t.trim().toLowerCase());

    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];

      // Size check
      if (file.size > maxSizeBytes) {
        setErrorMessage(`File "${file.name}" exceeds the maximum allowed size (${Math.round(maxSizeBytes / (1024 * 1024))}MB).`);
        return;
      }

      // Type check if specified
      if (accept && accept !== '*/*') {
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        const matchesType = acceptedTypes.some((t) => {
          if (t.startsWith('.')) return ext === t;
          if (t.endsWith('/*')) return file.type.startsWith(t.replace('/*', ''));
          return file.type === t;
        });

        if (!matchesType) {
          setErrorMessage(`File type for "${file.name}" is not supported. Please select valid files (${accept}).`);
          return;
        }
      }

      validFiles.push(file);
      if (!multiple) break;
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    validateAndForward(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndForward(e.target.files);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/30 scale-[1.01]'
            : 'border-slate-300 dark:border-dark-border bg-white dark:bg-dark-surface hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50/50 dark:hover:bg-dark-hover/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        role="button"
        tabIndex={0}
        aria-label={title}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            !disabled && inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
            <Upload className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {subtitle}
            </p>
          </div>

          <div className="pt-2">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/40 hover:bg-indigo-100 transition-colors">
              <FileUp className="w-4 h-4" />
              Choose File{multiple ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
