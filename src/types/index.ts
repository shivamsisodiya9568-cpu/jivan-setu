export type FontCategory =
  | 'all'
  | 'popular'
  | 'stylish'
  | 'fancy'
  | 'gaming'
  | 'social'
  | 'cute'
  | 'professional'
  | 'gothic'
  | 'symbols'
  | 'unicode';

export interface FontStyleDefinition {
  id: string;
  name: string;
  category: FontCategory;
  tags: string[];
  description: string;
  example: string;
  generator: (text: string) => string;
  isPopular?: boolean;
}

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

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: number;
  recommendations?: {
    styleId: string;
    styleName: string;
    styledText: string;
    reason: string;
    category: string;
  }[];
}

export interface TextCustomizerOptions {
  prefix: string;
  suffix: string;
  caseTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize' | 'alternating';
  zalgoIntensity: number; // 1-10
}
