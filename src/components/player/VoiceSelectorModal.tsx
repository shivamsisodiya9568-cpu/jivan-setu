import React, { useState } from 'react';
import {
  X,
  Volume2,
  Check,
  Search,
  Filter,
  Sparkles,
  Globe,
  UserCheck
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
  const [genderFilter, setGenderFilter] = useState<'all' | VoiceGender>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | VoiceCategory>('all');
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  if (!isOpen) return null;

  const allVoices = speechSynthesisService.getVoices();

  const filteredVoices = allVoices.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.langName.toLowerCase().includes(search.toLowerCase());
    const matchesGender = genderFilter === 'all' || v.gender === genderFilter;
    const matchesCategory = categoryFilter === 'all' || v.category === categoryFilter;
    return matchesSearch && matchesGender && matchesCategory;
  });

  const handlePreview = (voice: VoiceOption, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewingVoiceId(voice.id);
    speechSynthesisService.previewVoice(voice, speed);
    setTimeout(() => setPreviewingVoiceId(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Select Natural AI Voice
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose from available Male & Female Neural Text-to-Speech voices
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
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search language or voice name (e.g. Hindi, English, Female)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Gender & Tone Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            
            {/* Gender Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setGenderFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${genderFilter === 'all' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
              >
                All Genders
              </button>
              <button
                onClick={() => setGenderFilter('female')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${genderFilter === 'female' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Female ♀
              </button>
              <button
                onClick={() => setGenderFilter('male')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${genderFilter === 'male' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
              >
                Male ♂
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 hidden sm:inline">Tone:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="all">All Tones</option>
                <option value="natural">Natural</option>
                <option value="warm">Warm</option>
                <option value="deep">Deep</option>
                <option value="calm">Calm</option>
                <option value="professional">Professional</option>
              </select>
            </div>

          </div>
        </div>

        {/* Voice List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredVoices.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No matching voices found. Try adjusting your filters or search terms.
            </div>
          ) : (
            filteredVoices.map((voice) => {
              const isSelected = selectedVoice?.id === voice.id || selectedVoice?.name === voice.name;
              const isPreviewing = previewingVoiceId === voice.id;

              return (
                <div
                  key={voice.id}
                  onClick={() => {
                    onSelectVoice(voice);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-white shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{voice.flag}</span>
                    <div>
                      <div className="font-bold text-xs flex items-center gap-2">
                        <span>{voice.name}</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">
                          {voice.gender} • {voice.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {voice.langName} ({voice.lang})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handlePreview(voice, e)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isPreviewing
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPreviewing ? 'Playing...' : 'Preview Voice'}</span>
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
