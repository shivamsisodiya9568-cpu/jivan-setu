import { vercelAiService } from './vercelAiService';

export interface AssistantResponse {
  summary: string;
  keyPoints: string[];
  vocabulary: { term: string; explanation: string }[];
  questions: { question: string; answer: string }[];
  actionItems: string[];
}

export type AiProviderType = 'local' | 'vercel-ai' | 'gemini' | 'openai';

// Local extractive NLP analyzer (Zero external API dependencies, 100% private & client-side)
export class DocumentAssistantService {
  private customApiKey: string = '';
  private provider: AiProviderType = 'local';

  constructor() {
    try {
      this.customApiKey = localStorage.getItem('pragati_assistant_api_key') || '';
      this.provider = (localStorage.getItem('pragati_assistant_provider') as any) || 'local';
    } catch {
      // ignore
    }
  }

  public setApiKey(key: string, provider: AiProviderType = 'vercel-ai') {
    this.customApiKey = key;
    this.provider = provider;
    try {
      localStorage.setItem('pragati_assistant_api_key', key);
      localStorage.setItem('pragati_assistant_provider', provider);
    } catch {
      // ignore
    }
  }

  public getProvider(): string {
    return this.provider;
  }

  /**
   * Main entry point to process document text
   */
  public async analyzeDocumentText(
    text: string,
    action: 'summarize' | 'key_points' | 'vocabulary' | 'questions' | 'notes' | 'general_qa',
    userPrompt?: string
  ): Promise<string> {
    const cleanText = text.trim();
    if (!cleanText) {
      return 'No document text found to analyze. Please upload a readable PDF or document first.';
    }

    // If Vercel AI SDK provider configured
    if (this.customApiKey && (this.provider === 'vercel-ai' || this.provider === 'gemini')) {
      try {
        return await vercelAiService.generateText({
          prompt: `Action requested: ${action}\nUser Query: ${userPrompt || 'Perform analysis'}\n\nDocument snippet:\n${cleanText.substring(0, 12000)}`,
          systemPrompt: 'You are Pragati Document Assistant powered by Vercel AI SDK. Provide accurate, clear, markdown-formatted document insights.',
          apiKey: this.customApiKey,
        });
      } catch (err: any) {
        console.warn('Vercel AI SDK call failed, falling back to local engine:', err);
      }
    }

    // Local Private Heuristic Engine
    return this.runLocalAnalysis(cleanText, action, userPrompt);
  }

  private runLocalAnalysis(
    text: string,
    action: 'summarize' | 'key_points' | 'vocabulary' | 'questions' | 'notes' | 'general_qa',
    userPrompt?: string
  ): string {
    const sentences = text
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 15);

    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3);

    // Stop words
    const stopWords = new Set([
      'that', 'this', 'with', 'from', 'have', 'were', 'which', 'their', 'there',
      'about', 'would', 'could', 'these', 'other', 'after', 'first', 'into', 'also',
      'they', 'them', 'when', 'more', 'some', 'been', 'than', 'what', 'then'
    ]);

    // Frequency analysis
    const wordFreq: Record<string, number> = {};
    for (const w of words) {
      if (!stopWords.has(w)) {
        wordFreq[w] = (wordFreq[w] || 0) + 1;
      }
    }

    // Score sentences
    const scoredSentences = sentences.map((s, idx) => {
      const sWords = s.toLowerCase().split(/\s+/);
      let score = 0;
      for (const w of sWords) {
        score += wordFreq[w] || 0;
      }
      // Give bonus to earlier sentences (lead bias in document writing)
      if (idx === 0) score *= 1.5;
      if (idx === 1) score *= 1.2;
      return { sentence: s, score: score / Math.max(1, sWords.length), index: idx };
    });

    // Top sentences for summary
    const topSentences = [...scoredSentences]
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(5, Math.ceil(sentences.length * 0.35)))
      .sort((a, b) => a.index - b.index)
      .map((item) => item.sentence);

    switch (action) {
      case 'summarize': {
        const summaryParagraphs = topSentences.join(' ');
        return `### Document Summary\n\n${summaryParagraphs}\n\n*Document Metrics: Analyzed ~${words.length} words across ${sentences.length} structural sentences.*`;
      }

      case 'key_points': {
        const keyBullets = topSentences.map((s, i) => `**${i + 1}.** ${s}`).join('\n\n');
        return `### Key Takeaways\n\n${keyBullets}`;
      }

      case 'vocabulary': {
        // Find top unique domain terms
        const topTerms = Object.entries(wordFreq)
          .filter(([w]) => w.length > 5)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        const vocabList = topTerms
          .map(([term, freq]) => {
            const contextSentence = sentences.find((s) => s.toLowerCase().includes(term)) || '';
            const capTerm = term.charAt(0).toUpperCase() + term.slice(1);
            return `#### ${capTerm}\n- **Frequency:** Mentioned ${freq} time(s) in the text.\n- **Context:** *"...${contextSentence.substring(0, 140)}..."*`;
          })
          .join('\n\n');

        return `### Important Terms & Concepts\n\n${vocabList || 'No distinctive high-frequency keywords found.'}`;
      }

      case 'questions': {
        const questionsList = topSentences.slice(0, 4).map((s, idx) => {
          return `**Q${idx + 1}: What is the significance of:** "${s.substring(0, 80)}..."?\n*Self-Check:* Review how this statement relates to the primary topic discussed in this section.\n`;
        }).join('\n');

        return `### Study & Comprehension Questions\n\n${questionsList}`;
      }

      case 'notes': {
        const notesList = topSentences.map((s) => `- ${s}`).join('\n');
        return `### Quick Structured Notes\n\n**Main Points:**\n${notesList}\n\n**Actionable Items:**\n- [ ] Review main concepts highlighted above\n- [ ] Archive reference highlights for future lookup`;
      }

      case 'general_qa':
      default: {
        if (userPrompt) {
          const lowerPrompt = userPrompt.toLowerCase();
          // Find closest matching sentence
          const matching = sentences.filter((s) => {
            const promptKeywords = lowerPrompt.split(/\s+/).filter((w) => w.length > 3);
            return promptKeywords.some((kw) => s.toLowerCase().includes(kw));
          });

          if (matching.length > 0) {
            return `Based on your query **"${userPrompt}"**, here are the most relevant findings from the document:\n\n${matching.slice(0, 3).map((m) => `> ${m}`).join('\n\n')}`;
          }
        }
        return `### Document Analysis\n\n${topSentences.slice(0, 3).join(' ')}`;
      }
    }
  }

  private async callGeminiApi(text: string, action: string, userPrompt?: string): Promise<string> {
    const systemPrompt = `You are Pragati Document Assistant, an intelligent document companion. Analyze the provided document text accurately, concisely, and helpfully. Do not invent facts not present in the text.`;
    const prompt = `Action: ${action}\nUser Query: ${userPrompt || 'Analyze text'}\n\nDocument Text:\n${text.substring(0, 12000)}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.customApiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${prompt}` }],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
  }
}

export const documentAssistantService = new DocumentAssistantService();
