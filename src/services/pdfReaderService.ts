import * as pdfjsLib from 'pdfjs-dist';

// Worker setup
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.mjs`;
}

export interface PdfDocumentMeta {
  title: string;
  author: string;
  subject: string;
  creator: string;
  numPages: number;
  outline: { title: string; dest: any }[];
}

export interface PdfPageContent {
  pageNumber: number;
  text: string;
  paragraphs: string[];
}

export class PdfReaderService {
  private pdfDoc: pdfjsLib.PDFDocumentProxy | null = null;
  private pagesTextCache: Map<number, PdfPageContent> = new Map();

  async loadDocument(data: ArrayBuffer | Uint8Array | string): Promise<PdfDocumentMeta> {
    this.pagesTextCache.clear();
    const initParam = typeof data === 'string' ? { url: data } : { data: new Uint8Array(data) as any };
    const loadingTask = pdfjsLib.getDocument(initParam as any);
    this.pdfDoc = await loadingTask.promise;

    let title = 'Untitled Document';
    let author = 'Unknown';
    let subject = '';
    let creator = '';

    try {
      const meta = await this.pdfDoc.getMetadata();
      const info = meta.info as any;
      if (info) {
        title = info.Title || info.title || 'Untitled Document';
        author = info.Author || info.author || 'Unknown';
        subject = info.Subject || info.subject || '';
        creator = info.Creator || info.creator || '';
      }
    } catch (e) {
      console.warn('Could not read PDF metadata:', e);
    }

    let outline: any[] = [];
    try {
      outline = (await this.pdfDoc.getOutline()) || [];
    } catch {
      outline = [];
    }

    return {
      title,
      author,
      subject,
      creator,
      numPages: this.pdfDoc.numPages,
      outline,
    };
  }

  getNumPages(): number {
    return this.pdfDoc ? this.pdfDoc.numPages : 0;
  }

  async renderPageToCanvas(
    pageNumber: number,
    canvas: HTMLCanvasElement,
    scale: number = 1.5,
    rotation: number = 0
  ): Promise<void> {
    if (!this.pdfDoc) throw new Error('PDF document not loaded');
    if (pageNumber < 1 || pageNumber > this.pdfDoc.numPages) {
      throw new Error(`Invalid page number: ${pageNumber}`);
    }

    const page = await this.pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale, rotation });

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get canvas context');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport,
      canvas,
    } as any).promise;
  }

  async generateThumbnail(pageNumber: number, maxDim: number = 180): Promise<string> {
    if (!this.pdfDoc) return '';
    try {
      const page = await this.pdfDoc.getPage(pageNumber);
      const unscaledViewport = page.getViewport({ scale: 1.0 });
      const scale = maxDim / Math.max(unscaledViewport.width, unscaledViewport.height);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext('2d');

      if (context) {
        await page.render({
          canvasContext: context,
          viewport,
          canvas,
        } as any).promise;
        return canvas.toDataURL('image/jpeg', 0.8);
      }
    } catch (e) {
      console.error('Error generating thumbnail:', e);
    }
    return '';
  }

  async extractPageText(pageNumber: number): Promise<PdfPageContent> {
    if (this.pagesTextCache.has(pageNumber)) {
      return this.pagesTextCache.get(pageNumber)!;
    }

    if (!this.pdfDoc) throw new Error('PDF document not loaded');
    const page = await this.pdfDoc.getPage(pageNumber);
    const textContent = await page.getTextContent();

    let fullText = '';
    let currentLine = '';

    for (let i = 0; i < textContent.items.length; i++) {
      const item = textContent.items[i] as any;
      if ('str' in item) {
        if (item.hasEOL) {
          currentLine += item.str;
          fullText += currentLine + '\n';
          currentLine = '';
        } else {
          currentLine += item.str + ' ';
        }
      }
    }
    if (currentLine.trim()) {
      fullText += currentLine;
    }

    // Break into natural paragraphs
    const paragraphs = fullText
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\s+/g, ' ').trim())
      .filter((p) => p.length > 0);

    const result: PdfPageContent = {
      pageNumber,
      text: fullText.trim(),
      paragraphs: paragraphs.length > 0 ? paragraphs : [fullText.trim()],
    };

    this.pagesTextCache.set(pageNumber, result);
    return result;
  }

  async searchDocument(query: string): Promise<{ pageNumber: number; matchCount: number; snippets: string[] }[]> {
    if (!this.pdfDoc || !query.trim()) return [];
    const results: { pageNumber: number; matchCount: number; snippets: string[] }[] = [];
    const lowerQuery = query.toLowerCase().trim();

    for (let i = 1; i <= this.pdfDoc.numPages; i++) {
      const { text } = await this.extractPageText(i);
      const lowerText = text.toLowerCase();
      let index = 0;
      let count = 0;
      const snippets: string[] = [];

      while ((index = lowerText.indexOf(lowerQuery, index)) !== -1) {
        count++;
        const start = Math.max(0, index - 40);
        const end = Math.min(text.length, index + lowerQuery.length + 40);
        snippets.push('...' + text.substring(start, end).replace(/\n/g, ' ') + '...');
        index += lowerQuery.length;
        if (snippets.length >= 3) break;
      }

      if (count > 0) {
        results.push({ pageNumber: i, matchCount: count, snippets });
      }
    }

    return results;
  }

  destroy() {
    if (this.pdfDoc) {
      if (typeof (this.pdfDoc as any).cleanup === 'function') {
        (this.pdfDoc as any).cleanup();
      }
      if (typeof (this.pdfDoc as any).destroy === 'function') {
        (this.pdfDoc as any).destroy();
      }
      this.pdfDoc = null;
    }
    this.pagesTextCache.clear();
  }
}
