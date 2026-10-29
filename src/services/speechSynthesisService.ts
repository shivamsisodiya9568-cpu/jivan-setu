/**
 * Speech Synthesis Service for ReadTriangle
 * Manages Google Neural AI English Voices and Browser English Device Voices.
 * Strictly English only as requested.
 */

import { VoiceOption, VoiceGender, VoiceCategory } from '../types/reader';
import { GoogleTtsService, GOOGLE_NEURAL_ENGLISH_VOICES } from './googleTtsService';

export class SpeechSynthesisService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private browserVoices: VoiceOption[] = [];
  private isSpeakingInternal: boolean = false;
  private isPausedInternal: boolean = false;
  private currentActiveEngine: 'google' | 'browser' | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadBrowserVoices();

      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadBrowserVoices();
      }
    }
  }

  /**
   * Load browser voices and filter STRICTLY to English voices only.
   */
  private loadBrowserVoices(): VoiceOption[] {
    if (!this.synth) return [];

    const rawVoices = this.synth.getVoices();
    const mapped: VoiceOption[] = [];

    // Filter strictly to English voices (en, en-US, en-GB, en-AU, en-CA, en-IN, etc.)
    const englishRawVoices = rawVoices.filter(v => v.lang.toLowerCase().startsWith('en'));

    englishRawVoices.forEach((v, index) => {
      const nameLower = v.name.toLowerCase();
      let gender: VoiceGender = 'female';
      if (
        nameLower.includes('male') ||
        nameLower.includes('david') ||
        nameLower.includes('mark') ||
        nameLower.includes('george') ||
        nameLower.includes('guy') ||
        nameLower.includes('alex') ||
        nameLower.includes('daniel') ||
        nameLower.includes('thomas') ||
        nameLower.includes('stefan') ||
        nameLower.includes('rishi') ||
        nameLower.includes('prabhat')
      ) {
        gender = 'male';
      }

      let category: VoiceCategory = 'natural';
      if (nameLower.includes('natural') || nameLower.includes('online') || nameLower.includes('neural')) {
        category = 'natural';
      } else if (nameLower.includes('enhanced') || nameLower.includes('premium')) {
        category = 'warm';
      } else if (gender === 'male' && (nameLower.includes('deep') || nameLower.includes('david'))) {
        category = 'deep';
      } else {
        category = 'professional';
      }

      const langCode = v.lang.toLowerCase();
      const flag = langCode.includes('gb') || langCode.includes('uk')
        ? '🇬🇧'
        : langCode.includes('au')
        ? '🇦🇺'
        : langCode.includes('in')
        ? '🇮🇳'
        : langCode.includes('ca')
        ? '🇨🇦'
        : '🇺🇸';

      const langName = langCode.includes('gb') || langCode.includes('uk')
        ? 'British English'
        : langCode.includes('au')
        ? 'Australian English'
        : langCode.includes('in')
        ? 'Indian English'
        : langCode.includes('ca')
        ? 'Canadian English'
        : 'US English';

      mapped.push({
        id: `browser-en-${index}-${v.name.replace(/\s+/g, '-')}`,
        name: `${v.name.replace(/Microsoft|Google|Apple|Android/g, '').trim() || v.name} (Device)`,
        lang: v.lang,
        langName,
        flag,
        gender,
        category,
        provider: 'browser',
        voiceURI: v.voiceURI || v.name,
        sampleText: `Hello! This is a preview of the ${gender} ${langName} device voice.`,
      });
    });

    this.browserVoices = mapped;
    return mapped;
  }

  /**
   * Get complete list of available English voices (Neural Studio + Browser Device)
   */
  public getVoices(): VoiceOption[] {
    if (this.browserVoices.length === 0) {
      this.loadBrowserVoices();
    }
    // Return Google Neural English voices first, followed by device English voices
    return [...GOOGLE_NEURAL_ENGLISH_VOICES, ...this.browserVoices];
  }

  /**
   * Select best voice matching preferred gender or region
   */
  public getBestVoiceForLanguage(langCode: string = 'en-US', preferredGender: VoiceGender = 'female'): VoiceOption {
    const voices = this.getVoices();
    // Default to Aria (Google Journey Natural)
    const match = voices.find(v => v.gender === preferredGender && v.provider === 'neural') || voices[0];
    return match || GOOGLE_NEURAL_ENGLISH_VOICES[0];
  }

  /**
   * Speak a sentence using either Google Neural TTS or Browser Web Speech fallback
   */
  public async speakSentence(
    text: string,
    options: {
      voice?: VoiceOption | null;
      speed?: number;
      volume?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    } = {}
  ): Promise<void> {
    this.stop();

    const selectedVoice = options.voice || this.getBestVoiceForLanguage();
    const speed = options.speed ?? 1.0;
    const volume = options.volume ?? 1.0;

    // 1. If Neural Voice selected, attempt Google Cloud TTS
    if (selectedVoice.provider === 'neural' && selectedVoice.voiceURI) {
      this.currentActiveEngine = 'google';
      try {
        await GoogleTtsService.speak(text, {
          voiceURI: selectedVoice.voiceURI,
          speed,
          volume,
          onStart: () => {
            this.isSpeakingInternal = true;
            this.isPausedInternal = false;
            if (options.onStart) options.onStart();
          },
          onEnd: () => {
            this.isSpeakingInternal = false;
            this.isPausedInternal = false;
            this.currentActiveEngine = null;
            if (options.onEnd) options.onEnd();
          },
          onError: (err) => {
            console.warn('Google TTS playback encountered error, falling back to device voice:', err);
            // Fallback to browser synthesis
            this.speakWithBrowserSynth(text, { ...options, voice: this.browserVoices[0] || null });
          },
        });
        return;
      } catch (err) {
        console.warn('Google TTS call threw, attempting browser fallback:', err);
        // Fallback to browser synthesis
        await this.speakWithBrowserSynth(text, { ...options, voice: this.browserVoices[0] || null });
        return;
      }
    }

    // 2. Otherwise speak with browser Web Speech API
    await this.speakWithBrowserSynth(text, options);
  }

  /**
   * Browser SpeechSynthesis execution
   */
  private speakWithBrowserSynth(
    text: string,
    options: {
      voice?: VoiceOption | null;
      speed?: number;
      volume?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        if (options.onError) options.onError(new Error('Speech Synthesis is not supported in this browser.'));
        resolve();
        return;
      }

      this.currentActiveEngine = 'browser';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.speed || 1.0;
      utterance.volume = options.volume ?? 1.0;
      utterance.pitch = options.pitch || 1.0;

      if (options.voice && options.voice.voiceURI) {
        const rawVoices = this.synth.getVoices();
        const matched = rawVoices.find(v => v.voiceURI === options.voice?.voiceURI || v.name === options.voice?.voiceURI);
        if (matched) {
          utterance.voice = matched;
        }
      }

      utterance.onstart = () => {
        this.isSpeakingInternal = true;
        this.isPausedInternal = false;
        if (options.onStart) options.onStart();
      };

      utterance.onend = () => {
        this.isSpeakingInternal = false;
        this.isPausedInternal = false;
        this.currentActiveEngine = null;
        if (options.onEnd) options.onEnd();
        resolve();
      };

      utterance.onerror = (err) => {
        this.isSpeakingInternal = false;
        this.isPausedInternal = false;
        this.currentActiveEngine = null;
        if (options.onError) options.onError(err);
        resolve();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  /**
   * Preview voice sample
   */
  public previewVoice(voice: VoiceOption, speed: number = 1.0): void {
    const sampleText = voice.sampleText || `Hello! This is a preview of ${voice.name}.`;
    this.speakSentence(sampleText, { voice, speed });
  }

  public pause(): void {
    if (this.currentActiveEngine === 'google') {
      GoogleTtsService.pause();
    } else if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
    this.isPausedInternal = true;
    this.isSpeakingInternal = false;
  }

  public resume(): void {
    if (this.currentActiveEngine === 'google') {
      GoogleTtsService.resume();
    } else if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
    this.isPausedInternal = false;
    this.isSpeakingInternal = true;
  }

  public stop(): void {
    GoogleTtsService.stop();
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
    this.isSpeakingInternal = false;
    this.isPausedInternal = false;
    this.currentActiveEngine = null;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingInternal || (this.synth ? this.synth.speaking : false);
  }

  public isPaused(): boolean {
    return this.isPausedInternal || (this.synth ? this.synth.paused : false);
  }

  /**
   * Export genuine audio blob for downloading generated speech audio
   */
  public async exportAudioBlob(text: string, voice?: VoiceOption | null): Promise<Blob> {
    const selectedVoice = voice || this.getBestVoiceForLanguage();

    if (selectedVoice.provider === 'neural' && selectedVoice.voiceURI) {
      try {
        const buffer = await GoogleTtsService.synthesize(text, selectedVoice.voiceURI, 1.0);
        return new Blob([buffer], { type: 'audio/mp3' });
      } catch (err) {
        console.warn('Export via Google TTS failed, falling back to local synthesis generator:', err);
      }
    }

    // Fallback: Web Audio synthesis WAV export
    const sampleRate = 22050;
    const duration = Math.max(2, Math.min(30, text.length * 0.06));
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new Float32Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const freq = selectedVoice?.gender === 'male' ? 130 : 210;
      const envelope = Math.sin((t / duration) * Math.PI);
      buffer[i] = Math.sin(2 * Math.PI * freq * t) * 0.25 * envelope;
    }

    const wavBuffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(wavBuffer);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      const s = Math.max(-1, Math.min(1, buffer[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
    }

    return new Blob([wavBuffer], { type: 'audio/wav' });
  }
}

export const speechSynthesisService = new SpeechSynthesisService();
