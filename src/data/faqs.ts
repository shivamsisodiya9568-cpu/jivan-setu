export interface FaqItem {
  id: string;
  category: 'general' | 'privacy' | 'generator' | 'tools' | 'reader' | 'voice';
  question: string;
  answer: string;
}

export const FAQS_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'What is Pragati Sahayak PDF Generator?',
    answer: 'Pragati Sahayak PDF Generator is a unified, privacy-first online document suite. It allows you to create professional vector PDFs from scratch, merge, split, compress, rotate, watermark documents, view PDFs in a rich reader, and listen to books and documents aloud using browser-native speech synthesis.',
  },
  {
    id: 'faq-2',
    category: 'general',
    question: 'Is Pragati Sahayak PDF Generator free to use?',
    answer: 'Yes, Pragati Sahayak is 100% free and open. All core document generation, editing, reading, and text-to-speech features operate entirely without subscription fees, paywalls, or feature limits.',
  },
  {
    id: 'faq-3',
    category: 'privacy',
    question: 'Are my uploaded documents stored on your servers?',
    answer: 'No. Pragati Sahayak is built on a strict privacy-first architecture. All PDF processing, rendering, text parsing, and audio generation execute 100% client-side inside your browser sandbox. Your files and personal data are never transmitted or stored on external servers.',
  },
  {
    id: 'faq-4',
    category: 'generator',
    question: 'Can I create a PDF from formatted text and images?',
    answer: 'Yes! The PDF Generator studio provides a rich document editor supporting headings, paragraphs, bullet and numbered lists, blockquotes, code blocks, page breaks, custom margins, color palettes, and embedded high-resolution images with custom alignments.',
  },
  {
    id: 'faq-5',
    category: 'tools',
    question: 'Can I merge multiple PDFs into one file?',
    answer: 'Yes. The Merge PDF tool allows you to select or drag multiple PDF files, reorder them visually, and combine them into a single consolidated PDF document with one click.',
  },
  {
    id: 'faq-6',
    category: 'tools',
    question: 'Can I split a PDF and extract specific pages?',
    answer: 'Yes. With the Split PDF tool, you can preview all pages as visual thumbnails and extract custom page ranges (e.g., "1-3, 5, 8-10"), individual pages, or download each page separately packed into a convenient ZIP archive.',
  },
  {
    id: 'faq-7',
    category: 'tools',
    question: 'Can I compress a PDF to reduce its file size?',
    answer: 'Yes. The Compress PDF tool optimizes internal PDF object streams, eliminates duplicate structures, and strips unnecessary metadata to reduce file footprint without degrading document clarity.',
  },
  {
    id: 'faq-8',
    category: 'voice',
    question: 'Can I read a PDF aloud using speech synthesis?',
    answer: 'Yes. The Read Aloud feature utilizes your browser’s native Speech Synthesis API to read documents with natural human voices. You can adjust playback speed from 0.5x to 2.0x, choose different voices, and follow along with real-time highlighted sentences.',
  },
  {
    id: 'faq-9',
    category: 'voice',
    question: 'Can I upload a book and listen to it?',
    answer: 'Yes. You can upload any standard PDF book or text document into the Book Reader. Pragati Sahayak calculates estimated reading time, tracks your progress in local browser storage, and automatically advances through pages and chapters as you listen.',
  },
  {
    id: 'faq-10',
    category: 'reader',
    question: 'Does the PDF reader work on mobile devices?',
    answer: 'Yes. The reader is fully responsive, supporting smartphones, tablets, laptops, and large desktop monitors with touch-friendly navigation, zooming, and full-screen reading modes.',
  },
  {
    id: 'faq-11',
    category: 'general',
    question: 'Do I need to create an account or sign in?',
    answer: 'No account, sign-up, or email is required. You can immediately access all tools and document creation capabilities directly in your web browser.',
  },
  {
    id: 'faq-12',
    category: 'tools',
    question: 'Can I convert images into PDF or PDF pages into images?',
    answer: 'Yes. Image to PDF converts multiple JPG, PNG, or WebP images into a clean multi-page PDF. PDF to Image renders high-DPI raster images for each page, allowing individual image downloads or a single batch ZIP download.',
  },
  {
    id: 'faq-13',
    category: 'voice',
    question: 'Does the read-aloud feature work on every browser?',
    answer: 'The Read Aloud engine works on all modern web browsers supporting the W3C Web Speech API, including Chrome, Safari, Edge, Firefox, and Chromium-based mobile browsers. If your browser lacks voice support, a clear notification will explain the limitation.',
  },
  {
    id: 'faq-14',
    category: 'general',
    question: 'Does Pragati Sahayak require an AI API key?',
    answer: 'No. All core document processing, PDF creation, and the Pragati Document Assistant’s summarizer operate locally using built-in NLP heuristics. An optional Bring-Your-Own-Key (BYOK) setting is available for power users who wish to connect Google Gemini or OpenAI, but it is entirely optional.',
  },
  {
    id: 'faq-15',
    category: 'general',
    question: 'Can I use the generated PDFs commercially?',
    answer: 'Yes. All documents and PDFs generated through Pragati Sahayak are your sole property and can be used for commercial, academic, official, or personal endeavors.',
  },
];
