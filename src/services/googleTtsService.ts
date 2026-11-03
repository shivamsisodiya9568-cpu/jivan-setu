/**
 * High-Quality Google Cloud Neural Text-to-Speech Service
 * Provides natural, human-like English reading with prefetching and audio caching.
 */

import { VoiceOption } from '../types/reader';

// API key is loaded from environment variable — never hardcode secrets in source code!
// Create a .env file in the project root with: VITE_GOOGLE_API_KEY=your_actual_key_here
export const DEFAULT_GOOGLE_API_KEY = (import.meta as any).env?.VITE_GOOGLE_API_KEY ?? '';

export const GOOGLE_NEURAL_ENGLISH_VOICES: VoiceOption[] = [
  {
    id: 'google-journey-f',
    name: 'Aria — Natural Storyteller',
    lang: 'en-US',
    langName: 'US English',
    flag: '🇺🇸',
    gender: 'female',
    category: 'natural',
    provider: 'neural',
    voiceURI: 'en-US-Journey-F',
    sampleText: 'Hello! I am Aria, a natural AI voice ready to read your PDF documents with smooth storytelling cadence.',
  },
  {
    id: 'google-journey-o',
    name: 'Oliver — Dynamic Narrative',
    lang: 'en-US',
    langName: 'US English',
    flag: '🇺🇸',
    gender: 'male',
    category: 'warm',
    provider: 'neural',
    voiceURI: 'en-US-Journey-O',
    sampleText: 'Welcome! I am Oliver. I provide expressive, human-like voice narration for long-form books and articles.',
  },
  {
    id: 'google-neural2-f',
    name: 'Emma — Warm & Crisp',
    lang: 'en-US',
    langName: 'US English',
    flag: '🇺🇸',
    gender: 'female',
    category: 'warm',
    provider: 'neural',
    voiceURI: 'en-US-Neural2-F',
    sampleText: 'Hi there! I am Emma. I read documents clearly with warm inflection and natural rhythm.',
  },
  {
    id: 'google-neural2-d',
    name: 'Michael — Deep & Professional',
    lang: 'en-US',
    langName: 'US English',
    flag: '🇺🇸',
    gender: 'male',
    category: 'deep',
    provider: 'neural',
    voiceURI: 'en-US-Neural2-D',
    sampleText: 'Greetings. I am Michael. I offer a deep, articulate voice tailored for reports, books, and essays.',
  },
  {
    id: 'google-studio-o',
    name: 'Ava — Studio Narrator',
    lang: 'en-US',
    langName: 'US English',
    flag: '🇺🇸',
    gender: 'female',
    category: 'professional',
    provider: 'neural',
    voiceURI: 'en-US-Studio-O',
    sampleText: 'Good day. I am Ava, designed for studio-grade audiobook narration and deep focus reading.',
  },
  {
    id: 'google-studio-q',
    name: 'James — Authoritative Narrator',
    lang: 'en-US',
    langName: 'US English',
    flag: '🇺🇸',
    gender: 'male',
    category: 'professional',
    provider: 'neural',
    voiceURI: 'en-US-Studio-Q',
    sampleText: 'Hello. I am James. My voice provides authoritative clarity across complex technical and academic texts.',
  },
  {
    id: 'google-gb-neural2-f',
    name: 'Charlotte — British Elegant',
    lang: 'en-GB',
    langName: 'British English',
    flag: '🇬🇧',
    gender: 'female',
    category: 'calm',
    provider: 'neural',
    voiceURI: 'en-GB-Neural2-F',
    sampleText: 'Hello. I am Charlotte, bringing a graceful British accent to your reading experience.',
  },
  {
    id: 'google-gb-neural2-b',
    name: 'Arthur — British Storyteller',
    lang: 'en-GB',
    langName: 'British English',
    flag: '🇬🇧',
    gender: 'male',
    category: 'natural',
    provider: 'neural',
    voiceURI: 'en-GB-Neural2-B',
    sampleText: 'Good day. I am Arthur. I narrate with a classic, articulate British tone.',
  },
  {
    id: 'google-au-neural2-a',
    name: 'Olivia — Australian Bright',
    lang: 'en-AU',
    langName: 'Australian English',
    flag: '🇦🇺',
    gender: 'female',
    category: 'natural',
    provider: 'neural',
    voiceURI: 'en-AU-Neural2-A',
    sampleText: 'G\'day! I am Olivia. Ready to read through your documents with a bright Australian cadence.',
  },
  {
    id: 'google-au-neural2-b',
    name: 'Liam — Australian Calm',
    lang: 'en-AU',
    langName: 'Australian English',
    flag: '🇦🇺',
    gender: 'male',
    category: 'calm',
    provider: 'neural',
    voiceURI: 'en-AU-Neural2-B',
    sampleText: 'G\'day! I am Liam. I provide relaxed, calm audio reading for long study sessions.',
  },
  {
    id: 'google-in-neural2-a',
    name: 'Priya — Indian English Clear',
    lang: 'en-IN',
    langName: 'Indian English',
    flag: '🇮🇳',
    gender: 'female',
    category: 'warm',
    provider: 'neural',
    voiceURI: 'en-IN-Neural2-A',
    sampleText: 'Namaste and hello. I am Priya. I read your PDFs clearly in natural Indian English.',
  },
  {
    id: 'google-in-neural2-d',
    name: 'Rohan — Indian English Pro',
    lang: 'en-IN',
    langName: 'Indian English',
    flag: '🇮🇳',
    gender: 'male',
    category: 'professional',
    provider: 'neural',
    voiceURI: 'en-IN-Neural2-D',
    sampleText: 'Hello. I am Rohan. I deliver professional Indian English voice reading for all your documents.',
  },
];

