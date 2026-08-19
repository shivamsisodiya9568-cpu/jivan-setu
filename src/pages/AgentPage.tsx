import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  RotateCcw,
  Trash2,
  Copy,
  Check,
  Heart,
  User
} from 'lucide-react';
import { AgentChatMessage } from '../types';
import { processAgentQuery, SUGGESTED_PROMPTS } from '../services/aiAgentService';
import { copyToClipboard } from '../utils/clipboard';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../context/ToastContext';

export const AgentPage: React.FC = () => {
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'agent',
      text: "Hello! I am your Pragati Font Agent. What kind of font style or typography are you looking for today? Tell me what you're creating (like an Instagram bio, Free Fire clan tag, romantic name, or LinkedIn headline) and I will suggest the best matching fonts!",
      timestamp: Date.now(),
      recommendations: [
        {
          styleId: 'math-bold',
          styleName: 'Mathematical Bold',
          styledText: '𝐏𝐫𝐚𝐠𝐚𝐭𝐢 𝐒𝐚𝐡𝐚𝐲𝐚𝐤',
          reason: 'Clean, bold, and high contrast for maximum visibility.',
          category: 'popular'
        },
        {
          styleId: 'script-bold',
          styleName: 'Bold Script Calligraphy',
          styledText: '𝓟𝓻𝓪𝓰𝓪𝓽𝓲 𝓢𝓪𝓱𝓪𝔂𝓪𝓴',
          reason: 'Luxurious calligraphy perfect for aesthetic and cute names.',
          category: 'fancy'
        },
        {
          styleId: 'gaming-warrior',
          styleName: 'Gaming Clan Blades',
          styledText: '⚔️ 𝕻𝖗𝖆𝖌𝖆𝖙𝖎 𝕾𝖆𝖍𝖆𝖞𝖆𝖐 ⚔️',
          reason: 'Fierce battle tags with crossed swords for gaming profiles.',
          category: 'gaming'
        }
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toggleFavorite, isFavorite } = useFavorites();
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: AgentChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsTyping(true);

    setTimeout(async () => {
      const agentResponse = await processAgentQuery(textToSend);
      setMessages((prev) => [...prev, agentResponse]);
      setIsTyping(false);
    }, 450);
  };

  const handleCopyText = async (id: string, text: string, name: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      toast.success('Copied to Clipboard!', `"${name}" copied.`);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleRegenerate = async () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.text);
    } else {
      handleSend('Give me creative stylish fonts');
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'agent',
        text: 'Chat cleared! What kind of font would you like to explore next?',
        timestamp: Date.now()
      }
    ]);
    toast.info('Chat Cleared', 'Conversation history reset.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-sky-500 p-0.5 shadow-lg shadow-brand-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-dark-bg rounded-[14px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-brand-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Pragati Font Agent
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Intelligent font recommendations and styling advisor.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Regenerate latest recommendation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>

          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
            title="Clear chat conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="py-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-brand-400" />
          <span>Try asking:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-brand-500/40 hover:text-brand-500 dark:hover:text-brand-400 transition-all"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-white/50 dark:bg-dark-card/30 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-6 min-h-[420px] max-h-[600px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 sm:gap-4 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'agent' && (
              <div className="w-8 h-8 rounded-xl bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-br-none ml-10'
                  : 'bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-100 rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>

              {/* Recommendations Cards */}
              {msg.recommendations && msg.recommendations.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {msg.recommendations.map((rec, i) => {
                    const cardUniqueId = `${msg.id}-${rec.styleId}-${i}`;
                    const isCopied = copiedId === cardUniqueId;
                    const favorited = isFavorite(rec.styleId);

                    return (
                      <div
                        key={i}
                        className="rounded-xl bg-slate-50 dark:bg-dark-bg/80 border border-slate-200 dark:border-slate-800/80 p-3 flex flex-col justify-between hover:border-brand-500/40 transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {rec.styleName}
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-brand-500 bg-brand-500/10 px-1.5 py-0.5 rounded">
                              {rec.category}
                            </span>
                          </div>

                          <div
                            onClick={() => handleCopyText(cardUniqueId, rec.styledText, rec.styleName)}
                            className="cursor-pointer p-2.5 rounded-lg bg-white dark:bg-dark-surface border border-slate-200 dark:border-slate-800 my-1 text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 break-words hover:border-brand-500/50 transition-colors"
                            title="Click to copy"
                          >
                            {rec.styledText}
                          </div>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {rec.reason}
                          </p>
                        </div>

                        <div className="flex items-center justify-end gap-1.5 pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                          <button
                            onClick={() =>
                              toggleFavorite({
                                styleId: rec.styleId,
                                styleName: rec.styleName,
                                originalText: 'Sample',
                                styledText: rec.styledText,
                                category: rec.category
                              })
                            }
                            className={`p-1.5 rounded-lg border transition-colors ${
                              favorited
                                ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                                : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'
                            }`}
                            title={favorited ? 'Favorited' : 'Add to Favorites'}
                          >
                            <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-rose-500' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleCopyText(cardUniqueId, rec.styledText, rec.styleName)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                              isCopied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-brand-600 hover:bg-brand-500 text-white'
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Copied ✓</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-brand-600/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-2xl rounded-bl-none flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-4 relative flex items-center"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask Pragati Font Agent (e.g. 'I want a cute romantic font for Rahul')..."
          className="w-full pl-5 pr-28 py-3.5 rounded-2xl bg-white dark:bg-dark-card border-2 border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 shadow-lg"
        />

        <div className="absolute right-2 flex items-center gap-1">
          <button
            type="submit"
            disabled={!inputQuery.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:hover:bg-brand-600 text-white shadow-md shadow-brand-600/25 transition-all"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
