export interface SpeechVoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  isDefault: boolean;
  isLocal: boolean;
}

export type SpeechState = 'idle' | 'playing' | 'paused' | 'stopped';

export class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private rate: number = 1.0;
  private pitch: number = 1.0;
  private volume: number = 1.0;
  private state: SpeechState = 'idle';

  // Callbacks
  private onStateChangeCallback?: (state: SpeechState) => void;
  private onBoundaryCallback?: (charIndex: number, charLength: number) => void;
  private onEndCallback?: () => void;
  private onErrorCallback?: (err: any) => void;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  private initVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    if (this.voices.length > 0 && !this.selectedVoice) {
      // Try to find natural or high quality English voice or default
      const preferred =
        this.voices.find((v) => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('David')) ||
        this.voices.find((v) => v.lang.startsWith('en')) ||
        this.voices[0];
      this.selectedVoice = preferred || null;
    }
  }

  public getVoices(): SpeechVoiceOption[] {
    if (!this.synth) return [];
    if (this.voices.length === 0) {
      this.voices = this.synth.getVoices();
    }
    return this.voices.map((v) => ({
      voice: v,
      name: v.name,
      lang: v.lang,
      isDefault: v.default,
      isLocal: v.localService,
    }));
  }

  public setVoice(voiceName: string) {
    const v = this.voices.find((item) => item.name === voiceName);
    if (v) {
      this.selectedVoice = v;
    }
  }

  public setRate(rate: number) {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
    if (this.state === 'playing' && this.currentUtterance) {
      // Note: In standard Web Speech API, changing rate mid-utterance requires restart,
      // handled by user or next paragraph.
    }
  }

  public setPitch(pitch: number) {
    this.pitch = Math.max(0.5, Math.min(1.5, pitch));
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1.0, volume));
  }

  public getState(): SpeechState {
    return this.state;
  }

  public setCallbacks(callbacks: {
    onStateChange?: (state: SpeechState) => void;
    onBoundary?: (charIndex: number, charLength: number) => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }) {
    this.onStateChangeCallback = callbacks.onStateChange;
    this.onBoundaryCallback = callbacks.onBoundary;
    this.onEndCallback = callbacks.onEnd;
    this.onErrorCallback = callbacks.onError;
  }

  public speak(text: string, startIndex: number = 0) {
    if (!this.synth) {
      if (this.onErrorCallback) this.onErrorCallback('Speech synthesis is not supported on this device/browser');
      return;
    }

    this.stop();

    const cleanText = text.substring(startIndex).trim();
    if (!cleanText) {
      this.updateState('idle');
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;

    utterance.onstart = () => {
      this.updateState('playing');
    };

    utterance.onpause = () => {
      this.updateState('paused');
    };

    utterance.onresume = () => {
      this.updateState('playing');
    };

    utterance.onend = () => {
      this.updateState('idle');
      this.currentUtterance = null;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.error('Speech synthesis error:', e);
        if (this.onErrorCallback) this.onErrorCallback(e);
      }
      this.updateState('idle');
      this.currentUtterance = null;
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word' || event.name === 'sentence') {
        const idx = (startIndex || 0) + event.charIndex;
        const len = event.charLength || 6;
        if (this.onBoundaryCallback) {
          this.onBoundaryCallback(idx, len);
        }
      }
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.state === 'playing') {
      this.synth.pause();
      this.updateState('paused');
    }
  }

  public resume() {
    if (this.synth && this.state === 'paused') {
      this.synth.resume();
      this.updateState('playing');
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
      this.updateState('stopped');
    }
  }

  private updateState(newState: SpeechState) {
    this.state = newState;
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(newState);
    }
  }
}

export const speechService = new SpeechService();
