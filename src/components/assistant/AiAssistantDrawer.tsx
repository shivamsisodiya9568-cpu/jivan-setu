import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  FileText,
  HelpCircle,
  BookMarked,
  Key,
  Volume2,
  Copy,
  Check,
  Loader2,
  ListChecks
} from 'lucide-react';
import { useReadTriangle } from '../../context/ReadTriangleContext';
import { aiAssistantService } from '../../services/aiAssistantService';

export const AiAssistantDrawer: React.FC = () => {
  const {
    documentState,
    isAiDrawerOpen,
    setIsAiDrawerOpen,
    aiMessages,
    askAi,
    generateSummary,
    listenToSummary,
    showToast,
  } = useReadTriangle();

  const [activeTab, setActiveTab] = useState<'qa' | 'summary' | 'notes' | 'settings'>('qa');
  const [questionInput, setQuestionInput] = useState('');
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(aiAssistantService.getApiKey());
  const [copied, setCopied] = useState(false);

  if (!isAiDrawerOpen) return null;

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    const q = questionInput;
    setQuestionInput('');
    await askAi(q);
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const res = await generateSummary();
      setSummaryText(res);
    } catch {
      setSummaryText('Failed to generate summary.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Copied to Clipboard', 'Text copied successfully.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    aiAssistantService.setApiKey(apiKeyInput);
    showToast('API Key Saved', apiKeyInput ? 'Vercel AI SDK key configured.' : 'Offline AI active.', 'success');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>ReadTriangle AI</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                PRO
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
              {documentState.fileName}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAiDrawerOpen(false)}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="p-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('qa')}
          className={`flex-1 py-1.5 rounded-lg font-semibold text-center transition-colors ${
            activeTab === 'qa' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Ask PDF
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-1.5 rounded-lg font-semibold text-center transition-colors ${
            activeTab === 'summary' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-1.5 rounded-lg font-semibold text-center transition-colors ${
            activeTab === 'notes' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Notes
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700`}
          title="AI Settings"
        >
          <Key className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        
        {/* Tab 1: Ask PDF Q&A */}
        {activeTab === 'qa' && (
          <div className="flex flex-col h-full justify-between space-y-4">
            <div className="space-y-3 flex-1 overflow-y-auto">
              {aiMessages.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <HelpCircle className="w-8 h-8 text-indigo-500 mx-auto" />
                  <div className="font-bold text-slate-800 dark:text-slate-200">Ask Anything About Your PDF</div>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    Try asking: "What is this book about?", "Explain chapter 3", or "What are the key findings?"
                  </p>
                </div>
              ) : (
                aiMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl space-y-1 ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white ml-6 font-medium'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mr-6 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-75">
                      <span>{msg.role === 'user' ? 'You' : 'ReadTriangle AI'}</span>
                      {msg.pageNumber && <span>Page {msg.pageNumber}</span>}
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  </div>
                ))
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleAsk} className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <input
                type="text"
                placeholder="Ask your document..."
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Document Summary & Listen to Summary */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2"
              >
                {isGeneratingSummary ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generate Summary</span>
              </button>

              {summaryText && (
                <button
                  onClick={listenToSummary}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen to Summary</span>
                </button>
              )}
            </div>

            {summaryText && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Generated AI Summary</span>
                  <button onClick={() => handleCopy(summaryText)} className="hover:text-white">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
                  {summaryText}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Study Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-3">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <ListChecks className="w-4 h-4 text-indigo-500" /> Extracted Key Takeaways
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2 text-slate-700 dark:text-slate-300">
              {documentState.pages.slice(0, 3).map((p, idx) => (
                <div key={`note-${idx}`} className="pb-2 border-b border-slate-200 dark:border-slate-700 last:border-0">
                  <div className="font-semibold text-indigo-600 dark:text-indigo-400">Page {p.pageNumber} Takeaway</div>
                  <div className="text-[11px] font-serif mt-0.5">"{p.sentences[0] || p.cleanedText.slice(0, 100)}..."</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: AI Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-3">
            <div className="font-bold text-slate-800 dark:text-slate-200">Vercel AI SDK Engine Config</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              ReadTriangle includes an offline NLP engine by default. Optionally paste your Vercel AI / Gemini API key for advanced synthesis.
            </p>
            <form onSubmit={handleSaveApiKey} className="space-y-2">
              <input
                type="password"
                placeholder="Paste Vercel AI / Gemini API Key"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs"
              >
                Save API Key
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
