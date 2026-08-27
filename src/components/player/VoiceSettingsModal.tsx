import React from 'react';
import { X, Sliders, Volume2, Gauge, Zap, Check } from 'lucide-react';
import { useReadTriangle } from '../../context/ReadTriangleContext';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    playback,
    setSpeed,
    setVolume,
    cleanupSettings,
    updateCleanupSettings,
  } = useReadTriangle();

  if (!isOpen) return null;

  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/80">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Voice & Text Cleanup Settings
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6 text-xs">
          
          {/* Playback Speed */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Gauge className="w-4 h-4 text-indigo-500" /> Reading Speed</span>
              <span className="text-indigo-600 font-mono">{playback.speed}x</span>
            </label>
            <div className="grid grid-cols-7 gap-1">
              {speeds.map(s => (
                <button
                  key={`spd-${s}`}
                  onClick={() => setSpeed(s)}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    playback.speed === s
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Volume2 className="w-4 h-4 text-indigo-500" /> Speech Volume</span>
              <span className="text-indigo-600 font-mono">{Math.round(playback.volume * 100)}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={playback.volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          {/* Text Cleanup Settings */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Automatic Text Cleanup Controls
            </div>

            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Remove Page Numbers</span>
              <input
                type="checkbox"
                checked={cleanupSettings.removePageNumbers}
                onChange={(e) => updateCleanupSettings({ removePageNumbers: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Remove Repeated Headers & Footers</span>
              <input
                type="checkbox"
                checked={cleanupSettings.removeHeaders}
                onChange={(e) => updateCleanupSettings({ removeHeaders: e.target.checked, removeFooters: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300 font-medium">Fix Hyphenated Words</span>
              <input
                type="checkbox"
                checked={cleanupSettings.fixHyphenation}
                onChange={(e) => updateCleanupSettings({ fixHyphenation: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>
          </div>

        </div>
      </div>
    </div>
  );
};
