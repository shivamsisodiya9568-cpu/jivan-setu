import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Volume2,
  Sparkles,
  ShieldCheck,
  Globe,
  FileText,
  Headphones,
  CheckCircle2,
  Play,
  Pause,
  ArrowRight,
  HelpCircle,
  ScanText,
  BookOpen,
  Sliders,
  Zap
} from 'lucide-react';
import { PdfUploader } from '../components/uploader/PdfUploader';
import { SeoHead } from '../components/common/SeoHead';
import { useReadTriangle } from '../context/ReadTriangleContext';
import { speechSynthesisService } from '../services/speechSynthesisService';

export const HomePage: React.FC = () => {
  const { documentState } = useReadTriangle();
  const navigate = useNavigate();
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const demoVoices = [
    { id: 'hi', name: 'Hindi Natural', langName: 'Hindi', flag: '🇮🇳', text: 'नमस्कार, यह रीडट्रायंगल की स्वाभाविक हिंदी आवाज़ का एक नमूना है।' },
    { id: 'en', name: 'English Neural', langName: 'English', flag: '🇺🇸', text: 'Hello, welcome to ReadTriangle. Turn your documents into natural voices.' },
    { id: 'es', name: 'Spanish Warm', langName: 'Spanish', flag: '🇪🇸', text: 'Hola, bienvenido a ReadTriangle. Escucha tus documentos en voz alta.' },
    { id: 'ja', name: 'Japanese Calm', langName: 'Japanese', flag: '🇯🇵', text: 'こんにちは、ReadTriangleへようこそ。PDF文書を自然な音声でお聴きいただけます。' },
    { id: 'zh', name: 'Chinese Professional', langName: 'Chinese', flag: '🇨🇳', text: '您好，欢迎使用ReadTriangle。将您的PDF转换为自然语音。' },
    { id: 'fr', name: 'French Natural', langName: 'French', flag: '🇫🇷', text: 'Bonjour et bienvenue sur ReadTriangle. Écoutez vos documents PDF.' },
    { id: 'de', name: 'German Professional', langName: 'German', flag: '🇩🇪', text: 'Hallo und willkommen bei ReadTriangle. Wandeln Sie PDF-Dateien in Sprache um.' },
    { id: 'ko', name: 'Korean Warm', langName: 'Korean', flag: '🇰🇷', text: '안녕하세요. ReadTriangle에 오신 것을 환영합니다. PDF 문서를 음성으로 들어보세요.' },
  ];

  const handlePreviewVoice = (id: string, text: string) => {
    setPlayingVoiceId(id);
    speechSynthesisService.speakSentence(text, {
      onEnd: () => setPlayingVoiceId(null),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-slate-100 transition-colors">
      <SeoHead
        title="Turn Every Page Into a Voice"
        description="ReadTriangle is a premium multilingual PDF reading platform that allows users to upload readable PDFs and listen to contents as natural, human-like synthetic speech."
        canonicalUrl="https://readtriangle.com/"
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-sm animate-in fade-in duration-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Premium Multilingual PDF Speech Platform</span>
        </div>

        {/* Main Title & Description */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Turn Every Page <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Into a Natural Voice.
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Upload books, study material, research articles, or scanned PDFs and listen to them as natural, human-like neural speech.
          </p>
        </div>

        {/* PDF Uploader Container */}
        <div className="max-w-3xl mx-auto pt-4">
          <PdfUploader />
          {documentState.file && (
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/app')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
              >
                <span>Open in Studio Reader</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Client-Side Privacy Architecture</span>
          <span className="flex items-center gap-1.5"><ScanText className="w-4 h-4 text-amber-500" /> Scanned PDF OCR Support</span>
          <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-indigo-500" /> 10+ Native Languages (Hindi, English, Spanish...)</span>
        </div>
      </section>

      {/* Multilingual Voice Demos */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Listen to Natural Multilingual AI Voices
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Click preview to test neural pronunciation across languages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {demoVoices.map(v => (
              <div
                key={v.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between space-x-3 hover:border-indigo-400 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{v.flag}</span>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{v.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{v.langName}</div>
                  </div>
                </div>

                <button
                  onClick={() => handlePreviewVoice(v.id, v.text)}
                  className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors ${
                    playingVoiceId === v.id
                      ? 'bg-indigo-600 text-white animate-pulse'
                      : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200'
                  }`}
                  title="Preview Voice"
                >
                  {playingVoiceId === v.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Product Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Engineered Like Premium Software
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A complete suite for reading, listening, and studying documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Natural Neural Speech</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Convert text into natural, pleasant voices with adjustable playback speeds (0.5x to 2x) and sentence boundaries.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <ScanText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Scanned PDF OCR Engine</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tesseract OCR automatically recognizes text from scanned image pages and parses them into natural speech.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Ask Your PDF & AI Summaries</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ask questions about your document, generate chapter summaries, and click "Listen to Summary" to hear them aloud.
            </p>
          </div>

        </div>
      </section>

      {/* Comprehensive FAQ Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500">Everything you need to know about ReadTriangle</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">What is ReadTriangle?</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                ReadTriangle is a premium multilingual PDF reading platform that allows users to upload readable PDFs and listen to contents as natural, human-like synthetic speech.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Does ReadTriangle support scanned PDFs?</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes! ReadTriangle includes an integrated Tesseract.js OCR engine that recognizes text from scanned image pages and converts it to speech.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">What languages are supported?</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                ReadTriangle supports Hindi, English, Spanish, Japanese, Chinese, French, German, Italian, Portuguese, Korean, Russian, Arabic, and more.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Are my PDFs stored on your servers?</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                No. ReadTriangle uses a client-side architecture where PDF rendering, OCR, and speech generation run inside your browser sandbox for privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
