import { copyToClipboard } from './clipboard';

export interface ShareOptions {
  title?: string;
  text: string;
  url?: string;
}

export async function shareContent(options: ShareOptions): Promise<{ success: boolean; method: 'native' | 'clipboard' }> {
  const shareData = {
    title: options.title || 'Pragati Sahayak Font Generator',
    text: options.text,
    url: options.url || window.location.href
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: false, method: 'native' };
      }
      console.warn('Native share failed, falling back to copy:', err);
    }
  }

  // Fallback: Copy styled text to clipboard
  const copied = await copyToClipboard(options.text);
  return { success: copied, method: 'clipboard' };
}

export function buildShareableUrl(text: string, styleId?: string): string {
  const url = new URL(window.location.href);
  if (text) {
    url.searchParams.set('text', encodeURIComponent(text));
  }
  if (styleId) {
    url.searchParams.set('style', styleId);
  }
  return url.toString();
}
