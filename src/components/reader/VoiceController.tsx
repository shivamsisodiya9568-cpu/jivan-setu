import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Mic, 
  Sparkles,
  Gauge
} from 'lucide-react';
import { speechService, SpeechVoiceOption, SpeechState } from '../../services/speechService';

interface VoiceControllerProps {
  isPlaying: boolean;
  isPaused: boolean;
  currentParagraphIndex: number;
  totalParagraphs: number;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onPrevParagraph: () => void;
  onNextParagraph: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  selectedVoice: string;
  onVoiceChange: (voiceName: string) => void;
  currentPage: number;
  totalPages: number;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  isPlaying,
  isPaused,
  currentParagraphIndex,
  totalParagraphs,
  onPlay,
  onPause,
  onResume,
  onStop,
  onPrevParagraph,
  onNextParagraph,
  speed,
  onSpeedChange,
  selectedVoice,
  onVoiceChange,
  currentPage,
  totalPages,
}) => {
  const [voices, setVoices] = useState<SpeechVoiceOption[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  useEffect(() => {
    const list = speechService.getVoices();
    setVoices(list);

    // Refresh if browser loads voices asynchronously
    const timer = setTimeout(() => {
      const updated = speechService.getVoices();
      if (updated.length > 0) setVoices(updated);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      onPause();
    } else if (isPaused) {
      onResume();
    } else {
      onPlay();
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      speechService.setVolume(1.0);
      setIsMuted(false);
    } else {
      speechService.setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-xl p-3 sm:p-4 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left: Info & Progress */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isPlaying ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span>Page {currentPage} of {totalPages}</span>
                {isPlaying && (
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="w-0.5 h-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 h-2 bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-3 bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Paragraph {currentParagraphIndex + 1} of {Math.max(1, totalParagraphs)}
              </div>
            </div>
          </div>

          {/* Quick Voice Settings Trigger for Mobile */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="sm:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onPrevParagraph}
            disabled={currentParagraphIndex <= 0}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-dark-hover disabled:opacity-40 transition-colors"
            title="Previous Paragraph"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={handleTogglePlay}
            className={`px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : isPaused ? (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Resume</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Read Aloud</span>
              </>
            )}
          </button>

          <button
            onClick={onStop}
            disabled={!isPlaying && !isPaused}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-dark-hover disabled:opacity-40 transition-colors"
            title="Stop Reading"
          >
            <Square className="w-4 h-4" />
          </button>

          <button
            onClick={onNextParagraph}
            disabled={currentParagraphIndex >= totalParagraphs - 1}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-dark-hover disabled:opacity-40 transition-colors"
            title="Next Paragraph"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Voice & Speed Settings */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-dark-surface p-1 rounded-xl border border-slate-200 dark:border-dark-border">
            <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={speed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              className="text-xs font-semibold bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {speedOptions.map((s) => (
                <option key={s} value={s} className="bg-white dark:bg-dark-card">
                  {s}x
                </option>
              ))}
            </select>
          </div>

          {/* Voice Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-dark-surface p-1 rounded-xl border border-slate-200 dark:border-dark-border max-w-[170px]">
            <Mic className="w-3.5 h-3.5 text-slate-400 ml-1.5 shrink-0" />
            <select
              value={selectedVoice}
              onChange={(e) => onVoiceChange(e.target.value)}
              className="text-xs bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer truncate pr-1"
            >
              {voices.length === 0 ? (
                <option value="">Default Voice</option>
              ) : (
                voices.map((v) => (
                  <option key={v.name} value={v.name} className="bg-white dark:bg-dark-card">
                    {v.name.substring(0, 22)} ({v.lang})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-dark-hover transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Settings Drawer Row */}
      {showSettings && (
        <div className="sm:hidden mt-3 pt-3 border-t border-slate-100 dark:border-dark-border flex flex-col gap-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-500">Speed:</span>
            <div className="flex gap-1 overflow-x-auto py-1">
              {speedOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                    speed === s
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-dark-surface text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-500">Voice:</span>
            <select
              value={selectedVoice}
              onChange={(e) => onVoiceChange(e.target.value)}
              className="text-xs bg-slate-100 dark:bg-dark-surface p-1.5 rounded-lg border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 focus:outline-none flex-1 max-w-[200px]"
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
