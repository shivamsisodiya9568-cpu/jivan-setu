/**
 * Smart Text Cleaner and Sentence Segmentation Service
 * Optimizes PDF extracted text for high-quality natural voice reading.
 */

export interface TextCleaningOptions {
  removePageNumbers?: boolean;
  removeHeaders?: boolean;
  removeFooters?: boolean;
  fixHyphenation?: boolean;
  normalizeSpaces?: boolean;
  removeOcrArtifacts?: boolean;
}

export class TextCleanerService {
  /**
   * Cleans text before passing to TTS or reader display
   */
  public static cleanText(rawText: string, options: TextCleaningOptions = {}): string {
    if (!rawText || !rawText.trim()) return '';

    const opts: Required<TextCleaningOptions> = {
      removePageNumbers: options.removePageNumbers ?? true,
      removeHeaders: options.removeHeaders ?? true,
      removeFooters: options.removeFooters ?? true,
      fixHyphenation: options.fixHyphenation ?? true,
      normalizeSpaces: options.normalizeSpaces ?? true,
      removeOcrArtifacts: options.removeOcrArtifacts ?? true,
    };

    let text = rawText;

    // 1. Remove OCR and special non-printable / broken control characters
    if (opts.removeOcrArtifacts) {
      // Remove null, form feeds, bell, and unicode replacement characters
      text = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFD\uFEFF]/g, ' ');
      // Fix broken quotes and ligatures
      text = text
        .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
        .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
        .replace(/[\u2013\u2014]/g, ' - ')
        .replace(/\u2026/g, '...');
    }

    // 2. Fix hyphenated word breaks at end of lines (e.g. "com- \n puter" -> "computer")
    if (opts.fixHyphenation) {
      text = text.replace(/([a-zA-Z]+)-\s*[\r\n]+\s*([a-zA-Z]+)/g, '$1$2');
      text = text.replace(/([a-zA-Z]+)-\s+([a-zA-Z]{3,})/g, '$1$2');
    }

    // 3. Remove standalone page numbers and "Page X of Y" patterns
    if (opts.removePageNumbers) {
      text = text.replace(/^[ \t]*Page\s+\d+\s*(?:of\s+\d+)?[ \t]*$/gim, '');
      text = text.replace(/^[ \t]*[-–—]?\s*\d+\s*[-–—]?[ \t]*$/gm, '');
      text = text.replace(/\bPage\s+\d+\s+of\s+\d+\b/gi, '');
      text = text.replace(/\b\d+\s+of\s+\d+\b/gi, '');
    }

    // 4. Remove common header / footer patterns
    if (opts.removeHeaders || opts.removeFooters) {
      // Remove URLs or typical copyright footers on isolated lines
      text = text.replace(/^[ \t]*(?:https?:\/\/[^\s]+|www\.[^\s]+)[ \t]*$/gim, '');
      text = text.replace(/^[ \t]*©\s*\d{4}[^\n]*$/gim, '');
    }

    // 5. Normalize newlines and spaces
    if (opts.normalizeSpaces) {
      // Replace non-breaking spaces with standard space
      text = text.replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000]/g, ' ');
      // Merge multiple inline spaces/tabs into a single space
      text = text.replace(/[ \t]+/g, ' ');
      // Normalize linebreaks (at most 2 consecutive linebreaks)
      text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      text = text.replace(/[ \t]*\n[ \t]*/g, '\n');
      text = text.replace(/\n{3,}/g, '\n\n');
    }

    return text.trim();
  }

  /**
   * Intelligently splits cleaned text into sentence segments for natural voice reading.
   * Handles abbreviations (e.g., Mr., Dr., etc., vs., U.S., e.g., i.e.) without breaking.
   */
  public static splitIntoSentences(text: string): string[] {
    if (!text || !text.trim()) return [];

    const cleaned = this.cleanText(text);

    // List of common English abbreviations that end with a period but aren't sentence endings
    const abbreviations = [
      'mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'jr', 'vs', 'etc', 'e.g', 'i.e',
      'u.s', 'u.k', 'u.n', 'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
      'st', 'ave', 'rd', 'blvd', 'dept', 'approx', 'est', 'min', 'max', 'fig', 'no'
    ];

    // Protect abbreviations by temporarily replacing their periods
    let protectedText = cleaned;
    abbreviations.forEach((abbr, idx) => {
      const regex = new RegExp(`\\b(${abbr})\\.(\\s+)`, 'gi');
      protectedText = protectedText.replace(regex, `$1__DOT${idx}__$2`);
    });

    // Protect numbers with decimals (e.g., 3.14, 10.5)
    protectedText = protectedText.replace(/(\d+)\.(\d+)/g, '$1__NUMDOT__$2');

    // Split on sentence boundaries: . ! ? followed by whitespace or newline, or double newlines
    const rawSegments = protectedText.split(/(?<=[.!?])\s+|\n\n+/);

    const sentences: string[] = [];

    for (let segment of rawSegments) {
      // Restore abbreviations and decimal dots
      abbreviations.forEach((abbr, idx) => {
        segment = segment.replace(new RegExp(`__DOT${idx}__`, 'g'), '.');
      });
      segment = segment.replace(/__NUMDOT__/g, '.');

      const trimmed = segment.trim();
      if (!trimmed) continue;

      // If a segment is unusually long (> 350 chars), safely split by clause/semicolon/comma
      if (trimmed.length > 350) {
        const subChunks = this.splitLongChunk(trimmed, 280);
        sentences.push(...subChunks);
      } else {
        sentences.push(trimmed);
      }
    }

    return sentences.filter(s => s.length > 0);
  }

  /**
   * Helper to split an extra-long segment without breaking words
   */
  private static splitLongChunk(chunk: string, maxLen: number): string[] {
    const parts: string[] = [];
    const clauses = chunk.split(/(?<=[,;:—–\-])\s+/);

    let current = '';
    for (const clause of clauses) {
      if ((current + ' ' + clause).trim().length <= maxLen) {
        current = (current + ' ' + clause).trim();
      } else {
        if (current) parts.push(current);
        if (clause.length > maxLen) {
          // Hard split by words if single clause is too big
          const words = clause.split(/\s+/);
          let wChunk = '';
          for (const word of words) {
            if ((wChunk + ' ' + word).trim().length <= maxLen) {
              wChunk = (wChunk + ' ' + word).trim();
            } else {
              if (wChunk) parts.push(wChunk);
              wChunk = word;
            }
          }
          if (wChunk) parts.push(wChunk);
          current = '';
        } else {
          current = clause;
        }
      }
    }

    if (current) parts.push(current);
    return parts;
  }
}
