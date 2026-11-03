import React, { useState, useRef, useEffect } from 'react';
import { 
  AlertCircle, 
  AlertOctagon, 
  Bot, 
  Check, 
  HelpCircle, 
  Mic, 
  PhoneCall, 
  Send, 
  ShieldAlert, 
  Sparkles, 
  User 
} from 'lucide-react';
import { useJivanSetu } from '../context/JivanSetuContext';
import { 
  AI_SYSTEM_DISCLAIMER, 
  AssistantMessage, 
  processAssistantQuery 
} from '../services/aiEmergencyAssistant';
import { FIRST_AID_PROTOCOLS } from '../data/firstAidData';
import { SpeechService } from '../services/speechService';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { Link } from 'react-router-dom';

export const AiAssistantPage: React.FC = () => {
  const { language, addToast } = useJivanSetu();
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: language === 'hi'
        ? `नमस्ते! मैं **जीवन सेतु (JIVAN SETU)** का एआई आपातकालीन सहायक हूँ।\n\nकृपया मरीज की स्थिति बताएं (जैसे: सांस नहीं ले रहा, छाती में तेज दर्द, भारी रक्तस्राव आदि)। मैं तुरंत सत्यापित प्राथमिक उपचार निर्देश और अस्पताल समन्वय में सहायता प्रदान करूंगा।\n\n⚠️ **जीवन-घातक स्थिति में तुरंत 112 डायल करें।**`
        : `Hello! I am the **JIVAN SETU** AI Emergency Assistant.\n\nPlease describe the emergency or symptoms (e.g. unresponsive person, severe chest pain, road collision bleeding). I will organize preliminary findings and provide verified first-aid guidance.\n\n⚠️ **In life-threatening situations, DIAL 112 IMMEDIATELY.**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: language === 'hi'
        ? ['मरीज सांस नहीं ले रहा (सीपीआर)', 'खून बहना कैसे रोकें?', 'संदिग्ध दिल का दौरा', 'गले में कुछ अटक गया']
        : ['Person is not breathing (CPR)', 'Severe bleeding wound', 'Suspected heart attack', 'Choking Heimlich']
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || loading) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await processAssistantQuery(q, messages, language);
      setMessages(prev => [...prev, response]);
    } catch {
      addToast('danger', 'Assistant Error', 'Unable to process query. Please dial 112 directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) return;
    const controller = SpeechService.startDictation(
      language,
      (text) => {
        setInputQuery(text);
        handleSend(text);
        setIsListening(false);
      },
      (err) => {
        addToast('warning', 'Voice Input', err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
    if (controller) {
      setIsListening(true);
      addToast('info', 'Listening...', 'Speak emergency symptoms clearly into microphone.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-4 flex flex-col h-[calc(100vh-140px)]">

        {/* Emergency Hotline Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-3.5 text-white shadow-sm flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 text-xs">
            <ShieldAlert className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
            <span>
              <strong>Emergency Assistance Disclaimer:</strong> AI assistance is informational only. Call <strong>112</strong> for immediate medical dispatch.
            </span>
          </div>
          <a
            href="tel:112"
            className="shrink-0 px-3 py-1 rounded-xl bg-white text-red-700 font-extrabold text-xs flex items-center gap-1 shadow"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>112</span>
          </a>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col overflow-hidden">
          
          {/* Top Bar */}
          <div className="p-4 border-b border-slate-100 dark:border-navy-800 flex items-center justify-between bg-slate-50/50 dark:bg-navy-950/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-navy-950 dark:text-white flex items-center gap-2">
                  <span>JIVAN SETU Emergency Clinical Assistant</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    SBAR Triage Engine
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  Strictly medically reviewed first-aid guidance • Zero unverified medications
                </p>
              </div>
            </div>

            <Link
              to="/report"
              className="px-3 py-1.5 rounded-xl bg-emergency-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-emergency-700"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>File Incident Report</span>
            </Link>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-emergency-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                    m.sender === 'user'
                      ? 'bg-emergency-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-navy-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-navy-800'
                  }`}
                >
                  {/* Priority Tag if detected */}
                  {m.priorityHint && (
                    <div className="pb-1">
                      <PriorityBadge priority={m.priorityHint} size="sm" />
                    </div>
                  )}

                  {/* Formatted Markdown-like text */}
                  <div className="whitespace-pre-line">
                    {m.text}
                  </div>

                  {/* Suggested Quick Questions */}
                  {m.suggestedQuestions && m.suggestedQuestions.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 dark:border-navy-800 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Suggested Actions / Questions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.suggestedQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(q)}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold hover:border-emergency-500 transition"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 text-right pt-1">
                    {m.timestamp} {m.isSimulation && '• Simulated Model'}
                  </div>
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-navy-800 text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-emergency-600 text-white flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-navy-950 text-xs text-slate-500 animate-pulse">
                  Analyzing symptoms against clinical safety protocols...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-navy-800 bg-white dark:bg-navy-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center transition ${
                  isListening
                    ? 'bg-red-500 text-white border-red-600 animate-pulse'
                    : 'bg-slate-50 dark:bg-navy-950 border-slate-300 dark:border-navy-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
                title="Dictate symptoms via Voice"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={language === 'hi' ? 'लक्षण या आपातकालीन स्थिति लिखें (जैसे: सांस नहीं ले रहा)...' : 'Describe symptoms or situation (e.g. unresponsive, chest pain, choking)...'}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 text-xs bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emergency-500"
              />

              <button
                type="submit"
                disabled={!inputQuery.trim() || loading}
                className="px-4 py-2.5 rounded-xl bg-emergency-600 hover:bg-emergency-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
