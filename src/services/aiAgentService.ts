import { AgentChatMessage } from '../types';
import { FONT_STYLES } from '../data/fontStyles';

// Keyword matching categories for intelligent local assistant
const INTENT_RULES = [
  {
    keywords: ['game', 'gaming', 'clan', 'pubg', 'free fire', 'bgmi', 'warrior', 'blade', 'cod', 'valorant', 'discord', 'tag', 'ign'],
    reply: "Here are high-impact gaming and battle-ready font styles tailored for clans, gamer tags, and streaming IDs! ⚔️🔥",
    styleIds: ['gaming-warrior', 'electric-cyber', 'fraktur-bold', 'fire-blaze', 'squared-dark', 'zalgo-glitch']
  },
  {
    keywords: ['insta', 'instagram', 'bio', 'caption', 'tiktok', 'aesthetic', 'story', 'post', 'aesthetic'],
    reply: "Here are sleek aesthetic typography styles that look gorgeous in Instagram and TikTok bios! ✨📸",
    styleIds: ['small-caps', 'smallcaps-stars', 'script-bold', 'sparkle-aesthetic', 'math-bold-italic', 'japanese-ribbon']
  },
  {
    keywords: ['cute', 'girlfriend', 'gf', 'love', 'sweet', 'heart', 'baby', 'romantic', 'couple', 'blossom', 'butterfly', 'crush'],
    reply: "Aww, here are the sweetest, cutest aesthetic fonts with delicate hearts and flourishes! 💖🌸",
    styleIds: ['heart-aesthetic', 'butterfly-aesthetic', 'cherry-blossom', 'sparkle-aesthetic', 'script-normal', 'circled-normal']
  },
  {
    keywords: ['pro', 'professional', 'linkedin', 'business', 'resume', 'corporate', 'office', 'headline', 'sans', 'clean'],
    reply: "Here are clean, authoritative modern sans-serif and mathematical styles tailored for executive profiles and LinkedIn! 💼📈",
    styleIds: ['sans-bold', 'sans-normal', 'math-bold', 'monospace', 'double-struck', 'spaced-zen']
  },
  {
    keywords: ['gothic', 'dark', 'fraktur', 'metal', 'medieval', 'tattoo', 'emo', 'shadow', 'death', 'skull'],
    reply: "Embrace the shadows! Here are heavy Blackletter Fraktur and dark gothic medieval styles. ☠️🕯️",
    styleIds: ['fraktur-bold', 'skull-gothic', 'fraktur-normal', 'slash-through', 'zalgo-glitch']
  },
  {
    keywords: ['fancy', 'cursive', 'script', 'calligraphy', 'handwriting', 'elegant', 'wedding', 'luxury', 'crown'],
    reply: "Here are luxurious calligraphy and high-elegance cursive fonts with ornate flourishes. 👑🖋️",
    styleIds: ['script-bold', 'royal-wings', 'japanese-ribbon', 'script-normal', 'diamond-luxury', 'corner-quotes']
  },
  {
    keywords: ['glitch', 'hacker', 'corrupt', 'chaos', 'void', 'zalgo', 'matrix', 'leet', '1337', 'code', 'morse'],
    reply: "Entering digital cyberspace! Here are distorted glitch, hacker, and cipher styles. ⚡👾",
    styleIds: ['zalgo-glitch', 'leet-speak', 'electric-cyber', 'monospace', 'morse-code', 'slash-through']
  },
  {
    keywords: ['bubble', 'circle', 'round', 'square', 'box', 'badge', 'bracket'],
    reply: "Here are geometric badges, bubble circles, and boxed letter forms! Ⓟ🄾🆇",
    styleIds: ['circled-normal', 'circled-dark', 'squared-outline', 'squared-dark', 'kanji-brackets', 'parenthesized']
  }
];

// Helper to extract subject text from user prompt (e.g., "Give me a cool font for DragonSlayer")
function extractTargetText(query: string, defaultText: string = 'Pragati Sahayak'): string {
  const matchQuotes = query.match(/["']([^"']+)["']/);
  if (matchQuotes && matchQuotes[1]) return matchQuotes[1].trim();

  const forMatch = query.match(/(?:for|named|saying|text|name|word)\s+([A-Za-z0-9_\- ]{2,30})/i);
  if (forMatch && forMatch[1]) {
    const candidate = forMatch[1].trim();
    // remove trailing words like "style", "font", "please"
    const cleaned = candidate.replace(/\b(font|fonts|style|styles|please|generator)\b/gi, '').trim();
    if (cleaned.length > 1) return cleaned;
  }

  return defaultText;
}

export async function processAgentQuery(
  userQuery: string,
  currentDefaultText: string = 'Pragati Sahayak'
): Promise<AgentChatMessage> {
  const queryLower = userQuery.toLowerCase();
  const sampleText = extractTargetText(userQuery, currentDefaultText || 'Pragati Sahayak');

  // Search matching rules
  let matchedRule = INTENT_RULES.find((rule) =>
    rule.keywords.some((kw) => queryLower.includes(kw))
  );

  // Default fallback if no keyword matches
  if (!matchedRule) {
    matchedRule = {
      keywords: [],
      reply: `Here is a curated mix of the most popular, stylish, and eye-catching font transformations for "${sampleText}"! ✨`,
      styleIds: ['math-bold', 'script-bold', 'small-caps', 'sparkle-aesthetic', 'fraktur-bold', 'double-struck', 'royal-wings']
    };
  }

  // Generate recommendations
  const recommendations = matchedRule.styleIds
    .map((id) => {
      const def = FONT_STYLES.find((s) => s.id === id);
      if (!def) return null;
      return {
        styleId: def.id,
        styleName: def.name,
        styledText: def.generator(sampleText),
        reason: def.description,
        category: def.category
      };
    })
    .filter(Boolean) as {
      styleId: string;
      styleName: string;
      styledText: string;
      reason: string;
      category: string;
    }[];

  return {
    id: 'agent-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    sender: 'agent',
    text: matchedRule.reply,
    timestamp: Date.now(),
    recommendations
  };
}

export const SUGGESTED_PROMPTS = [
  "Give me a cool gaming clan name",
  "Aesthetic font for my Instagram bio",
  "Cute romantic font for my girlfriend",
  "Professional LinkedIn headline font",
  "Dark Gothic font for Discord",
  "Luxury cursive style with crown wings",
  "Cyberpunk glitch text for hacker tag",
  "Cute bubble letters for notes"
];
