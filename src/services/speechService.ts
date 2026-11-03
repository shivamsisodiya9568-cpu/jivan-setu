/**
 * Speech Recognition (STT) and Speech Synthesis (TTS) Helper
 * with bilingual support for English and Hindi.
 */

// Window speech recognition types
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export type SpeechState = any;
export type SpeechVoiceOption = any;

export const SpeechService = {
  isRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as IWindow;
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  },

  isSynthesisSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window;
  },

  startDictation(
    language: 'en' | 'hi',
    onResult: (text: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): { stop: () => void } | null {
    if (!this.isRecognitionSupported()) {
      onError('Speech recognition is not supported in this browser. Please use standard text input.');
      return null;
    }

    const win = window as IWindow;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    const recognition = new SpeechRec();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      onError(`Voice input error: ${event.error || 'Check microphone permission'}`);
    };

    recognition.onend = () => {
      onEnd();
    };

    try {
      recognition.start();
      return {
        stop: () => {
          try {
            recognition.stop();
          } catch {
            // ignore
          }
        }
      };
    } catch (e: any) {
      onError(e.message || 'Unable to access microphone.');
      return null;
    }
  },

  speakText(text: string, language: 'en' | 'hi' = 'en'): void {
    if (!this.isSynthesisSupported()) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // Slightly slower for clarity in emergencies
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  },

  stopSpeaking(): void {
    if (this.isSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
  }
};

export const speechService: any = SpeechService;

