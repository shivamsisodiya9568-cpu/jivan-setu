import React from 'react';
import {
  Headphones,
  Play,
  Pause,
  Volume2,
  Sparkles,
  BookOpen,
  ChevronRight,
  List
} from 'lucide-react';
import { useReadTriangle } from '../../context/ReadTriangleContext';

export const AudiobookView: React.FC = () => {
  const { documentState, playback, play, pause, setPage } = useReadTriangle();

  return (
    <div className="h-full bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 sm:p-12 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="w-full flex items-center justify-between text-xs text-slate-400 z-10">
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-indigo-400" />
          <span className="font-bold uppercase tracking-wider text-slate-300">Audiobook Mode</span>
        </div>
        <span className="font-mono">Page {playback.currentPageNumber} of {documentState.totalPages}</span>
      </div>

      {/* Center Art Cover & Spoken Sentence Focus */}
      <div className="my-auto max-w-xl w-full text-center space-y-8 z-10">
        
        {/* Book Cover Artwork */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-800 p-1 shadow-2xl shadow-indigo-500/20 flex items-center justify-center group">
          <div className="w-full h-full bg-slate-900/90 backdrop-blur-sm rounded-[22px] p-6 flex flex-col items-center justify-center text-center space-y-3">
            <BookOpen className="w-12 h-12 text-indigo-400 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-xs line-clamp-2 text-slate-200">
              {documentState.fileName}
            </div>
            <div className="text-[10px] text-indigo-300 font-mono">
              {playback.selectedVoice?.name || 'Natural Voice'}
            </div>
          </div>

          {/* Animated Wave Bars while playing */}
          {playback.isPlaying && (
            <div className="absolute -bottom-3 flex items-end gap-1 px-3 py-1 bg-indigo-600 rounded-full shadow-lg">
              <div className="w-1 h-3 bg-white animate-bounce" />
              <div className="w-1 h-4 bg-white animate-bounce delay-75" />
              <div className="w-1 h-2 bg-white animate-bounce delay-150" />
              <div className="w-1 h-5 bg-white animate-bounce delay-100" />
            </div>
          )}
        </div>

        {/* Current Spoken Sentence Focus */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-lg backdrop-blur-md">
          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-2">
            Currently Reading Aloud
          </div>
          <p className="text-base sm:text-lg font-serif italic leading-relaxed text-slate-100">
            "{playback.currentSentenceText || 'Click play to start audiobook reading...'}"
          </p>
        </div>

      </div>

      {/* Bottom Chapter Bar */}
      <div className="w-full pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 z-10">
        <div className="flex items-center gap-2">
          <span>Speed: <strong className="text-white">{playback.speed}x</strong></span>
          <span>•</span>
          <span>Voice: <strong className="text-white">{playback.selectedVoice?.langName}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, playback.currentPageNumber - 1))}
            className="hover:text-white transition-colors"
          >
            Prev Page
          </button>
          <span>/</span>
          <button
            onClick={() => setPage(Math.min(documentState.totalPages, playback.currentPageNumber + 1))}
            className="hover:text-white transition-colors"
          >
            Next Page
          </button>
        </div>
      </div>

    </div>
  );
};
