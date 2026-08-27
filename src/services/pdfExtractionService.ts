import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import { PdfDocumentState, PdfPageData, PdfChapter, CleanupSettings } from '../types/reader';
import { LanguageDetector } from './languageDetector';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export class PdfExtractionService {
  /**
   * Main entry point to extract text and structure from a PDF file
   */
  public static async processPdfFile(
    file: File,
    cleanupSettings: CleanupSettings,
    onProgress?: (status: { currentPage: number; totalPages: number; statusText: string }) => void
  ): Promise<PdfDocumentState> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;

      const pages: PdfPageData[] = [];
      let fullRawText = '';
      let isScannedPdf = false;
      let scannedPagesCount = 0;

      // Extract text page by page
      for (let i = 1; i <= totalPages; i++) {
        if (onProgress) {
          onProgress({
            currentPage: i,
            totalPages,
            statusText: `Extracting text from page ${i} of ${totalPages}...`,
          });
        }

        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        let pageRawText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .trim();

        // Check if page has no vector text (indicating image/scanned PDF)
        let isScannedPage = false;
        if (pageRawText.length < 30) {
          isScannedPage = true;
          scannedPagesCount++;
        }

        // If scanned page, run Tesseract OCR on canvas render
        if (isScannedPage) {
          if (onProgress) {
            onProgress({
              currentPage: i,
              totalPages,
              statusText: `Recognizing text from scanned page ${i} of ${totalPages} (OCR)...`,
            });
          }

          try {
            const ocrText = await this.performOcrOnPage(page);
            if (ocrText && ocrText.trim().length > 10) {
              pageRawText = ocrText;
            }
          } catch (ocrErr) {
            console.warn(`OCR failed on page ${i}:`, ocrErr);
          }
        }

        const cleanedText = this.cleanText(pageRawText, cleanupSettings);
        const sentences = this.splitIntoSentences(cleanedText);

        pages.push({
          pageNumber: i,
          rawText: pageRawText,
          cleanedText,
          sentences,
          isScannedImage: isScannedPage,
        });

        fullRawText += ` ${cleanedText}`;
      }

      if (scannedPagesCount > totalPages * 0.4) {
        isScannedPdf = true;
      }

      // Detect document language
      const langInfo = LanguageDetector.detectLanguage(fullRawText);

      // Extract Table of Contents / Chapters
      const chapters = await this.extractChapters(pdf, pages);

      return {
        file,
        fileName: file.name,
        fileSize: file.size,
        totalPages,
        pages,
        chapters,
        detectedLanguage: langInfo.name,
        detectedLangCode: langInfo.code,
        isScanned: isScannedPdf,
        ocrProgress: null,
        isLoading: false,
        error: null,
      };
    } catch (err: any) {
      console.error('PDF Processing Error:', err);
      throw new Error(`This file could not be processed. Please upload a valid PDF. (${err?.message || 'Invalid format'})`);
    }
  }

  /**
   * Perform Tesseract OCR on a PDF.js page canvas
   */
  private static async performOcrOnPage(page: pdfjsLib.PDFPageProxy): Promise<string> {
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (!ctx) return '';

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    const worker = await createWorker('eng');
    const ret = await worker.recognize(canvas);
    await worker.terminate();

    return ret.data.text || '';
  }

  /**
   * Intelligently clean extracted text
   */
  public static cleanText(text: string, settings: CleanupSettings): string {
    if (!text) return '';

    let cleaned = text;

    // Remove repeated page numbers (e.g., "Page 1", "- 12 -", "12 of 100")
    if (settings.removePageNumbers) {
      cleaned = cleaned.replace(/\bPage\s+\d+\b/gi, '');
      cleaned = cleaned.replace(/^\s*[-–—]?\s*\d+\s*[-–—]?\s*$/gm, '');
      cleaned = cleaned.replace(/\b\d+\s+of\s+\d+\b/gi, '');
    }

    // Fix hyphenated line breaks (e.g., "techno- logy" -> "technology")
    if (settings.fixHyphenation) {
      cleaned = cleaned.replace(/(\w+)-\s*\n\s*(\w+)/g, '$1$2');
    }

    // Normalize multiple spaces and linebreaks
    if (settings.normalizeSpaces) {
      cleaned = cleaned.replace(/[ \t]+/g, ' ');
      cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    }

    return cleaned.trim();
  }

  /**
   * Split paragraph text into clear readable sentences for sentence highlighting
   */
  public static splitIntoSentences(text: string): string[] {
    if (!text || !text.trim()) return [];

    // Use Intl.Segmenter if available in modern browsers
    if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
      try {
        const segmenter = new (Intl as any).Segmenter('en', { granularity: 'sentence' });
        const segments = Array.from(segmenter.segment(text));
        return segments
          .map((s: any) => s.segment.trim())
          .filter((s: string) => s.length > 0);
      } catch {
        // Fallback to regex
      }
    }

    // Regex fallback for sentence splitting
    return text
      .split(/(?<=[.?!;])\s+|\n\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  /**
   * Extract outline / Table of Contents / Heading Chapters
   */
  private static async extractChapters(pdf: pdfjsLib.PDFDocumentProxy, pages: PdfPageData[]): Promise<PdfChapter[]> {
    const chapters: PdfChapter[] = [];

    try {
      const outline = await pdf.getOutline();
      if (outline && outline.length > 0) {
        for (let i = 0; i < outline.length; i++) {
          const item = outline[i];
          let pageNum = 1;
          if (item.dest) {
            let dest: any = item.dest;
            if (typeof dest === 'string') {
              dest = await pdf.getDestination(dest);
            }
            if (dest && Array.isArray(dest) && dest[0]) {
              const ref = dest[0];
              const pageIndex = await pdf.getPageIndex(ref);
              pageNum = pageIndex + 1;
            }
          }
          chapters.push({
            id: `toc-${i}`,
            title: item.title,
            pageNumber: pageNum,
            level: 1,
          });
        }
      }
    } catch {
      // Outline not present
    }

    // Heuristic chapter detection if outline is empty
    if (chapters.length === 0) {
      pages.forEach((p) => {
        const lines = p.cleanedText.split('\n');
        lines.forEach((line) => {
          const trimmed = line.trim();
          if (
            /^chapter\s+\d+/i.test(trimmed) ||
            /^section\s+\d+/i.test(trimmed) ||
            /^\d+\.\s+[A-Z]/.test(trimmed)
          ) {
            chapters.push({
              id: `heur-${p.pageNumber}-${chapters.length}`,
              title: trimmed.substring(0, 60),
              pageNumber: p.pageNumber,
              level: 1,
            });
          }
        });
      });
    }

    // Fallback default page landmarks if no chapters found
    if (chapters.length === 0) {
      const step = Math.max(1, Math.floor(pages.length / 5));
      for (let p = 1; p <= pages.length; p += step) {
        chapters.push({
          id: `page-mark-${p}`,
          title: `Page ${p}`,
          pageNumber: p,
          level: 1,
        });
      }
    }

    return chapters;
  }
}
