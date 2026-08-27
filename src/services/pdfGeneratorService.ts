import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont, grayscale } from 'pdf-lib';
import { DocumentSettings, DocumentSection, PageSize, PageOrientation } from '../types';

// Standard dimensions in points (72 points = 1 inch)
export const PAGE_SIZES: Record<PageSize, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612.0, 792.0],
  a5: [419.53, 595.28],
  legal: [612.0, 1008.0],
};

export const MARGIN_PRESETS: Record<string, { top: number; right: number; bottom: number; left: number }> = {
  normal: { top: 54, right: 54, bottom: 54, left: 54 },     // 0.75 in
  compact: { top: 36, right: 36, bottom: 36, left: 36 },   // 0.5 in
  wide: { top: 72, right: 72, bottom: 72, left: 72 },       // 1.0 in
  none: { top: 18, right: 18, bottom: 18, left: 18 },       // 0.25 in
};

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

export function getPageDimensions(size: PageSize, orientation: PageOrientation): [number, number] {
  const [baseW, baseH] = PAGE_SIZES[size] || PAGE_SIZES.a4;
  if (orientation === 'landscape') {
    return [baseH, baseW];
  }
  return [baseW, baseH];
}

// Split text into wrapped lines fitting maxWidth
function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      lines.push('');
      continue;
    }
    const words = para.split(/\s+/);
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        // If single word is longer than maxWidth
        if (font.widthOfTextAtSize(word, fontSize) > maxWidth) {
          let chunk = '';
          for (const char of word) {
            if (font.widthOfTextAtSize(chunk + char, fontSize) <= maxWidth) {
              chunk += char;
            } else {
              lines.push(chunk);
              chunk = char;
            }
          }
          currentLine = chunk;
        } else {
          currentLine = word;
        }
      }
    }
    if (currentLine) lines.push(currentLine);
  }
  return lines;
}

