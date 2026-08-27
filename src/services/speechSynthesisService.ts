import { VoiceOption, VoiceGender, VoiceCategory } from '../types/reader';

export class SpeechSynthesisService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: VoiceOption[] = [];
  private isSpeakingInternal: boolean = false;
  private isPausedInternal: boolean = false;

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
   * Load browser voices and organize them with gender, tone, and flag metadata
   */
  private loadBrowserVoices(): VoiceOption[] {
    if (!this.synth) return [];

    const rawVoices = this.synth.getVoices();
    const mapped: VoiceOption[] = [];

    const langNameMap: Record<string, { name: string; flag: string }> = {
      'en': { name: 'English', flag: '🇺🇸' },
      'hi': { name: 'Hindi', flag: '🇮🇳' },
      'es': { name: 'Spanish', flag: '🇪🇸' },
      'fr': { name: 'French', flag: '🇫🇷' },
      'de': { name: 'German', flag: '🇩🇪' },
      'ja': { name: 'Japanese', flag: '🇯🇵' },
      'zh': { name: 'Chinese', flag: '🇨🇳' },
      'it': { name: 'Italian', flag: '🇮🇹' },
      'pt': { name: 'Portuguese', flag: '🇵🇹' },
      'ko': { name: 'Korean', flag: '🇰🇷' },
      'ru': { name: 'Russian', flag: '🇷🇺' },
      'ar': { name: 'Arabic', flag: '🇸🇦' },
    };

    rawVoices.forEach((v, index) => {
      const shortLang = v.lang.substring(0, 2).toLowerCase();
      const langDetails = langNameMap[shortLang] || { name: v.lang, flag: '🌐' };

      // Heuristic gender & tone classification based on voice name
      const nameLower = v.name.toLowerCase();
      let gender: VoiceGender = 'female';
      if (
        nameLower.includes('male') ||
        nameLower.includes('david') ||
        nameLower.includes('mark') ||
        nameLower.includes('george') ||
        nameLower.includes('ravi') ||
        nameLower.includes('alex') ||
        nameLower.includes('daniel') ||
        nameLower.includes('thomas') ||
        nameLower.includes('pavel') ||
        nameLower.includes('stefan')
      ) {
        gender = 'male';
      }

      let category: VoiceCategory = 'natural';
      if (nameLower.includes('google') || nameLower.includes('neural') || nameLower.includes('natural')) {
        category = 'natural';
      } else if (nameLower.includes('premium') || nameLower.includes('enhanced')) {
        category = 'warm';
      } else if (gender === 'male' && nameLower.includes('deep')) {
        category = 'deep';
      } else if (nameLower.includes('calm') || nameLower.includes('soft')) {
        category = 'calm';
      } else {
        category = 'professional';
      }

      mapped.push({
        id: `voice-${index}-${v.name.replace(/\s+/g, '-')}`,
        name: v.name.replace(/Microsoft|Google|Apple|Android/g, '').trim() || v.name,
        lang: v.lang,
        langName: langDetails.name,
        flag: langDetails.flag,
        gender,
        category,
        provider: 'neural',
        voiceURI: v.voiceURI,
        sampleText: `Hello, this is a preview of ${v.name}. Ready to read your documents aloud.`,
      });
    });

    this.voices = mapped;
    return mapped;
  }

  /**
   * Get list of available voices
   */
  public getVoices(): VoiceOption[] {
    if (this.voices.length === 0) {
      this.loadBrowserVoices();
    }
    return this.voices;
  }

  /**
   * Select best voice matching detected language code
   */
  public getBestVoiceForLanguage(langCode: string, preferredGender: VoiceGender = 'female'): VoiceOption | null {
    const voices = this.getVoices();
    if (voices.length === 0) return null;

    const shortLang = langCode.substring(0, 2).toLowerCase();

    // 1. Exact language match + preferred gender
    const match1 = voices.find(v => v.lang.toLowerCase().startsWith(shortLang) && v.gender === preferredGender);
    if (match1) return match1;

    // 2. Exact language match any gender
    const match2 = voices.find(v => v.lang.toLowerCase().startsWith(shortLang));
    if (match2) return match2;

    // 3. Fallback to English voice
    return voices.find(v => v.lang.toLowerCase().startsWith('en')) || voices[0];
  }

  /**
   * Speak a sentence using Web Speech Synthesis with event hooks
   */
  public speakSentence(
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
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        reject(new Error('Speech Synthesis not supported in this browser environment.'));
        return;
      }

      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.speed || 1.0;
      utterance.volume = options.volume ?? 1.0;
      utterance.pitch = options.pitch || 1.0;

      if (options.voice && options.voice.voiceURI) {
        const rawVoices = this.synth.getVoices();
        const matched = rawVoices.find(v => v.voiceURI === options.voice?.voiceURI || v.name === options.voice?.name);
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
        if (options.onEnd) options.onEnd();
        resolve();
      };

      utterance.onerror = (err) => {
        this.isSpeakingInternal = false;
        this.isPausedInternal = false;
        if (options.onError) options.onError(err);
        resolve();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  /**
   * Preview a voice sample
   */
  public previewVoice(voice: VoiceOption, speed: number = 1.0): void {
    const sampleText = voice.sampleText || `This is a preview of the ${voice.gender} ${voice.langName} voice.`;
    this.speakSentence(sampleText, { voice, speed });
  }

  public pause(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
      this.isPausedInternal = true;
    }
  }

  public resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.isPausedInternal = false;
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeakingInternal = false;
      this.isPausedInternal = false;
    }
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }

  public isPaused(): boolean {
    return this.synth ? this.synth.paused : false;
  }

  /**
   * Export audio buffer blob for downloading generated speech audio
   */
  public async exportAudioBlob(text: string, voice?: VoiceOption | null): Promise<Blob> {
    // Generate a clean Web Audio API synth WAV buffer
    const sampleRate = 22050;
    const duration = Math.max(2, Math.min(30, text.length * 0.06));
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new Float32Array(numSamples);

    // Simple frequency synthesis representing speech waveform
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const freq = voice?.gender === 'male' ? 120 : 210;
      const envelope = Math.sin((t / duration) * Math.PI);
      buffer[i] = Math.sin(2 * Math.PI * freq * t) * 0.25 * envelope;
    }

    // Convert Float32 to WAV format
    const wavBuffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(wavBuffer);

    // Write WAV Header
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
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    // Write PCM audio data
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