export class GoogleTtsService {
  private static audioCache = new Map<string, ArrayBuffer>();
  private static currentAudio: HTMLAudioElement | null = null;
  private static isPlayingInternal: boolean = false;
  private static isPausedInternal: boolean = false;

  public static getApiKey(): string {
    try {
      return localStorage.getItem('readtriangle_google_tts_key') || DEFAULT_GOOGLE_API_KEY;
    } catch {
      return DEFAULT_GOOGLE_API_KEY;
    }
  }

  public static setApiKey(key: string): void {
    try {
      localStorage.setItem('readtriangle_google_tts_key', key.trim());
    } catch {
      // ignore
    }
  }

  /**
   * Synthesize text to MP3 ArrayBuffer via Google Cloud TTS REST API
   */
  public static async synthesize(
    text: string,
    voiceURI: string = 'en-US-Journey-F',
    speed: number = 1.0,
    pitch: number = 0
  ): Promise<ArrayBuffer> {
    const clean = text.trim();
    if (!clean) throw new Error('Cannot synthesize empty text.');

    const cacheKey = `${voiceURI}_${speed.toFixed(2)}_${pitch.toFixed(1)}_${clean}`;
    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey)!;
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Google Cloud TTS API Key is not configured.');
    }

    // Determine languageCode and ssmlGender
    const langCode = voiceURI.startsWith('en-GB')
      ? 'en-GB'
      : voiceURI.startsWith('en-AU')
      ? 'en-AU'
      : voiceURI.startsWith('en-IN')
      ? 'en-IN'
      : 'en-US';

    const ssmlGender = voiceURI.endsWith('-F') || voiceURI.endsWith('-A') || voiceURI.endsWith('-O')
      ? 'FEMALE'
      : 'MALE';

    const speakingRate = Math.max(0.5, Math.min(2.0, speed));

    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text: clean },
        voice: {
          languageCode: langCode,
          name: voiceURI,
          ssmlGender,
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate,
          pitch,
        },
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const msg = errJson?.error?.message || `HTTP ${response.status} ${response.statusText}`;
      throw new Error(`Google TTS Error: ${msg}`);
    }

    const data = await response.json();
    if (!data.audioContent) {
      throw new Error('No audio content returned from Google TTS API.');
    }

    // Convert Base64 audioContent to ArrayBuffer
    const binaryString = window.atob(data.audioContent);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const buffer = bytes.buffer;

    // Cache buffer (limit in-memory cache to 150 items)
    if (this.audioCache.size > 150) {
      const firstKey = this.audioCache.keys().next().value;
      if (firstKey) this.audioCache.delete(firstKey);
    }
    this.audioCache.set(cacheKey, buffer);

    return buffer;
  }

  /**
   * Prefetches audio in the background for upcoming sentences
   */
  public static prefetch(text: string, voiceURI: string = 'en-US-Journey-F', speed: number = 1.0): void {
    if (!text || !text.trim()) return;
    // Fire and forget
    this.synthesize(text, voiceURI, speed).catch(() => {});
  }

  /**
   * Speaks a sentence with HTMLAudioElement and resolves upon completion
   */
  public static async speak(
    text: string,
    options: {
      voiceURI?: string;
      speed?: number;
      volume?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    } = {}
  ): Promise<void> {
    this.stop();

    try {
      const voiceURI = options.voiceURI || 'en-US-Journey-F';
      const speed = options.speed || 1.0;
      const volume = options.volume ?? 1.0;

      const buffer = await this.synthesize(text, voiceURI, speed);
      const blob = new Blob([buffer], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(blob);

      return new Promise<void>((resolve) => {
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;
        audio.volume = Math.max(0, Math.min(1.0, volume));

        audio.onplay = () => {
          this.isPlayingInternal = true;
          this.isPausedInternal = false;
          if (options.onStart) options.onStart();
        };

        audio.onended = () => {
          this.isPlayingInternal = false;
          this.isPausedInternal = false;
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          if (options.onEnd) options.onEnd();
          resolve();
        };

        audio.onerror = (err) => {
          this.isPlayingInternal = false;
          this.isPausedInternal = false;
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          if (options.onError) options.onError(err);
          resolve();
        };

        audio.play().catch((err) => {
          this.isPlayingInternal = false;
          this.isPausedInternal = false;
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          if (options.onError) options.onError(err);
          resolve();
        });
      });
    } catch (err: any) {
      if (options.onError) options.onError(err);
      throw err;
    }
  }

  public static pause(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.isPlayingInternal = false;
      this.isPausedInternal = true;
    }
  }

  public static resume(): void {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play().catch(() => {});
      this.isPlayingInternal = true;
      this.isPausedInternal = false;
    }
  }

  public static stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.isPlayingInternal = false;
    this.isPausedInternal = false;
  }

  public static isPlaying(): boolean {
    return this.isPlayingInternal;
  }

  public static isPaused(): boolean {
    return this.isPausedInternal;
  }
}
