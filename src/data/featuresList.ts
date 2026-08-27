export interface FeatureDetail {
  id: string;
  category: string;
  title: string;
  description: string;
  highlights: string[];
  iconName: string;
}

export const FEATURES_DATA: FeatureDetail[] = [
  {
    id: 'pdf-generator-engine',
    category: 'Creation & Formatting',
    title: 'Vector PDF Creation Studio',
    description: 'Design professional documents with precise typographic hierarchy, custom paper sizes, margins, headers, and dynamic page numbering.',
    highlights: [
      'Multi-page real-time layout flow',
      'Rich typography (Helvetica, Times Roman, Courier, Inter)',
      'Heading levels (H1, H2, H3) & stylized blockquotes',
      'Bullet points and numbered step-by-step lists',
      'Custom image embedding with aspect-ratio preservation',
      'Page breaks, horizontal dividers, and code blocks',
    ],
    iconName: 'FilePlus2',
  },
  {
    id: 'pdf-tools-suite',
    category: 'Document Manipulation',
    title: 'Comprehensive PDF Tools Suite',
    description: 'Transform, combine, and organize PDF documents directly inside your browser sandbox with zero quality loss.',
    highlights: [
      'Merge multiple PDFs into a single unified file',
      'Split PDFs and extract specific page ranges or download as ZIP',
      'Rotate individual or all pages by 90°, 180°, or 270°',
      'Visual drag-and-drop page reordering and deletion',
      'Compress & optimize object streams for reduced file size',
      'Add custom diagonal watermarks with variable opacity',
      'Inject customized top/bottom page numbers',
    ],
    iconName: 'Wrench',
  },
  {
    id: 'pdf-reader-experience',
    category: 'Reading & Viewing',
    title: 'High-Fidelity Document Reader',
    description: 'A focused, distraction-free PDF viewer built with WebAssembly-grade precision and smooth multi-page navigation.',
    highlights: [
      'Interactive zoom (50% to 200%, Fit to Width, Fit to Page)',
      'In-document full-text search with instant snippet navigation',
      'Sidebar thumbnail navigator for rapid page hopping',
      'Multiple reading themes: Modern Light, Executive Dark, Warm Sepia',
      'Print and download with a single keystroke',
      'Clean full-screen reading mode',
    ],
    iconName: 'BookOpen',
  },
  {
    id: 'speech-synthesis-engine',
    category: 'Auditory & Accessibility',
    title: 'Synchronized Voice & Read Aloud',
    description: 'Convert any uploaded book or document into an immersive spoken audio experience powered by the native Web Speech API.',
    highlights: [
      'Sentence-by-sentence synchronized text highlighting',
      'Adjustable playback speed (0.5x, 0.75x, 1.0x, 1.25x, 1.5x, 1.75x, 2.0x)',
      'Support for natural system voices across multiple languages',
      'Auto-advancement across paragraphs and consecutive pages',
      'Reading progress persistence with localStorage',
      'Estimated remaining reading time calculation',
    ],
    iconName: 'Volume2',
  },
  {
    id: 'pragati-assistant',
    category: 'Analysis & Intelligence',
    title: 'Pragati Document Assistant',
    description: 'Extract key takeaways, generate comprehension questions, summarize chapters, and analyze terminology.',
    highlights: [
      '100% private local heuristic NLP engine with zero external API calls required',
      'Extractive chapter and section summarization',
      'Key bullet points and executive takeaways extractor',
      'Technical vocabulary & terminology explainer',
      'Self-study question and quiz generator',
      'Optional Bring-Your-Own-Key (BYOK) connector for Google Gemini & OpenAI',
    ],
    iconName: 'Sparkles',
  },
  {
    id: 'privacy-architecture',
    category: 'Security & Privacy',
    title: 'Zero-Server Privacy Guarantee',
    description: 'Confidential corporate contracts, financial statements, and personal books never leave your local device.',
    highlights: [
      '100% client-side WebAssembly & JavaScript execution',
      'No server uploads or external database storage',
      'No account registration, cookies tracking, or paywalls',
      'Full offline capability after initial web app caching',
      'Completely transparent, privacy-first technical design',
    ],
    iconName: 'ShieldCheck',
  },
];
