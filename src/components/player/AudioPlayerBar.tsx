import React, { useState } from 'react';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Download,
  Sliders,
  Sparkles,
  Globe,
  Loader2
} from 'lucide-react';
import { useReadTriangle } from '../../context/ReadTriangleContext';
import { VoiceSelectorModal } from './VoiceSelectorModal';
import { VoiceSettingsModal } from './VoiceSettingsModal';

export const AudioPlayerBar: React.FC = () => {
  const {
    documentState,
    playback,
    play,
    pause,
    resume,
    stop,
    nextSection,
    prevSection,
    setPage,
    setSpeed,
    setVoice,
    downloadAudio,
  } = useReadTriangle();

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  if (!documentState.file) return null;

  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-md transition-all p-3 sm:p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left: Document Info & Voice Badge */}
          <div className="flex items-center gap-3 w-full md:w-1/4 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center shrink-0 shadow-md">
              <span className="text-base">{playback.selectedVoice?.flag || '🎙️'}</span>
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                {documentState.fileName}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline truncate max-w-[130px]"
                >
                  {playback.selectedVoice?.name || 'Select Voice'}
                </button>
                <span>•</span>
                <span>Page {playback.currentPageNumber} of {documentState.totalPages}</span>
              </div>
            </div>
          </div>

          {/* Center: Playback Controls & Progress Bar */}
          <div className="flex-1 w-full max-w-xl flex flex-col items-center gap-2">
            
            {/* Buttons Row */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevSection}
                disabled={playback.currentPageNumber <= 1}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 transition-colors"
                title="Previous Page"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {playback.isPlaying ? (
                <button
                  onClick={pause}
                  className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
                  title="Pause Speech"
                >
                  <Pause className="w-5 h-5 fill-current" />
                </button>
              ) : (
                <button
                  onClick={play}
                  className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 ml-1"
                  title="Play Natural Speech"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
              )}

              <button
                onClick={stop}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Stop Playback"
              >
                <Square className="w-4 h-4" />
              </button>

              <button
                onClick={nextSection}
                disabled={playback.currentPageNumber >= documentState.totalPages}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 transition-colors"
                title="Next Page"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Slider */}
            <div className="w-full flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <span>Pg {playback.currentPageNumber}</span>
              <input
                type="range"
                min="1"
                max={documentState.totalPages || 1}
                value={playback.currentPageNumber}
                onChange={(e) => setPage(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <span>{playback.audioProgressPercent}%</span>
            </div>
          </div>

          {/* Right: Voice Settings, Speed Selector & Download Audio */}
          <div className="flex items-center justify-end gap-2 w-full md:w-1/4">
            
            {/* Speed Pill Selector */}
            <select
              value={playback.speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="px-2 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              {speeds.map(s => (
                <option key={`spd-opt-${s}`} value={s}>{s}x Speed</option>
              ))}
            </select>

            {/* Voice Settings Button */}
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Voice & Cleanup Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Download Audio Button */}
            <button
              onClick={downloadAudio}
              disabled={playback.isGeneratingAudio}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs rounded-xl hover:bg-slate-800 dark:hover:bg-white transition-colors"
              title="Download Speech Audio File"
            >
              {playback.isGeneratingAudio ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>

        </div>
      </div>

      {/* Voice Selection Modal */}
      <VoiceSelectorModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        selectedVoice={playback.selectedVoice}
        onSelectVoice={setVoice}
        speed={playback.speed}
      />

      {/* Settings Modal */}
      <VoiceSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </>
  );
};
