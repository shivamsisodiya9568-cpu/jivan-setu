import React, { useState } from 'react';
import {
  X,
  Volume2,
  Check,
  Search,
  Sparkles,
  Layers,
  Cpu,
  Smartphone
} from 'lucide-react';
import { VoiceOption, VoiceGender, VoiceCategory } from '../../types/reader';
import { speechSynthesisService } from '../../services/speechSynthesisService';

interface VoiceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVoice: VoiceOption | null;
  onSelectVoice: (voice: VoiceOption) => void;
  speed: number;
}

export const VoiceSelectorModal: React.FC<VoiceSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedVoice,
  onSelectVoice,
  speed,
}) => {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<'all' | 'us' | 'gb' | 'au' | 'in'>('all');
  const [engineFilter, setEngineFilter] = useState<'all' | 'neural' | 'browser'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | VoiceGender>('all');
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  if (!isOpen) return null;

  const allVoices = speechSynthesisService.getVoices();

  const filteredVoices = allVoices.filter(v => {
    // Search match
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.langName.toLowerCase().includes(search.toLowerCase()) ||
      v.lang.toLowerCase().includes(search.toLowerCase());

    // Region match
    const langLower = v.lang.toLowerCase();
    let matchesRegion = true;
    if (regionFilter === 'us') matchesRegion = langLower.includes('us') || langLower === 'en';
    if (regionFilter === 'gb') matchesRegion = langLower.includes('gb') || langLower.includes('uk');
    if (regionFilter === 'au') matchesRegion = langLower.includes('au');
    if (regionFilter === 'in') matchesRegion = langLower.includes('in');

    // Engine match
    const matchesEngine = engineFilter === 'all' || v.provider === engineFilter;

    // Gender match
    const matchesGender = genderFilter === 'all' || v.gender === genderFilter;

    return matchesSearch && matchesRegion && matchesEngine && matchesGender;
  });

  const handlePreview = (voice: VoiceOption, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewingVoiceId(voice.id);
    speechSynthesisService.previewVoice(voice, speed);
    setTimeout(() => setPreviewingVoiceId(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>Select English AI Voice</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  English Only
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Studio Neural AI narration & device voices for long-form reading
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search voice by name or style (e.g. Aria, Oliver, British, Deep)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs font-semibold">
            <button
              onClick={() => setRegionFilter('all')}
              className={`px-3 py-1 rounded-lg shrink-0 transition-colors ${
                regionFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Regions 🌐
            </button>
            <button
              onClick={() => setRegionFilter('us')}
              className={`px-3 py-1 rounded-lg shrink-0 transition-colors ${
                regionFilter === 'us'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              US 🇺🇸
            </button>
            <button
              onClick={() => setRegionFilter('gb')}
              className={`px-3 py-1 rounded-lg shrink-0 transition-colors ${
                regionFilter === 'gb'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              UK 🇬🇧
            </button>
            <button
              onClick={() => setRegionFilter('au')}
              className={`px-3 py-1 rounded-lg shrink-0 transition-colors ${
                regionFilter === 'au'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Australia 🇦🇺
            </button>
            <button
              onClick={() => setRegionFilter('in')}
              className={`px-3 py-1 rounded-lg shrink-0 transition-colors ${
                regionFilter === 'in'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              India 🇮🇳
            </button>
          </div>

          {/* Engine & Gender Pill Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            
            {/* Engine Type Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setEngineFilter('all')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${engineFilter === 'all' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                All Engines
              </button>
              <button
                onClick={() => setEngineFilter('neural')}
                className={`px-2 py-0.5 rounded-md font-medium flex items-center gap-1 transition-colors ${engineFilter === 'neural' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                <Cpu className="w-3 h-3 text-indigo-500" /> Neural Studio
              </button>
              <button
                onClick={() => setEngineFilter('browser')}
                className={`px-2 py-0.5 rounded-md font-medium flex items-center gap-1 transition-colors ${engineFilter === 'browser' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                <Smartphone className="w-3 h-3 text-slate-400" /> Device (Offline)
              </button>
            </div>

            {/* Gender Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setGenderFilter('all')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${genderFilter === 'all' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                All
              </button>
              <button
                onClick={() => setGenderFilter('female')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${genderFilter === 'female' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Female ♀
              </button>
              <button
                onClick={() => setGenderFilter('male')}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${genderFilter === 'male' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Male ♂
              </button>
            </div>

          </div>
        </div>

        {/* Voice Cards List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
          {filteredVoices.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No matching English voices found. Try adjusting your filters.
            </div>
          ) : (
            filteredVoices.map((voice) => {
              const isSelected = selectedVoice?.id === voice.id || (selectedVoice?.voiceURI && selectedVoice?.voiceURI === voice.voiceURI);
              const isPreviewing = previewingVoiceId === voice.id;

              return (
                <div
                  key={voice.id}
                  onClick={() => {
                    onSelectVoice(voice);
                    onClose();
                  }}
                  className={`p-3 sm:p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-white shadow-sm ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-2xl shrink-0">{voice.flag}</span>
                    <div className="overflow-hidden">
                      <div className="font-bold text-xs sm:text-sm flex items-center gap-2 truncate">
                        <span className="truncate">{voice.name}</span>
                        {voice.provider === 'neural' ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shrink-0">
                            ✨ Neural AI
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                            Device
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{voice.langName}</span>
                        <span>•</span>
                        <span className="capitalize">{voice.gender}</span>
                        <span>•</span>
                        <span className="capitalize">{voice.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handlePreview(voice, e)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isPreviewing
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPreviewing ? 'Playing...' : 'Preview'}</span>
                    </button>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