export async function generatePdfDocument(
  settings: DocumentSettings,
  sections: DocumentSection[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // Set document metadata
  pdfDoc.setTitle(settings.title || 'Untitled Document');
  pdfDoc.setAuthor(settings.author || 'Pragati Sahayak PDF Generator');
  pdfDoc.setSubject(settings.subject || 'Generated with Pragati Sahayak');
  pdfDoc.setCreator('Pragati Sahayak PDF Generator (https://pragatisahayak.com)');
  pdfDoc.setProducer('Pragati Sahayak Engine');

  // Embed standard font family
  let regularFont: PDFFont;
  let boldFont: PDFFont;
  let italicFont: PDFFont;
  let monoFont: PDFFont;

  try {
    if (settings.fontFamily === 'TimesRoman' || settings.fontFamily === 'Merriweather') {
      regularFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      italicFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
    } else if (settings.fontFamily === 'Courier' || settings.fontFamily === 'JetBrainsMono') {
      regularFont = await pdfDoc.embedFont(StandardFonts.Courier);
      boldFont = await pdfDoc.embedFont(StandardFonts.CourierBold);
      italicFont = await pdfDoc.embedFont(StandardFonts.CourierOblique);
    } else {
      regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    }
    monoFont = await pdfDoc.embedFont(StandardFonts.Courier);
  } catch {
    regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    monoFont = await pdfDoc.embedFont(StandardFonts.Courier);
  }

  const [pageWidth, pageHeight] = getPageDimensions(settings.pageSize, settings.orientation);
  const margins = settings.margins || MARGIN_PRESETS[settings.marginPreset] || MARGIN_PRESETS.normal;
  const contentWidth = pageWidth - margins.left - margins.right;
  const contentHeight = pageHeight - margins.top - margins.bottom;

  // Pages tracking
  const pages: PDFPage[] = [];
  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  pages.push(currentPage);

  let currentY = pageHeight - margins.top;

  const drawPageBackground = (page: PDFPage) => {
    if (settings.theme === 'warm') {
      page.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        color: rgb(0.984, 0.976, 0.957), // #fbf9f4
      });
    } else if (settings.theme === 'cream') {
      page.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        color: rgb(0.992, 0.965, 0.886), // #fdf6e2
      });
    } else if (settings.theme === 'dark') {
      page.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        color: rgb(0.06, 0.08, 0.12),
      });
    } else if (settings.theme === 'border') {
      page.drawRectangle({
        x: margins.left - 12,
        y: margins.bottom - 12,
        width: contentWidth + 24,
        height: contentHeight + 24,
        borderColor: rgb(0.8, 0.85, 0.9),
        borderWidth: 1,
      });
    }
  };

  drawPageBackground(currentPage);

  const checkNewPage = (neededHeight: number) => {
    if (currentY - neededHeight < margins.bottom) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      pages.push(currentPage);
      drawPageBackground(currentPage);
      currentY = pageHeight - margins.top;
      return true;
    }
    return false;
  };

  const getTextColor = (customColor?: string) => {
    if (customColor) {
      const c = hexToRgb(customColor);
      return rgb(c.r, c.g, c.b);
    }
    if (settings.theme === 'dark') {
      return rgb(0.92, 0.95, 0.98);
    }
    return rgb(0.12, 0.14, 0.18);
  };

  // Flow all sections into PDF
  for (const section of sections) {
    if (section.type === 'page_break') {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      pages.push(currentPage);
      drawPageBackground(currentPage);
      currentY = pageHeight - margins.top;
      continue;
    }

    if (section.type === 'divider') {
      checkNewPage(24);
      currentY -= 12;
      currentPage.drawLine({
        start: { x: margins.left, y: currentY },
        end: { x: pageWidth - margins.right, y: currentY },
        thickness: 1,
        color: rgb(0.85, 0.88, 0.92),
      });
      currentY -= 16;
      continue;
    }

    if (section.type === 'heading1') {
      const fontSize = section.fontSize || 24;
      const lineHeight = fontSize * 1.3;
      const lines = wrapText(section.content || '', boldFont, fontSize, contentWidth);
      const totalHeight = lines.length * lineHeight + 18;
      checkNewPage(totalHeight);

      currentY -= 8;
      for (const line of lines) {
        let drawX = margins.left;
        const textWidth = boldFont.widthOfTextAtSize(line, fontSize);
        if (section.align === 'center') {
          drawX = margins.left + (contentWidth - textWidth) / 2;
        } else if (section.align === 'right') {
          drawX = pageWidth - margins.right - textWidth;
        }

        currentPage.drawText(line, {
          x: drawX,
          y: currentY - fontSize,
          size: fontSize,
          font: boldFont,
          color: getTextColor(section.color),
        });
        currentY -= lineHeight;
      }
      currentY -= 10;
      continue;
    }

    if (section.type === 'heading2') {
      const fontSize = section.fontSize || 18;
      const lineHeight = fontSize * 1.3;
      const lines = wrapText(section.content || '', boldFont, fontSize, contentWidth);
      const totalHeight = lines.length * lineHeight + 14;
      checkNewPage(totalHeight);

      currentY -= 6;
      for (const line of lines) {
        let drawX = margins.left;
        const textWidth = boldFont.widthOfTextAtSize(line, fontSize);
        if (section.align === 'center') {
          drawX = margins.left + (contentWidth - textWidth) / 2;
        } else if (section.align === 'right') {
          drawX = pageWidth - margins.right - textWidth;
        }

        currentPage.drawText(line, {
          x: drawX,
          y: currentY - fontSize,
          size: fontSize,
          font: boldFont,
          color: getTextColor(section.color),
        });
        currentY -= lineHeight;
      }
      currentY -= 8;
      continue;
    }

    if (section.type === 'heading3') {
      const fontSize = section.fontSize || 14;
      const lineHeight = fontSize * 1.3;
      const lines = wrapText(section.content || '', boldFont, fontSize, contentWidth);
      const totalHeight = lines.length * lineHeight + 10;
      checkNewPage(totalHeight);

      currentY -= 4;
      for (const line of lines) {
        let drawX = margins.left;
        const textWidth = boldFont.widthOfTextAtSize(line, fontSize);
        if (section.align === 'center') {
          drawX = margins.left + (contentWidth - textWidth) / 2;
        } else if (section.align === 'right') {
          drawX = pageWidth - margins.right - textWidth;
        }

        currentPage.drawText(line, {
          x: drawX,
          y: currentY - fontSize,
          size: fontSize,
          font: boldFont,
          color: getTextColor(section.color),
        });
        currentY -= lineHeight;
      }
      currentY -= 6;
      continue;
    }

    if (section.type === 'paragraph') {
      const fontSize = section.fontSize || settings.baseFontSize || 11;
      const font = section.bold ? boldFont : section.italic ? italicFont : regularFont;
      const lineHeight = fontSize * (settings.lineHeight || 1.45);
      const lines = wrapText(section.content || '', font, fontSize, contentWidth);

      for (const line of lines) {
        checkNewPage(lineHeight);
        if (!line) {
          currentY -= lineHeight * 0.6;
          continue;
        }
        let drawX = margins.left;
        const textWidth = font.widthOfTextAtSize(line, fontSize);
        if (section.align === 'center') {
          drawX = margins.left + (contentWidth - textWidth) / 2;
        } else if (section.align === 'right') {
          drawX = pageWidth - margins.right - textWidth;
        }

        currentPage.drawText(line, {
          x: drawX,
          y: currentY - fontSize,
          size: fontSize,
          font,
          color: getTextColor(section.color),
        });
        currentY -= lineHeight;
      }
      currentY -= 6;
      continue;
    }

    if (section.type === 'bullet_list' || section.type === 'numbered_list') {
      const items = section.items && section.items.length > 0 ? section.items : (section.content || '').split('\n').filter(Boolean);
      const fontSize = section.fontSize || settings.baseFontSize || 11;
      const font = regularFont;
      const lineHeight = fontSize * 1.4;
      const indent = 18;

      for (let i = 0; i < items.length; i++) {
        const itemText = items[i];
        const bulletLabel = section.type === 'bullet_list' ? '•' : `${i + 1}.`;
        const lines = wrapText(itemText, font, fontSize, contentWidth - indent);

        for (let j = 0; j < lines.length; j++) {
          checkNewPage(lineHeight);
          const line = lines[j];
          if (j === 0) {
            currentPage.drawText(bulletLabel, {
              x: margins.left + 4,
              y: currentY - fontSize,
              size: fontSize,
              font: boldFont,
              color: getTextColor(section.color),
            });
          }
          currentPage.drawText(line, {
            x: margins.left + indent,
            y: currentY - fontSize,
            size: fontSize,
            font,
            color: getTextColor(section.color),
          });
          currentY -= lineHeight;
        }
        currentY -= 2;
      }
      currentY -= 6;
      continue;
    }

    if (section.type === 'blockquote') {
      const fontSize = (section.fontSize || settings.baseFontSize || 11) + 0.5;
      const font = italicFont;
      const lineHeight = fontSize * 1.45;
      const padLeft = 16;
      const lines = wrapText(section.content || '', font, fontSize, contentWidth - padLeft);
      const blockHeight = lines.length * lineHeight + 12;

      checkNewPage(blockHeight);
      const startQuoteY = currentY;

      // Draw left accent bar
      currentPage.drawLine({
        start: { x: margins.left + 2, y: startQuoteY },
        end: { x: margins.left + 2, y: startQuoteY - blockHeight + 8 },
        thickness: 3,
        color: rgb(0.48, 0.23, 0.93), // Brand violet
      });

      currentY -= 6;
      for (const line of lines) {
        currentPage.drawText(line, {
          x: margins.left + padLeft,
          y: currentY - fontSize,
          size: fontSize,
          font,
          color: rgb(0.25, 0.28, 0.35),
        });
        currentY -= lineHeight;
      }
      currentY -= 8;
      continue;
    }

    if (section.type === 'code') {
      const fontSize = 9.5;
      const font = monoFont;
      const lineHeight = fontSize * 1.4;
      const lines = (section.content || '').split('\n');
      const boxHeight = lines.length * lineHeight + 16;

      checkNewPage(boxHeight);

      // Draw background box
      currentPage.drawRectangle({
        x: margins.left,
        y: currentY - boxHeight,
        width: contentWidth,
        height: boxHeight,
        color: rgb(0.95, 0.96, 0.98),
        borderColor: rgb(0.85, 0.88, 0.92),
        borderWidth: 1,
      });

      currentY -= 12;
      for (const line of lines) {
        currentPage.drawText(line.substring(0, 95), {
          x: margins.left + 12,
          y: currentY - fontSize,
          size: fontSize,
          font,
          color: rgb(0.15, 0.18, 0.24),
        });
        currentY -= lineHeight;
      }
      currentY -= 16;
      continue;
    }

    if (section.type === 'image' && section.imageUrl) {
      try {
        let imageBytes: ArrayBuffer;
        if (section.imageUrl.startsWith('data:')) {
          const base64Data = section.imageUrl.split(',')[1];
          const binary = atob(base64Data);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          imageBytes = bytes.buffer;
        } else {
          const res = await fetch(section.imageUrl);
          imageBytes = await res.arrayBuffer();
        }

        let embeddedImage;
        const isJpg = section.imageUrl.includes('image/jpeg') || section.imageUrl.includes('.jpg') || section.imageUrl.includes('.jpeg');
        if (isJpg) {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        } else {
          // Default embed as PNG
          embeddedImage = await pdfDoc.embedPng(imageBytes).catch(async () => {
            return await pdfDoc.embedJpg(imageBytes);
          });
        }

        if (embeddedImage) {
          const imgWidthPercent = (section.imageWidth || 80) / 100;
          const targetWidth = contentWidth * imgWidthPercent;
          const scale = targetWidth / embeddedImage.width;
          const targetHeight = embeddedImage.height * scale;
          const neededHeight = targetHeight + (section.imageCaption ? 28 : 16);

          checkNewPage(neededHeight);

          let drawX = margins.left;
          if (section.align === 'center') {
            drawX = margins.left + (contentWidth - targetWidth) / 2;
          } else if (section.align === 'right') {
            drawX = pageWidth - margins.right - targetWidth;
          }

          currentPage.drawImage(embeddedImage, {
            x: drawX,
            y: currentY - targetHeight,
            width: targetWidth,
            height: targetHeight,
          });

          currentY -= targetHeight + 6;

          if (section.imageCaption) {
            const capFont = italicFont;
            const capSize = 9;
            const capWidth = capFont.widthOfTextAtSize(section.imageCaption, capSize);
            const capX = drawX + (targetWidth - capWidth) / 2;
            currentPage.drawText(section.imageCaption, {
              x: Math.max(margins.left, capX),
              y: currentY - capSize,
              size: capSize,
              font: capFont,
              color: grayscale(0.4),
            });
            currentY -= 14;
          }
          currentY -= 8;
        }
      } catch (err) {
        console.error('Failed to embed image:', err);
      }
    }
  }

  // Draw Headers, Footers, and Page Numbers across all pages
  const totalPages = pages.length;
  const todayFormatted = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];
    const pageNum = i + 1;

    // Header
    if (settings.headerText) {
      const headerString = settings.headerText
        .replace(/{{page}}/g, String(pageNum))
        .replace(/{{pages}}/g, String(totalPages))
        .replace(/{{title}}/g, settings.title || '')
        .replace(/{{date}}/g, todayFormatted);

      const headerFontSize = 8.5;
      page.drawText(headerString, {
        x: margins.left,
        y: pageHeight - margins.top / 2,
        size: headerFontSize,
        font: regularFont,
        color: grayscale(0.45),
      });

      // Subtle header divider
      page.drawLine({
        start: { x: margins.left, y: pageHeight - margins.top / 2 - 4 },
        end: { x: pageWidth - margins.right, y: pageHeight - margins.top / 2 - 4 },
        thickness: 0.5,
        color: rgb(0.88, 0.9, 0.93),
      });
    }

    // Footer text
    if (settings.footerText) {
      const footerString = settings.footerText
        .replace(/{{page}}/g, String(pageNum))
        .replace(/{{pages}}/g, String(totalPages))
        .replace(/{{title}}/g, settings.title || '')
        .replace(/{{date}}/g, todayFormatted);

      page.drawText(footerString, {
        x: margins.left,
        y: margins.bottom / 2,
        size: 8.5,
        font: regularFont,
        color: grayscale(0.45),
      });
    }

    // Page Number
    if (settings.showPageNumbers) {
      let pageLabel = `${pageNum}`;
      if (settings.pageNumberFormat === 'page-of-total') {
        pageLabel = `Page ${pageNum} of ${totalPages}`;
      } else if (settings.pageNumberFormat === 'dash-number') {
        pageLabel = `— ${pageNum} —`;
      }

      const numFontSize = 8.5;
      const numWidth = regularFont.widthOfTextAtSize(pageLabel, numFontSize);
      let posX = (pageWidth - numWidth) / 2;
      let posY = margins.bottom / 2;

      if (settings.pageNumberPosition === 'top-left') {
        posX = margins.left;
        posY = pageHeight - margins.top / 2;
      } else if (settings.pageNumberPosition === 'top-center') {
        posX = (pageWidth - numWidth) / 2;
        posY = pageHeight - margins.top / 2;
      } else if (settings.pageNumberPosition === 'top-right') {
        posX = pageWidth - margins.right - numWidth;
        posY = pageHeight - margins.top / 2;
      } else if (settings.pageNumberPosition === 'bottom-left') {
        posX = margins.left;
        posY = margins.bottom / 2;
      } else if (settings.pageNumberPosition === 'bottom-center') {
        posX = (pageWidth - numWidth) / 2;
        posY = margins.bottom / 2;
      } else if (settings.pageNumberPosition === 'bottom-right') {
        posX = pageWidth - margins.right - numWidth;
        posY = margins.bottom / 2;
      }

      page.drawText(pageLabel, {
        x: posX,
        y: posY,
        size: numFontSize,
        font: regularFont,
        color: grayscale(0.45),
      });
    }
  }

  return await pdfDoc.save();
}

export function downloadPdfBlob(pdfBytes: Uint8Array, fileName: string = 'document.pdf') {
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export function printPdfBlob(pdfBytes: Uint8Array) {
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.src = url;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.open(url, '_blank');
    }
  };
}
