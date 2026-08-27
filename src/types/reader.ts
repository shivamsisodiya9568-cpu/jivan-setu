export type ReadingMode = 'pdf' | 'text' | 'audiobook';

export type VoiceGender = 'female' | 'male';

export type VoiceCategory = 'natural' | 'warm' | 'deep' | 'calm' | 'professional';

export interface VoiceOption {
  id: string;
  name: string;
  lang: string;
  langName: string;
  flag: string;
  gender: VoiceGender;
  category: VoiceCategory;
  provider: 'browser' | 'neural' | 'vercel-ai';
  voiceURI?: string;
  sampleText?: string;
}

export interface PdfChapter {
  id: string;
  title: string;
  pageNumber: number;
  paragraphIndex?: number;
  level?: number;
}

export interface PdfPageData {
  pageNumber: number;
  rawText: string;
  cleanedText: string;
  sentences: string[];
  isScannedImage?: boolean;
}

export interface PdfDocumentState {
  file: File | null;
  fileName: string;
  fileSize: number;
  totalPages: number;
  pages: PdfPageData[];
  chapters: PdfChapter[];
  detectedLanguage: string;
  detectedLangCode: string;
  isScanned: boolean;
  ocrProgress: {
    currentPage: number;
    totalPages: number;
    statusText: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

export interface CleanupSettings {
  removePageNumbers: boolean;
  removeHeaders: boolean;
  removeFooters: boolean;
  fixHyphenation: boolean;
  normalizeSpaces: boolean;
}

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentPageNumber: number;
  currentParagraphIndex: number;
  currentSentenceIndex: number;
  currentSentenceText: string;
  speed: number;
  volume: number;
  pitch: number;
  paragraphPauseMs: number;
  selectedVoice: VoiceOption | null;
  mode: ReadingMode;
  audioProgressPercent: number;
  isGeneratingAudio: boolean;
  generationStatusText: string;
}

export interface SavedProgress {
  documentId: string;
  fileName: string;
  pageNumber: number;
  paragraphIndex: number;
  sentenceIndex: number;
  voiceId: string;
  speed: number;
  timestamp: number;
  snippetText: string;
}

export interface QaMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  pageNumber?: number;
  timestamp: number;
}
