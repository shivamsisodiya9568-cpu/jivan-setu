import React, { useState } from 'react';
import { 
  AlertCircle, 
  AlertOctagon, 
  AlertTriangle, 
  Brain, 
  Droplet, 
  Flame, 
  Globe2, 
  HeartPulse, 
  PhoneCall, 
  Search, 
  ShieldAlert, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Zap 
} from 'lucide-react';
import { FIRST_AID_PROTOCOLS, FirstAidItem } from '../data/firstAidData';
import { useJivanSetu } from '../context/JivanSetuContext';
import { SpeechService } from '../services/speechService';

export const FirstAidGuidancePage: React.FC = () => {
  const { language, setLanguage, addToast } = useJivanSetu();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const categories = ['ALL', 'Cardiovascular', 'Trauma', 'Airway', 'Neurological', 'Orthopedic', 'Toxicology'];

  const filtered = FIRST_AID_PROTOCOLS.filter(item => {
    const title = language === 'hi' ? item.titleHi : item.titleEn;
    const summary = language === 'hi' ? item.summaryHi : item.summaryEn;
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) || summary.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleReadAloud = (item: FirstAidItem) => {
    if (speakingId === item.id) {
      SpeechService.stopSpeaking();
      setSpeakingId(null);
    } else {
      const title = language === 'hi' ? item.titleHi : item.titleEn;
      const steps = language === 'hi' ? item.immediateStepsHi : item.immediateStepsEn;
      const textToRead = `${title}. Immediate action steps: ${steps.join('. ')}`;
      SpeechService.speakText(textToRead, language);
      setSpeakingId(item.id);
      addToast('info', 'Voice Readout Active', `Reading instructions for ${title}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Emergency Hotline Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-4 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-300 shrink-0 animate-pulse" />
            <span>
              <strong>Life-Threatening Emergency?</strong> Call India’s National Emergency Hotline <strong>112</strong> or Medical Ambulance <strong>108</strong> immediately.
            </span>
          </div>
          <a
            href="tel:112"
            className="shrink-0 px-4 py-1.5 rounded-xl bg-white text-red-700 font-extrabold text-xs flex items-center gap-1.5 shadow"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>DIAL 112</span>
          </a>
        </div>

        {/* Header & Controls */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-bold mb-2">
                <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
                <span>Medically Reviewed Educational Protocols</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 dark:text-white">
                {language === 'hi' ? 'आपातकालीन प्राथमिक चिकित्सा गाइड' : 'Emergency First-Aid Guidance'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {language === 'hi' 
                  ? 'सामान्य जीवन-घातक स्थितियों के लिए त्वरित और सुरक्षित प्राथमिक सहायता निर्देश।'
                  : 'Actionable, clear guidance for common emergencies while professional emergency services are en route.'}
              </p>
            </div>

            {/* Language switch */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Globe2 className="w-4 h-4 text-blue-500" />
                <span>{language === 'en' ? 'Switch to हिंदी' : 'Switch to English'}</span>
              </button>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={language === 'hi' ? 'प्राथमिक उपचार खोजें...' : 'Search protocols (e.g. CPR, bleeding, burn)...'}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-navy-700 text-xs bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedCategory === cat
                      ? 'bg-emergency-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* First Aid Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => {
            const title = language === 'hi' ? item.titleHi : item.titleEn;
            const summary = language === 'hi' ? item.summaryHi : item.summaryEn;
            const steps = language === 'hi' ? item.immediateStepsHi : item.immediateStepsEn;
            const avoid = language === 'hi' ? item.whatToAvoidHi : item.whatToAvoidEn;
            const when112 = language === 'hi' ? item.whenToCall112Hi : item.whenToCall112En;
            const isSpeaking = speakingId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        {item.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-navy-950 dark:text-white">
                        {title}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleReadAloud(item)}
                      title="Listen via Voice Readout"
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition ${
                        isSpeaking
                          ? 'bg-red-500 text-white border-red-600 animate-pulse'
                          : 'bg-slate-50 dark:bg-navy-950 border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {summary}
                  </p>

                  {/* Immediate Action Steps */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide block">
                      {language === 'hi' ? 'तत्काल प्राथमिक कदम:' : 'Immediate Action Steps:'}
                    </span>
                    <div className="space-y-2">
                      {steps.map((st, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-snug">
                          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What NOT to do */}
                  <div className="p-3.5 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 space-y-1.5">
                    <span className="text-[11px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wide block">
                      {language === 'hi' ? 'क्या न करें (सावधानियां):' : 'What to AVOID:'}
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                      {avoid.map((av, i) => (
                        <li key={i} className="leading-snug">{av}</li>
                      ))}
                    </ul>
                  </div>

                  {/* When Professional Help is Urgent */}
                  <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-1.5">
                    <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide block">
                      {language === 'hi' ? '112 पर तुरंत कब कॉल करें:' : 'When 112 Dispatch is Essential:'}
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                      {when112.map((wh, i) => (
                        <li key={i} className="leading-snug">{wh}</li>
                      ))}
                    </ul>
                  </div>

                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-navy-800">
                  <span>Educational guideline</span>
                  <a href="tel:112" className="text-emergency-600 font-bold hover:underline">
                    Emergency Call: 112
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
