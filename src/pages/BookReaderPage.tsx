import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  BookOpen, 
  Sparkles, 
  Upload, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Clock, 
  Sliders, 
  Sun, 
  Moon, 
  BookMarked, 
  FileText, 
  RotateCcw,
  Check,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SeoHead } from '../components/layout/SeoHead';
import { FileDropzone } from '../components/common/FileDropzone';
import { PrivacyBadge } from '../components/common/PrivacyBadge';
import { ProcessingOverlay } from '../components/common/ProcessingOverlay';
import { VoiceController } from '../components/reader/VoiceController';
import { DocumentAssistantDrawer } from '../components/assistant/DocumentAssistantDrawer';
import { speechService, SpeechState } from '../services/speechService';
import { PdfReaderService } from '../services/pdfReaderService';
import { SAMPLE_BOOKS, SampleBook } from '../data/sampleBooks';
import { useToast } from '../context/ToastContext';

export const BookReaderPage: React.FC = () => {
  const { success, error, info } = useToast();

  // Active Document State
  const [docTitle, setDocTitle] = useState<string>(SAMPLE_BOOKS[0].title);
  const [docAuthor, setDocAuthor] = useState<string>(SAMPLE_BOOKS[0].author);
  const [totalPages, setTotalPages] = useState<number>(SAMPLE_BOOKS[0].pagesCount);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [chapterTitle, setChapterTitle] = useState<string>(SAMPLE_BOOKS[0].chapters[0].title);
  const [paragraphs, setParagraphs] = useState<string[]>(SAMPLE_BOOKS[0].chapters[0].paragraphs);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number>(0);

  // Voice Engine State
  const [speechState, setSpeechState] = useState<SpeechState>('idle');
  const [speed, setSpeed] = useState<number>(1.0);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Styling & Reader State
  const [readerTheme, setReaderTheme] = useState<'light' | 'dark' | 'sepia'>('sepia');
  const [fontSize, setFontSize] = useState<number>(16); // in px
  const [fontStyle, setFontStyle] = useState<'serif' | 'sans'>('serif');
  const [showAssistant, setShowAssistant] = useState<boolean>(false);

  const readerServiceRef = useRef<PdfReaderService | null>(null);

  // Init local reader service
  useEffect(() => {
    readerServiceRef.current = new PdfReaderService();

    // Check saved progress in localStorage
    try {
      const savedPage = localStorage.getItem('pragati_read_page');
      const savedSpeed = localStorage.getItem('pragati_read_speed');
      const savedVoice = localStorage.getItem('pragati_read_voice');
      if (savedSpeed) setSpeed(parseFloat(savedSpeed));
      if (savedVoice) {
        setSelectedVoice(savedVoice);
        speechService.setVoice(savedVoice);
      }
    } catch {
      // ignore
    }

    return () => {
      speechService.stop();
      if (readerServiceRef.current) readerServiceRef.current.destroy();
    };
  }, []);

  // Update speechService callbacks
  useEffect(() => {
    speechService.setCallbacks?.({
      onStateChange: (st: any) => setSpeechState(st),
      onEnd: () => {
        // When paragraph ends, auto-advance to next paragraph or next page!
        setActiveParagraphIndex((prevIdx: number) => {
          if (prevIdx < paragraphs.length - 1) {
            const nextIdx = prevIdx + 1;
            // Speak next paragraph
            setTimeout(() => {
              speechService.speak(paragraphs[nextIdx]);
            }, 300);
            return nextIdx;
          } else {
            // End of page! Check if next page exists
            if (currentPage < totalPages) {
              setTimeout(() => {
                handleNextPage(true);
              }, 600);
            }
            return prevIdx;
          }
        });
      },
      onError: (err: any) => {
        console.warn('Speech error:', err);
      },
    });
  }, [paragraphs, currentPage, totalPages]);

  // Load custom PDF file
  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0 || !readerServiceRef.current) return;
    const file = files[0];
    speechService.stop();
    setIsProcessing(true);

    try {
      const buffer = await file.arrayBuffer();
      const meta = await readerServiceRef.current.loadDocument(buffer);
      setDocTitle(meta.title || file.name);
      setDocAuthor(meta.author || 'Unknown');
      setTotalPages(meta.numPages);
      setCurrentPage(1);

      // Extract text of page 1
      const pageData = await readerServiceRef.current.extractPageText(1);
      setParagraphs(pageData.paragraphs.length > 0 ? pageData.paragraphs : ['(No readable text found on this page)']);
      setChapterTitle(`Page 1 of ${meta.numPages}`);
      setActiveParagraphIndex(0);

      success('Document Loaded', `${file.name} is ready for voice reading.`);
    } catch (err: any) {
      error('File Error', 'Could not read text from this document.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Load sample book
  const handleLoadSampleBook = (bookId: string) => {
    const book = SAMPLE_BOOKS.find((b) => b.id === bookId);
    if (!book) return;

    speechService.stop();
    setDocTitle(book.title);
    setDocAuthor(book.author);
    setTotalPages(book.pagesCount);
    setCurrentPage(1);
    setChapterTitle(book.chapters[0].title);
    setParagraphs(book.chapters[0].paragraphs);
    setActiveParagraphIndex(0);
    success('Sample Book Loaded', `Started "${book.title}".`);
  };

  // Change page
  const handlePageChange = async (pageNum: number, autoPlay: boolean = false) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    speechService.stop();
    setCurrentPage(pageNum);
    setActiveParagraphIndex(0);

    // Save progress locally
    try {
      localStorage.setItem('pragati_read_page', String(pageNum));
    } catch {
      // ignore
    }

    if (readerServiceRef.current && readerServiceRef.current.getNumPages() > 0) {
      setIsProcessing(true);
      try {
        const pageData = await readerServiceRef.current.extractPageText(pageNum);
        const pars = pageData.paragraphs.length > 0 ? pageData.paragraphs : ['(No text on this page)'];
        setParagraphs(pars);
        setChapterTitle(`Page ${pageNum} of ${totalPages}`);
        if (autoPlay && pars.length > 0) {
          setTimeout(() => {
            speechService.speak(pars[0]);
          }, 300);
        }
      } catch {
        // ignore
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Sample books fallback
      const currentBook = SAMPLE_BOOKS.find((b) => b.title === docTitle) || SAMPLE_BOOKS[0];
      const ch = currentBook.chapters[(pageNum - 1) % currentBook.chapters.length];
      setChapterTitle(ch.title);
      setParagraphs(ch.paragraphs);
      if (autoPlay && ch.paragraphs.length > 0) {
        setTimeout(() => {
          speechService.speak(ch.paragraphs[0]);
        }, 300);
      }
    }
  };

  const handleNextPage = (autoPlay: boolean = false) => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1, autoPlay);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  // Voice playback triggers
  const handlePlay = () => {
    if (paragraphs.length === 0) return;
    speechService.speak(paragraphs[activeParagraphIndex]);
  };

  const handlePause = () => {
    speechService.pause();
  };

  const handleResume = () => {
    speechService.resume();
  };

  const handleStop = () => {
    speechService.stop();
  };

  const handlePrevParagraph = () => {
    if (activeParagraphIndex > 0) {
      const prev = activeParagraphIndex - 1;
      setActiveParagraphIndex(prev);
      if (speechState === 'playing') {
        speechService.speak(paragraphs[prev]);
      }
    }
  };

  const handleNextParagraph = () => {
    if (activeParagraphIndex < paragraphs.length - 1) {
      const next = activeParagraphIndex + 1;
      setActiveParagraphIndex(next);
      if (speechState === 'playing') {
        speechService.speak(paragraphs[next]);
      }
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    speechService.setRate(newSpeed);
    try {
      localStorage.setItem('pragati_read_speed', String(newSpeed));
    } catch {}
    if (speechState === 'playing') {
      speechService.speak(paragraphs[activeParagraphIndex]);
    }
  };

  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
    speechService.setVoice(voiceName);
    try {
      localStorage.setItem('pragati_read_voice', voiceName);
    } catch {}
    if (speechState === 'playing') {
      speechService.speak(paragraphs[activeParagraphIndex]);
    }
  };

  // Estimate total minutes
  const totalWords = paragraphs.join(' ').split(/\s+/).length;
  const estimatedMinutes = Math.max(1, Math.round(totalWords / 150));

  return (
    <div className="flex-1 flex flex-col bg-slate-100 dark:bg-dark-bg min-h-screen">
      <SeoHead
        title="Book Reader & Voice - Read PDF Aloud with Speech Synthesis"
        description="Listen to books, PDF documents, and articles read aloud using native browser speech synthesis. Real-time sentence highlighting, adjustable speed (0.5x-2x), and chapter tracking."
        keywords="read PDF aloud, book reader, text to speech PDF, listen to PDF, audiobook player, PDF voice reader"
        canonicalPath="/book-reader"
      />

      {isProcessing && (
        <ProcessingOverlay
          message="Extracting Readable Text..."
          submessage="Parsing document structural paragraphs locally for speech synthesis"
        />
      )}

      {/* Top Book Header Bar */}
      <div className="bg-white dark:bg-dark-surface border-b border-slate-200 dark:border-dark-border px-4 py-3 sticky top-16 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Book Meta */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>{docTitle}</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  {chapterTitle}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                <span>By {docAuthor}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> ~{estimatedMinutes} min read
                </span>
              </div>
            </div>
          </div>

          {/* Right: Custom Upload, Sample Selector & Assistant Trigger */}
          <div className="flex items-center gap-2">
            {/* Sample selector */}
            <select
              onChange={(e) => handleLoadSampleBook(e.target.value)}
              className="text-xs bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="">Sample Books...</option>
              {SAMPLE_BOOKS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>

            {/* Upload PDF */}
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Book</span>
              <input
                type="file"
                accept="application/pdf,text/plain"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleFileUpload(Array.from(e.target.files));
                }}
              />
            </label>

            {/* Assistant Trigger */}
            <button
              onClick={() => setShowAssistant(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pragati Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Reading Canvas */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full flex flex-col justify-between space-y-6">
        {/* Reader Display Surface */}
        <div
          className={`rounded-3xl p-6 sm:p-12 shadow-xl border transition-all duration-200 flex-1 flex flex-col justify-between ${
            readerTheme === 'sepia'
              ? 'bg-[#fbf7ee] text-[#2b2416] border-[#ebdcc4]'
              : readerTheme === 'dark'
              ? 'bg-[#0f141c] text-slate-100 border-dark-border'
              : 'bg-white text-slate-900 border-slate-200'
          }`}
          style={{
            fontFamily: fontStyle === 'serif' ? 'Merriweather, Georgia, serif' : 'Plus Jakarta Sans, sans-serif',
            fontSize: `${fontSize}px`,
          }}
        >
          {/* Chapter / Top Header */}
          <div className="border-b border-slate-200/60 dark:border-slate-800/80 pb-4 mb-6 flex items-center justify-between text-xs opacity-70">
            <span className="font-semibold uppercase tracking-widest text-[10px]">
              {chapterTitle}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontStyle(fontStyle === 'serif' ? 'sans' : 'serif')}
                className="px-2 py-0.5 rounded border border-current"
              >
                {fontStyle === 'serif' ? 'Serif' : 'Sans'}
              </button>
              <button
                onClick={() => setFontSize((s) => Math.max(14, s - 1))}
                className="px-1.5 py-0.5 rounded border border-current font-bold"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize((s) => Math.min(24, s + 1))}
                className="px-1.5 py-0.5 rounded border border-current font-bold"
              >
                A+
              </button>
              <button
                onClick={() => setReaderTheme(readerTheme === 'sepia' ? 'light' : readerTheme === 'light' ? 'dark' : 'sepia')}
                className="px-2 py-0.5 rounded border border-current capitalize"
              >
                {readerTheme}
              </button>
            </div>
          </div>

          {/* Paragraphs with Synchronized Highlight */}
          <div className="space-y-6 leading-relaxed flex-1">
            {paragraphs.map((para, idx) => {
              const isCurrent = activeParagraphIndex === idx && (speechState === 'playing' || speechState === 'paused');
              return (
                <p
                  key={idx}
                  onClick={() => {
                    setActiveParagraphIndex(idx);
                    speechService.speak(para);
                  }}
                  className={`cursor-pointer rounded-xl p-3 transition-all duration-200 ${
                    isCurrent
                      ? 'bg-amber-500/20 dark:bg-amber-500/25 border-l-4 border-amber-500 shadow-xs scale-[1.005]'
                      : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {para}
                </p>
              );
            })}
          </div>

          {/* Page Footer Navigation */}
          <div className="border-t border-slate-200/60 dark:border-slate-800/80 pt-6 mt-8 flex items-center justify-between text-xs opacity-75">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1 font-semibold disabled:opacity-30 hover:underline"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <span className="font-mono text-xs">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handleNextPage(false)}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1 font-semibold disabled:opacity-30 hover:underline"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Floating / Sticky Bottom Voice Controller */}
        <div className="sticky bottom-6 z-30">
          <VoiceController
            isPlaying={speechState === 'playing'}
            isPaused={speechState === 'paused'}
            currentParagraphIndex={activeParagraphIndex}
            totalParagraphs={paragraphs.length}
            onPlay={handlePlay}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
            onPrevParagraph={handlePrevParagraph}
            onNextParagraph={handleNextParagraph}
            speed={speed}
            onSpeedChange={handleSpeedChange}
            selectedVoice={selectedVoice}
            onVoiceChange={handleVoiceChange}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </div>

      {/* Pragati Document Assistant Drawer */}
      <DocumentAssistantDrawer
        isOpen={showAssistant}
        onClose={() => setShowAssistant(false)}
        documentText={paragraphs.join('\n\n')}
        documentTitle={docTitle}
        currentPage={currentPage}
      />
    </div>
  );
};
