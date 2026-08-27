/**
 * Vercel AI SDK Integration Service
 * 
 * Facilitates AI powered website development, typography suggestions, 
 * and document intelligence using Vercel AI SDK standards.
 */

export interface VercelAiGenerateOptions {
  prompt: string;
  systemPrompt?: string;
  apiKey?: string;
  model?: string;
  temperature?: number;
}

export interface FontRecommendation {
  headingFont: string;
  bodyFont: string;
  category: string;
  cssImport: string;
  description: string;
}

export class VercelAiService {
  private defaultModel = 'gemini-1.5-flash';

  /**
   * Helper to retrieve API key from options or local storage
   */
  private getApiKey(explicitKey?: string): string {
    if (explicitKey && explicitKey.trim()) {
      return explicitKey.trim();
    }
    try {
      return localStorage.getItem('pragati_assistant_api_key') || '';
    } catch {
      return '';
    }
  }

  /**
   * Generates text content using Vercel AI SDK standard API pattern
   */
  public async generateText(options: VercelAiGenerateOptions): Promise<string> {
    const apiKey = this.getApiKey(options.apiKey);
    if (!apiKey) {
      throw new Error('No Vercel AI / Gemini API key found. Please configure your API key in settings.');
    }

    const systemMessage = options.systemPrompt || 'You are an expert AI website developer and document design assistant.';
    const modelName = options.model || this.defaultModel;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Vercel-AI-SDK': '1.0.0',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemMessage}\n\n${options.prompt}` }],
          },
        ],
        generationConfig: {
          temperature: options.temperature ?? 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Vercel AI SDK Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
      throw new Error('Vercel AI SDK returned an empty response.');
    }

    return resultText;
  }

  /**
   * Generates tailored font recommendations and typography advice for website development
   */
  public async generateFontSuggestions(websiteTopic: string, apiKey?: string): Promise<string> {
    const systemPrompt = `You are a Senior UI/UX Designer and Font Specialist for modern web development.
Return a structured Markdown report recommending top Google Web Fonts and typography pairings for the specified website theme. Include Google Fonts CSS links and Tailwind CSS rules.`;

    const prompt = `Topic/Website Type: "${websiteTopic}"
Please provide:
1. Top 3 Font Pairings (Heading + Body font names)
2. Design rationale and emotional tone
3. Google Fonts CDN import code
4. Tailwind CSS config snippet`;

    return this.generateText({
      prompt,
      systemPrompt,
      apiKey,
      temperature: 0.6,
    });
  }

  /**
   * Generates website content / copy for landing pages or document templates
   */
  public async generateWebsiteCopy(
    contentType: 'hero' | 'features' | 'about' | 'faq',
    brandName: string,
    apiKey?: string
  ): Promise<string> {
    const systemPrompt = `You are an expert Copywriter and Web Developer creating clean, engaging web content.`;
    const prompt = `Generate standard website copy for section "${contentType}" for the brand/app named "${brandName}". Keep it modern, concise, and production-ready.`;

    return this.generateText({
      prompt,
      systemPrompt,
      apiKey,
    });
  }
}

export const vercelAiService = new VercelAiService();
