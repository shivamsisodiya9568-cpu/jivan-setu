// --- Font Generator types (legacy, kept for compatibility) ---
export interface FontStyleDefinition {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  example: string;
  isPopular?: boolean;
  isNew?: boolean;
  generator: (text: string) => string;
}

export interface TextCustomizerOptions {
  prefix: string;
  suffix: string;
  separator: string;
  caseTransform: 'none' | 'uppercase' | 'lowercase' | 'title' | 'alternating';
  reverse: boolean;
  spaceBetween: boolean;
}

export type PageSize = 'a4' | 'letter' | 'a5' | 'legal';
export type PageOrientation = 'portrait' | 'landscape';
export type MarginSize = 'normal' | 'compact' | 'wide' | 'custom' | 'none';
export type PageTheme = 'white' | 'warm' | 'cream' | 'dark' | 'grid' | 'border';

export interface DocumentMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type FontFamily = 'Helvetica' | 'TimesRoman' | 'Courier' | 'Inter' | 'Merriweather' | 'JetBrainsMono';

export interface DocumentSection {
  id: string;
  type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'bullet_list' | 'numbered_list' | 'blockquote' | 'code' | 'image' | 'divider' | 'page_break';
  content: string;
  items?: string[]; // for lists
  align?: 'left' | 'center' | 'right' | 'justify';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  fontSize?: number;
  imageUrl?: string;
  imageCaption?: string;
  imageWidth?: number; // percentage (20 - 100)
}

export interface DocumentSettings {
  title: string;
  author: string;
  subject: string;
  pageSize: PageSize;
  orientation: PageOrientation;
  margins: DocumentMargins;
  marginPreset: MarginSize;
  theme: PageTheme;
  fontFamily: FontFamily;
  baseFontSize: number;
  lineHeight: number;
  headerText: string;
  footerText: string;
  showPageNumbers: boolean;
  pageNumberPosition: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  pageNumberFormat: 'page-of-total' | 'simple-number' | 'dash-number' | 'roman';
}

export interface DocumentProject {
  id: string;
  title: string;
  updatedAt: number;
  settings: DocumentSettings;
  sections: DocumentSection[];
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: 'business' | 'academic' | 'creative' | 'official' | 'personal';
  description: string;
  settings: DocumentSettings;
  sections: DocumentSection[];
}

export interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  pageCount?: number;
  status: 'idle' | 'processing' | 'done' | 'error';
  errorMessage?: string;
}

export interface PdfPageThumbnail {
  pageNumber: number;
  imageUrl: string;
  rotation: number; // 0, 90, 180, 270
  selected?: boolean;
}

export interface WatermarkSettings {
  text: string;
  fontSize: number;
  opacity: number; // 0.05 to 1.0
  rotation: number; // -90 to +90
  color: string;
  layer: 'over' | 'under';
  diagonal: boolean;
}

export interface PageNumberSettings {
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  format: 'page-of-total' | 'simple-number' | 'dash-number';
  startFrom: number;
  fontSize: number;
  color: string;
  includeFirstPage: boolean;
}

export interface ReadingProgress {
  documentId: string;
  title: string;
  currentPage: number;
  totalPages: number;
  percentage: number;
  lastReadAt: number;
  selectedVoiceName?: string;
  speechRate?: number;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: number;
  actionType?: 'summary' | 'key_points' | 'vocabulary' | 'questions' | 'notes';
}

// Legacy font-generator types (kept for hook compatibility)
export interface FavoriteItem {
  id: string;
  styleId: string;
  styleName: string;
  originalText: string;
  styledText: string;
  category: string;
  savedAt: number;
}

export interface GenerationHistoryItem {
  id: string;
  text: string;
  timestamp: number;
  styleCount: number;
}
