import React, { useState } from 'react';
import {
  List,
  BookOpen,
  Volume2,
  Sparkles,
  ChevronRight,
  Layers,
  FileText
} from 'lucide-react';
import { useReadTriangle } from '../../context/ReadTriangleContext';

export const TextReaderPane: React.FC = () => {
  const {
    documentState,
    playback,
    jumpToSentence,
    setPage,
  } = useReadTriangle();

  const [activeTab, setActiveTab] = useState<'text' | 'toc'>('text');

  const currentPageData = documentState.pages[playback.currentPageNumber - 1];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      
      {/* Header Tabs */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/80 text-xs">
        <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'text' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Extracted Text
          </button>
          <button
            onClick={() => setActiveTab('toc')}
            className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'toc' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <List className="w-3.5 h-3.5" /> Table of Contents ({documentState.chapters.length})
          </button>
        </div>

        <div className="text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
          Page {playback.currentPageNumber} of {documentState.totalPages}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8">
        {activeTab === 'toc' ? (
          /* Table of Contents View */
          <div className="space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider text-slate-400 mb-4">
              Document Chapters & Headings
            </h3>
            {documentState.chapters.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No structural chapters found in this PDF.
              </div>
            ) : (
              documentState.chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setPage(ch.pageNumber);
                    setActiveTab('text');
                  }}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                      {ch.pageNumber}
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                      {ch.title}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </button>
              ))
            )}
          </div>
        ) : (
          /* Extracted Text with Sentence Highlighting */
          <div className="space-y-6 max-w-3xl mx-auto">
            
            {/* Page Title & Status Header */}
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-slate-900 dark:text-white">Page {playback.currentPageNumber}</span>
              <span>{currentPageData?.sentences.length || 0} Sentence(s) • Click any sentence to read</span>
            </div>

            {/* Sentences Container */}
            {!currentPageData || currentPageData.sentences.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                No readable text found on Page {playback.currentPageNumber}.
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none space-y-3 font-serif leading-relaxed text-base sm:text-lg text-slate-800 dark:text-slate-200">
                {currentPageData.sentences.map((sentText, sIdx) => {
                  const isCurrentSentence =
                    playback.currentPageNumber === (playback.currentPageNumber) &&
                    playback.currentSentenceIndex === sIdx &&
                    playback.isPlaying;

                  return (
                    <span
                      key={`sent-${sIdx}`}
                      onClick={() => jumpToSentence(playback.currentPageNumber, sIdx)}
                      className={`inline cursor-pointer rounded px-1 py-0.5 transition-all duration-150 ${
                        isCurrentSentence
                          ? 'bg-amber-300 dark:bg-indigo-900/80 text-slate-950 dark:text-white font-semibold shadow-sm underline decoration-indigo-500 underline-offset-4 ring-2 ring-indigo-500/50'
                          : 'hover:bg-indigo-50 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      {sentText}{' '}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
