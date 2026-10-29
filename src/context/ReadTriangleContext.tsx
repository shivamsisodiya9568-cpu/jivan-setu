import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  PdfDocumentState,
  PlaybackState,
  VoiceOption,
  ReadingMode,
  CleanupSettings,
  SavedProgress,
  QaMessage
} from '../types/reader';
import { PdfExtractionService } from '../services/pdfExtractionService';
import { speechSynthesisService } from '../services/speechSynthesisService';
import { GoogleTtsService } from '../services/googleTtsService';
import { StorageService } from '../services/storageService';
import { aiAssistantService } from '../services/aiAssistantService';

interface ReadTriangleContextType {
  // Document State
  documentState: PdfDocumentState;
  uploadPdf: (file: File) => Promise<void>;
  resetPdf: () => void;
  
  // Reading & Playback State
  playback: PlaybackState;
  setMode: (mode: ReadingMode) => void;
  setPage: (pageNumber: number) => void;
  setSpeed: (speed: number) => void;
  setVolume: (volume: number) => void;
  setVoice: (voice: VoiceOption) => void;
  setParagraphPause: (ms: number) => void;

  // Audio Playback Controls
  play: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  nextSection: () => void;
  prevSection: () => void;
  jumpToSentence: (pageNumber: number, sentenceIndex: number) => void;
  downloadAudio: () => Promise<void>;

  // Settings & Storage
  cleanupSettings: CleanupSettings;
  updateCleanupSettings: (settings: Partial<CleanupSettings>) => void;
  savedProgressList: SavedProgress[];
  loadSavedProgress: (progress: SavedProgress) => void;
  latestProgress: SavedProgress | null;

  // AI Assistant
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  aiMessages: QaMessage[];
  askAi: (question: string) => Promise<void>;
  generateSummary: () => Promise<string>;
  listenToSummary: () => Promise<void>;
  
  // UI & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toastMessage: { title: string; desc?: string; type?: 'info' | 'success' | 'warning' | 'error' } | null;
  showToast: (title: string, desc?: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

const ReadTriangleContext = createContext<ReadTriangleContextType | undefined>(undefined);

export const ReadTriangleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Document State
  const [documentState, setDocumentState] = useState<PdfDocumentState>({
    file: null,
    fileName: '',
    fileSize: 0,
    totalPages: 0,
    pages: [],
    chapters: [],
    detectedLanguage: 'English',
    detectedLangCode: 'en-US',
    isScanned: false,
    ocrProgress: null,
    isLoading: false,
    error: null,
  });

  // Playback State
  const [playback, setPlayback] = useState<PlaybackState>({
    isPlaying: false,
    isPaused: false,
    currentPageNumber: 1,
    currentParagraphIndex: 0,
    currentSentenceIndex: 0,
    currentSentenceText: '',
    speed: 1.0,
    volume: 1.0,
    pitch: 1.0,
    paragraphPauseMs: 300,
    selectedVoice: null,
    mode: 'pdf',
    audioProgressPercent: 0,
    isGeneratingAudio: false,
    generationStatusText: '',
  });

  // Settings & Persistence
  const [cleanupSettings, setCleanupSettings] = useState<CleanupSettings>(StorageService.getCleanupSettings());
  const [savedProgressList, setSavedProgressList] = useState<SavedProgress[]>(StorageService.getAllProgress());
  const [latestProgress, setLatestProgress] = useState<SavedProgress | null>(StorageService.getLatestProgress());
  
  // AI State
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<QaMessage[]>([]);

  // Search & Theme
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc?: string; type?: 'info' | 'success' | 'warning' | 'error' } | null>(null);

  const isReadingRef = useRef(false);

  // Initialize Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load Voices & Set Default Voice
  useEffect(() => {
    const initVoice = () => {
      const bestVoice = speechSynthesisService.getBestVoiceForLanguage(documentState.detectedLangCode);
      if (bestVoice) {
        setPlayback(prev => ({ ...prev, selectedVoice: bestVoice }));
      }
    };
    initVoice();
  }, [documentState.detectedLangCode]);

