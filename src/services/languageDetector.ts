export interface DetectedLanguageInfo {
  code: string;
  name: string;
  flag: string;
  confidence: number;
}

export class LanguageDetector {
  /**
   * Detect language from extracted document text
   */
  public static detectLanguage(text: string): DetectedLanguageInfo {
    const sample = text.slice(0, 3000);
    if (!sample.trim()) {
      return { code: 'en-US', name: 'English', flag: '🇺🇸', confidence: 1.0 };
    }

    // Devanagari script (Hindi, Marathi, Nepali)
    const hindiMatches = (sample.match(/[\u0900-\u097F]/g) || []).length;
    // Japanese Kana & Kanji
    const japaneseMatches = (sample.match(/[\u3040-\u30FF\u31F0-\u31FF\u4E00-\u9FAF]/g) || []).length;
    // Chinese Characters (Simplified/Traditional)
    const chineseMatches = (sample.match(/[\u4E00-\u9FFF]/g) || []).length;
    // Korean Hangul
    const koreanMatches = (sample.match(/[\uAC00-\uD7AF\u1100-\u11FF]/g) || []).length;
    // Arabic script
    const arabicMatches = (sample.match(/[\u0600-\u06FF]/g) || []).length;
    // Cyrillic script (Russian)
    const cyrillicMatches = (sample.match(/[\u0400-\u04FF]/g) || []).length;

    const totalChars = sample.length;

    if (hindiMatches > 20 || (hindiMatches / totalChars) > 0.05) {
      return { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳', confidence: 0.95 };
    }

    if (japaneseMatches > 15 && (sample.includes('の') || sample.includes('です') || sample.includes('ます'))) {
      return { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵', confidence: 0.95 };
    }

    if (chineseMatches > 20 && !sample.includes('の')) {
      return { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳', confidence: 0.95 };
    }

    if (koreanMatches > 15) {
      return { code: 'ko-KR', name: 'Korean', flag: '🇰🇷', confidence: 0.95 };
    }

    if (arabicMatches > 15) {
      return { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦', confidence: 0.95 };
    }

    if (cyrillicMatches > 15) {
      return { code: 'ru-RU', name: 'Russian', flag: '🇷🇺', confidence: 0.95 };
    }

    // Latin Script Heuristics for European Languages
    const lower = sample.toLowerCase();
    
    // Spanish
    const esKeywords = ['que', 'del', 'los', 'las', 'por', 'para', 'como', 'con', 'una', 'este'];
    const esCount = esKeywords.filter(w => lower.includes(` ${w} `)).length;

    // French
    const frKeywords = ['les', 'des', 'que', 'pour', 'dans', 'une', 'avec', 'est', 'sur', 'pas'];
    const frCount = frKeywords.filter(w => lower.includes(` ${w} `)).length;

    // German
    const deKeywords = ['und', 'die', 'der', 'das', 'ist', 'mit', 'nicht', 'ein', 'eine', 'dem'];
    const deCount = deKeywords.filter(w => lower.includes(` ${w} `)).length;

    // Italian
    const itKeywords = ['che', 'della', 'degli', 'per', 'con', 'delle', 'questo', 'anche', 'stato'];
    const itCount = itKeywords.filter(w => lower.includes(` ${w} `)).length;

    // Portuguese
    const ptKeywords = ['que', 'dos', 'das', 'com', 'como', 'para', 'uma', 'este', 'mais', 'pela'];
    const ptCount = ptKeywords.filter(w => lower.includes(` ${w} `)).length;

    if (esCount >= 4 && esCount > frCount && esCount > deCount) {
      return { code: 'es-ES', name: 'Spanish', flag: '🇪🇸', confidence: 0.88 };
    }

    if (frCount >= 4 && frCount > esCount && frCount > deCount) {
      return { code: 'fr-FR', name: 'French', flag: '🇫🇷', confidence: 0.88 };
    }

    if (deCount >= 4 && deCount > esCount && deCount > frCount) {
      return { code: 'de-DE', name: 'German', flag: '🇩🇪', confidence: 0.88 };
    }

    if (itCount >= 4) {
      return { code: 'it-IT', name: 'Italian', flag: '🇮🇹', confidence: 0.88 };
    }

    if (ptCount >= 4) {
      return { code: 'pt-BR', name: 'Portuguese', flag: '🇵🇹', confidence: 0.88 };
    }

    // Default to English
    return { code: 'en-US', name: 'English', flag: '🇺🇸', confidence: 0.9 };
  }
}
