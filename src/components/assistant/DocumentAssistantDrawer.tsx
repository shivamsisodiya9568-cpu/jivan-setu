import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  BookMarked, 
  ListChecks, 
  HelpCircle, 
  Lightbulb, 
  Copy, 
  Check, 
  Key, 
  ShieldCheck, 
  Send,
  Loader2,
  FileText
} from 'lucide-react';
import { documentAssistantService } from '../../services/documentAssistantService';
import { useToast } from '../../context/ToastContext';

interface DocumentAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  documentText: string;
  documentTitle?: string;
  currentPage?: number;
}

export const DocumentAssistantDrawer: React.FC<DocumentAssistantDrawerProps> = ({
  isOpen,
  onClose,
  documentText,
  documentTitle = 'Document',
  currentPage = 1,
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<string>('summarize');
  const [userQuery, setUserQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const { success, info } = useToast();

  if (!isOpen) return null;

  const handleRunAction = async (
    action: 'summarize' | 'key_points' | 'vocabulary' | 'questions' | 'notes' | 'general_qa',
    customPrompt?: string
  ) => {
    setActiveAction(action);
    setLoading(true);
    setResult(null);

    try {
      const response = await documentAssistantService.analyzeDocumentText(
        documentText,
        action,
        customPrompt
      );
      setResult(response);
    } catch (err: any) {
      setResult(`An error occurred while processing the document: ${err?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    success('Copied to clipboard', 'Assistant analysis has been copied.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    documentAssistantService.setApiKey(apiKeyInput.trim(), apiKeyInput.trim() ? 'vercel-ai' : 'local');
    setShowSettings(false);
    success('Settings Updated', apiKeyInput.trim() ? 'Vercel AI SDK / Gemini API key configured for assistant.' : 'Local heuristic NLP active.');
  };

  const actionsList = [
    { id: 'summarize', label: 'Summarize', icon: FileText, desc: 'Generate concise summary' },
    { id: 'key_points', label: 'Key Points', icon: ListChecks, desc: 'Extract core takeaways' },
    { id: 'vocabulary', label: 'Key Terms', icon: Lightbulb, desc: 'Identify critical terminology' },
    { id: 'questions', label: 'Quiz Questions', icon: HelpCircle, desc: 'Create study comprehension questions' },
    { id: 'notes', label: 'Study Notes', icon: BookMarked, desc: 'Generate bulleted action notes' },
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-dark-card border-l border-slate-200 dark:border-dark-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-dark-border flex items-center justify-between bg-slate-50/70 dark:bg-dark-surface">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Pragati AI</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50">
                Vercel AI SDK
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[190px]">
              {documentTitle} (Page {currentPage})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-dark-hover transition-colors"
            title="Configure Vercel AI SDK / Engine"
          >
            <Key className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-dark-hover transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Modal Bar */}
      {showSettings && (
        <div className="p-3 bg-indigo-50/90 dark:bg-indigo-950/50 border-b border-indigo-200/70 dark:border-indigo-800/40 text-xs">
          <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between">
            <span>Vercel AI SDK Engine Config</span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">v1.0</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-[11px] mb-2 leading-relaxed">
            Runs 100% client-side local NLP by default. Optionally paste your Vercel AI / Gemini API key (stored in local storage) for LLM synthesis.
          </p>
          <form onSubmit={handleSaveApiKey} className="flex gap-2">
            <input
              type="password"
              placeholder="Paste Vercel AI / Gemini API Key"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-dark-bg text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 text-white font-medium rounded-lg text-xs hover:bg-indigo-700 transition-colors"
            >
              Save
            </button>
          </form>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Action Buttons */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Document Actions
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {actionsList.map((action) => (
              <button
                key={action.id}
                onClick={() => handleRunAction(action.id as any)}
                disabled={loading || !documentText.trim()}
                className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all ${
                  activeAction === action.id && result
                    ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'border-slate-200 dark:border-dark-border hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-dark-surface text-slate-700 dark:text-slate-300'
                } ${loading || !documentText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <action.icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold">{action.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{action.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom prompt input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (userQuery.trim()) {
              handleRunAction('general_qa', userQuery.trim());
            }
          }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Ask anything about this document..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            disabled={loading || !documentText.trim()}
            className="w-full pl-3 pr-9 py-2 rounded-xl text-xs bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !userQuery.trim() || !documentText.trim()}
            className="absolute right-1.5 top-1.5 p-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Output Display */}
        <div className="pt-2">
          {loading ? (
            <div className="py-12 text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
              <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Analyzing Document Content...
              </div>
              <div className="text-[11px] text-slate-400">
                Computing local semantic term weights
              </div>
            </div>
          ) : result ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Assistant Response
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-xs leading-relaxed text-slate-700 dark:text-slate-300 space-y-2 whitespace-pre-wrap">
                {result}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs space-y-1">
              <Sparkles className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-600 mb-1" />
              <p>Select an action above to analyze the current document.</p>
              <p className="text-[11px]">Calculations execute 100% locally in your browser.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer info */}
      <div className="p-3 border-t border-slate-200 dark:border-dark-border bg-slate-50/50 dark:bg-dark-surface/50 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Local Heuristic Engine</span>
        </span>
        <span>Zero Data Leakage</span>
      </div>
    </div>
  );
};