  const showToast = useCallback((title: string, desc?: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Upload PDF Handler
  const uploadPdf = async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      setDocumentState(prev => ({
        ...prev,
        error: 'This file could not be processed. Please upload a valid PDF.',
      }));
      showToast('Invalid File Format', 'Please upload a valid PDF document.', 'error');
      return;
    }

    setDocumentState({
      file,
      fileName: file.name,
      fileSize: file.size,
      totalPages: 0,
      pages: [],
      chapters: [],
      detectedLanguage: 'Detecting...',
      detectedLangCode: 'en-US',
      isScanned: false,
      ocrProgress: null,
      isLoading: true,
      error: null,
    });

    try {
      const extracted = await PdfExtractionService.processPdfFile(file, cleanupSettings, (status) => {
        setDocumentState(prev => ({ ...prev, ocrProgress: status }));
      });

      setDocumentState(extracted);
      setPlayback(prev => ({
        ...prev,
        currentPageNumber: 1,
        currentParagraphIndex: 0,
        currentSentenceIndex: 0,
        isPlaying: false,
        isPaused: false,
        selectedVoice: speechSynthesisService.getBestVoiceForLanguage(extracted.detectedLangCode),
      }));

      showToast('Document Loaded', `${file.name} (${extracted.totalPages} pages) is ready.`, 'success');
    } catch (err: any) {
      setDocumentState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'This file could not be processed. Please upload a valid PDF.',
      }));
      showToast('Processing Error', err.message || 'Failed to read PDF.', 'error');
    }
  };

  const resetPdf = () => {
    speechSynthesisService.stop();
    setDocumentState({
      file: null,
      fileName: '',
      fileSize: 0,
      totalPages: 0,
      pages: [],
      chapters: [],
      detectedLanguage: 'English',
      detectedLangCode: 'en-US',
      isScanned: false,
      ocrProgress: null,
      isLoading: false,
      error: null,
    });
    setPlayback(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentPageNumber: 1,
      currentSentenceIndex: 0,
    }));
  };

  // Playback Loop for Continuous Sentence Reading
  const startReadingFromCurrentPosition = useCallback(async () => {
    if (documentState.pages.length === 0) return;

    isReadingRef.current = true;
    setPlayback(prev => ({ ...prev, isPlaying: true, isPaused: false }));

    let pageIdx = playback.currentPageNumber - 1;
    let sentIdx = playback.currentSentenceIndex;

    while (isReadingRef.current && pageIdx < documentState.pages.length) {
      const pageData = documentState.pages[pageIdx];
      if (!pageData || pageData.sentences.length === 0) {
        pageIdx++;
        sentIdx = 0;
        continue;
      }

      while (isReadingRef.current && sentIdx < pageData.sentences.length) {
        const sentenceText = pageData.sentences[sentIdx];

        // Background Prefetch next sentence for zero-latency reading
        if (sentIdx + 1 < pageData.sentences.length && playback.selectedVoice?.provider === 'neural') {
          const nextSent = pageData.sentences[sentIdx + 1];
          GoogleTtsService.prefetch(nextSent, playback.selectedVoice?.voiceURI, playback.speed);
        }

        // Update Playback State & Auto Page Sync
        setPlayback(prev => {
          const totalPages = documentState.pages.length;
          const currentProgress = Math.round(((pageIdx * 100) / Math.max(1, totalPages)));
          return {
            ...prev,
            currentPageNumber: pageIdx + 1,
            currentSentenceIndex: sentIdx,
            currentSentenceText: sentenceText,
            audioProgressPercent: currentProgress,
          };
        });

        // Save Reading Progress
        const progressObj: SavedProgress = {
          documentId: documentState.fileName,
          fileName: documentState.fileName,
          pageNumber: pageIdx + 1,
          paragraphIndex: 0,
          sentenceIndex: sentIdx,
          voiceId: playback.selectedVoice?.id || 'default',
          speed: playback.speed,
          timestamp: Date.now(),
          snippetText: sentenceText.substring(0, 80),
        };
        StorageService.saveProgress(progressObj);
        setLatestProgress(progressObj);
        setSavedProgressList(StorageService.getAllProgress());

        // Speak current sentence
        try {
          await speechSynthesisService.speakSentence(sentenceText, {
            voice: playback.selectedVoice,
            speed: playback.speed,
            volume: playback.volume,
            pitch: playback.pitch,
          });
        } catch {
          // If error occurs, pause briefly and continue
        }

        if (!isReadingRef.current) break;
        sentIdx++;
      }

      pageIdx++;
      sentIdx = 0;
    }

    if (isReadingRef.current) {
      setPlayback(prev => ({ ...prev, isPlaying: false, isPaused: false }));
      isReadingRef.current = false;
      showToast('Reading Completed', 'End of document reached.', 'info');
    }
  }, [documentState.pages, documentState.fileName, playback.currentPageNumber, playback.currentSentenceIndex, playback.selectedVoice, playback.speed, playback.volume, playback.pitch, showToast]);

  const play = () => {
    if (playback.isPaused) {
      speechSynthesisService.resume();
      setPlayback(prev => ({ ...prev, isPlaying: true, isPaused: false }));
      isReadingRef.current = true;
    } else {
      startReadingFromCurrentPosition();
    }
  };

  const pause = () => {
    isReadingRef.current = false;
    speechSynthesisService.pause();
    setPlayback(prev => ({ ...prev, isPlaying: false, isPaused: true }));
  };

  const resume = () => {
    isReadingRef.current = true;
    speechSynthesisService.resume();
    setPlayback(prev => ({ ...prev, isPlaying: true, isPaused: false }));
  };

  const stop = () => {
    isReadingRef.current = false;
    speechSynthesisService.stop();
    setPlayback(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentSentenceIndex: 0,
      currentSentenceText: '',
    }));
  };

  const nextSection = () => {
    if (playback.currentPageNumber < documentState.totalPages) {
      setPage(playback.currentPageNumber + 1);
    }
  };

  const prevSection = () => {
    if (playback.currentPageNumber > 1) {
      setPage(playback.currentPageNumber - 1);
    }
  };

  const jumpToSentence = (pageNumber: number, sentenceIndex: number) => {
    speechSynthesisService.stop();
    setPlayback(prev => ({
      ...prev,
      currentPageNumber: pageNumber,
      currentSentenceIndex: sentenceIndex,
    }));
    setTimeout(() => {
      startReadingFromCurrentPosition();
    }, 100);
  };

  const setPage = (pageNumber: number) => {
    const validPage = Math.max(1, Math.min(documentState.totalPages || 1, pageNumber));
    setPlayback(prev => ({
      ...prev,
      currentPageNumber: validPage,
      currentSentenceIndex: 0,
    }));
  };

  const setSpeed = (speed: number) => {
    setPlayback(prev => ({ ...prev, speed }));
  };

  const setVolume = (volume: number) => {
    setPlayback(prev => ({ ...prev, volume }));
  };

  const setVoice = (voice: VoiceOption) => {
    setPlayback(prev => ({ ...prev, selectedVoice: voice }));
    showToast('Voice Selected', `${voice.name} (${voice.langName})`, 'info');
  };

  const setParagraphPause = (ms: number) => {
    setPlayback(prev => ({ ...prev, paragraphPauseMs: ms }));
  };

  const setMode = (mode: ReadingMode) => {
    setPlayback(prev => ({ ...prev, mode }));
  };

  const downloadAudio = async () => {
    if (documentState.pages.length === 0) return;

    setPlayback(prev => ({
      ...prev,
      isGeneratingAudio: true,
      generationStatusText: 'Generating natural speech audio file...',
    }));

    try {
      const fullText = documentState.pages[playback.currentPageNumber - 1]?.cleanedText || 'Audio export';
      const blob = await speechSynthesisService.exportAudioBlob(fullText, playback.selectedVoice);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ReadTriangle-${documentState.fileName.replace(/\.pdf$/i, '')}-Page${playback.currentPageNumber}.wav`;
      a.click();
      URL.revokeObjectURL(url);

      showToast('Audio Downloaded', 'Speech audio exported successfully.', 'success');
    } catch (err: any) {
      showToast('Export Error', 'Failed to generate audio file.', 'error');
    } finally {
      setPlayback(prev => ({
        ...prev,
        isGeneratingAudio: false,
        generationStatusText: '',
      }));
    }
  };

  const updateCleanupSettings = (newSettings: Partial<CleanupSettings>) => {
    const updated = { ...cleanupSettings, ...newSettings };
    setCleanupSettings(updated);
    StorageService.saveCleanupSettings(updated);
    showToast('Settings Saved', 'Text cleanup preferences updated.', 'success');
  };

  const loadSavedProgress = (progress: SavedProgress) => {
    setPlayback(prev => ({
      ...prev,
      currentPageNumber: progress.pageNumber,
      currentSentenceIndex: progress.sentenceIndex,
      speed: progress.speed,
    }));
    showToast('Bookmark Restored', `Resumed reading ${progress.fileName} at Page ${progress.pageNumber}.`, 'info');
  };

  // AI Q&A
  const askAi = async (question: string) => {
    if (!question.trim() || documentState.pages.length === 0) return;

    const userMsg: QaMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: Date.now(),
    };
    setAiMessages(prev => [...prev, userMsg]);

    const answerRes = await aiAssistantService.askPdf(question, documentState.pages);

    const assistantMsg: QaMessage = {
      id: `ans-${Date.now()}`,
      role: 'assistant',
      content: answerRes.answer,
      pageNumber: answerRes.pageNumber,
      timestamp: Date.now(),
    };
    setAiMessages(prev => [...prev, assistantMsg]);
  };

  const generateSummary = async (): Promise<string> => {
    if (documentState.pages.length === 0) return 'Please upload a PDF first to generate a summary.';
    return await aiAssistantService.summarizeDocument(documentState.pages);
  };

  const listenToSummary = async (): Promise<void> => {
    const summaryText = await generateSummary();
    speechSynthesisService.speakSentence(summaryText.replace(/#/g, ''), {
      voice: playback.selectedVoice,
      speed: playback.speed,
    });
    showToast('Listen to Summary', 'Playing document summary aloud.', 'info');
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <ReadTriangleContext.Provider
      value={{
        documentState,
        uploadPdf,
        resetPdf,
        playback,
        setMode,
        setPage,
        setSpeed,
        setVolume,
        setVoice,
        setParagraphPause,
        play,
        pause,
        resume,
        stop,
        nextSection,
        prevSection,
        jumpToSentence,
        downloadAudio,
        cleanupSettings,
        updateCleanupSettings,
        savedProgressList,
        loadSavedProgress,
        latestProgress,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        aiMessages,
        askAi,
        generateSummary,
        listenToSummary,
        searchQuery,
        setSearchQuery,
        isDarkMode,
        toggleDarkMode,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </ReadTriangleContext.Provider>
  );
};

export const useReadTriangle = () => {
  const context = useContext(ReadTriangleContext);
  if (!context) {
    throw new Error('useReadTriangle must be used within a ReadTriangleProvider');
  }
  return context;
};
