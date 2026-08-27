import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import { WatermarkSettings, PageNumberSettings } from '../types';
import * as pdfjsLib from 'pdfjs-dist';

// Ensure worker is configured
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.mjs`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) / 255;
    const g = parseInt(clean[1] + clean[1], 16) / 255;
    const b = parseInt(clean[2] + clean[2], 16) / 255;
    return { r, g, b };
  }
  const r = parseInt(clean.substring(0, 2), 16) / 255 || 0;
  const g = parseInt(clean.substring(2, 4), 16) / 255 || 0;
  const b = parseInt(clean.substring(4, 6), 16) / 255 || 0;
  return { r, g, b };
}

/**
 * Merge multiple PDF files in given sequence
 */
export async function mergePdfFiles(pdfBuffers: ArrayBuffer[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  mergedPdf.setCreator('Pragati Sahayak PDF Generator');
  mergedPdf.setProducer('Pragati Sahayak Engine');

  for (const buffer of pdfBuffers) {
    const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Split PDF into specific page indices or ranges (1-indexed input)
 */
export async function splitPdf(
  pdfBuffer: ArrayBuffer,
  selectedPages: number[] // 1-indexed, e.g. [1, 2, 5]
): Promise<Uint8Array> {
  const srcDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();

  // Convert 1-indexed to 0-indexed and filter valid
  const zeroIndexed = selectedPages
    .map((p) => p - 1)
    .filter((p) => p >= 0 && p < srcDoc.getPageCount());

  if (zeroIndexed.length === 0) {
    throw new Error('No valid pages selected to extract or split');
  }

  const copied = await newDoc.copyPages(srcDoc, zeroIndexed);
  copied.forEach((page) => newDoc.addPage(page));

  return await newDoc.save();
}

/**
 * Split PDF into individual single-page files packed in a ZIP
 */
export async function splitPdfToZip(
  pdfBuffer: ArrayBuffer,
  baseName: string = 'page'
): Promise<Blob> {
  const srcDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();
  const zip = new JSZip();

  for (let i = 0; i < totalPages; i++) {
    const singleDoc = await PDFDocument.create();
    const [copiedPage] = await singleDoc.copyPages(srcDoc, [i]);
    singleDoc.addPage(copiedPage);
    const bytes = await singleDoc.save();
    const filename = `${baseName}_page_${i + 1}.pdf`;
    zip.file(filename, bytes);
  }

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Rotate specific pages or all pages
 */
export async function rotatePdfPages(
  pdfBuffer: ArrayBuffer,
  rotations: Record<number, number> // pageIndex (0-based) -> degree to add (e.g. 90, 180, 270)
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  pages.forEach((page, index) => {
    const addDeg = rotations[index] || 0;
    if (addDeg !== 0) {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + addDeg) % 360));
    }
  });

  return await pdfDoc.save();
}

/**
 * Reorder and optionally delete pages
 */
export async function reorderAndFilterPages(
  pdfBuffer: ArrayBuffer,
  newOrderZeroIndexed: number[] // e.g. [2, 0, 1]
): Promise<Uint8Array> {
  const srcDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();

  const validIndices = newOrderZeroIndexed.filter(
    (idx) => idx >= 0 && idx < srcDoc.getPageCount()
  );

  if (validIndices.length === 0) {
    throw new Error('Document cannot be empty. Please keep at least one page.');
  }

  const copied = await newDoc.copyPages(srcDoc, validIndices);
  copied.forEach((page) => newDoc.addPage(page));

  return await newDoc.save();
}

/**
 * Add customizable watermark
 */
export async function addWatermarkToPdf(
  pdfBuffer: ArrayBuffer,
  settings: WatermarkSettings
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const colorRgb = hexToRgb(settings.color || '#4c1d95');
  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(settings.text, settings.fontSize);
    const textHeight = settings.fontSize;

    const angle = settings.diagonal ? degrees(settings.rotation || -45) : degrees(settings.rotation || 0);

    const xPos = width / 2 - (textWidth / 2) * Math.cos((settings.rotation * Math.PI) / 180);
    const yPos = height / 2 - (textHeight / 2) * Math.sin((settings.rotation * Math.PI) / 180);

    page.drawText(settings.text, {
      x: xPos,
      y: yPos,
      size: settings.fontSize,
      font,
      color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
      opacity: settings.opacity,
      rotate: angle,
    });
  }

  return await pdfDoc.save();
}

/**
 * Add page numbers to an existing PDF
 */
export async function addPageNumbersToPdf(
  pdfBuffer: ArrayBuffer,
  settings: PageNumberSettings
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const colorRgb = hexToRgb(settings.color || '#475569');
  const pages = pdfDoc.getPages();
  const total = pages.length;

  for (let i = 0; i < total; i++) {
    if (i === 0 && !settings.includeFirstPage) {
      continue;
    }

    const page = pages[i];
    const { width, height } = page.getSize();
    const pageNum = i + settings.startFrom;

    let label = `${pageNum}`;
    if (settings.format === 'page-of-total') {
      label = `Page ${pageNum} of ${total + settings.startFrom - 1}`;
    } else if (settings.format === 'dash-number') {
      label = `— ${pageNum} —`;
    }

    const textWidth = font.widthOfTextAtSize(label, settings.fontSize);
    const marginOffset = 36;
    let x = (width - textWidth) / 2;
    let y = marginOffset;

    if (settings.position === 'top-left') {
      x = marginOffset;
      y = height - marginOffset;
    } else if (settings.position === 'top-center') {
      x = (width - textWidth) / 2;
      y = height - marginOffset;
    } else if (settings.position === 'top-right') {
      x = width - marginOffset - textWidth;
      y = height - marginOffset;
    } else if (settings.position === 'bottom-left') {
      x = marginOffset;
      y = marginOffset;
    } else if (settings.position === 'bottom-center') {
      x = (width - textWidth) / 2;
      y = marginOffset;
    } else if (settings.position === 'bottom-right') {
      x = width - marginOffset - textWidth;
      y = marginOffset;
    }

    page.drawText(label, {
      x,
      y,
      size: settings.fontSize,
      font,
      color: rgb(colorRgb.r, colorRgb.g, colorRgb.b),
    });
  }

  return await pdfDoc.save();
}

/**
 * Convert multiple image files to a single PDF
 */
export async function imagesToPdf(
  imageFiles: { dataUrl: string; type: string }[],
  options: {
    pageSize?: 'a4' | 'letter' | 'original';
    fit?: 'contain' | 'cover' | 'fill';
    margin?: number;
  } = {}
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const margin = options.margin !== undefined ? options.margin : 36;

  for (const imgItem of imageFiles) {
    const base64Data = imgItem.dataUrl.split(',')[1];
    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    let embedded;
    if (imgItem.type.includes('png')) {
      embedded = await pdfDoc.embedPng(bytes.buffer).catch(async () => {
        return await pdfDoc.embedJpg(bytes.buffer);
      });
    } else {
      embedded = await pdfDoc.embedJpg(bytes.buffer).catch(async () => {
        return await pdfDoc.embedPng(bytes.buffer);
      });
    }

    if (!embedded) continue;

    let pWidth = 595.28; // A4
    let pHeight = 841.89;

    if (options.pageSize === 'letter') {
      pWidth = 612.0;
      pHeight = 792.0;
    } else if (options.pageSize === 'original') {
      pWidth = embedded.width + margin * 2;
      pHeight = embedded.height + margin * 2;
    }

    const page = pdfDoc.addPage([pWidth, pHeight]);
    const maxContentW = pWidth - margin * 2;
    const maxContentH = pHeight - margin * 2;

    const scale = Math.min(maxContentW / embedded.width, maxContentH / embedded.height);
    const drawW = embedded.width * scale;
    const drawH = embedded.height * scale;
    const drawX = margin + (maxContentW - drawW) / 2;
    const drawY = margin + (maxContentH - drawH) / 2;

    page.drawImage(embedded, {
      x: drawX,
      y: drawY,
      width: drawW,
      height: drawH,
    });
  }

  return await pdfDoc.save();
}

/**
 * Render all or specific pages of PDF to image Data URLs and ZIP package
 */
export async function pdfToImages(
  pdfBuffer: ArrayBuffer,
  scale: number = 2.0,
  imageFormat: 'image/png' | 'image/jpeg' = 'image/png'
): Promise<{ images: string[]; zipBlob: Blob }> {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBuffer) });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const images: string[] = [];
  const zip = new JSZip();

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (context) {
      await page.render({
        canvasContext: context,
        viewport,
        canvas,
      } as any).promise;

      const dataUrl = canvas.toDataURL(imageFormat, 0.92);
      images.push(dataUrl);

      // Add to ZIP
      const base64Data = dataUrl.split(',')[1];
      const ext = imageFormat === 'image/png' ? 'png' : 'jpg';
      zip.file(`page_${i}.${ext}`, base64Data, { base64: true });
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return { images, zipBlob };
}

/**
 * Compress and optimize PDF
 */
export async function compressPdf(pdfBuffer: ArrayBuffer): Promise<{
  compressedBytes: Uint8Array;
  originalSize: number;
  newSize: number;
  reductionPercentage: number;
}> {
  const originalSize = pdfBuffer.byteLength;
  const srcDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });

  // Clean unnecessary metadata & optimize object streams
  srcDoc.setTitle(srcDoc.getTitle() || '');
  srcDoc.setProducer('Pragati Sahayak Optimizer');

  // Save with object stream compression
  const compressedBytes = await srcDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  const newSize = compressedBytes.byteLength;
  const reduction = Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100));

  return {
    compressedBytes,
    originalSize,
    newSize,
    reductionPercentage: reduction,
  };
}
