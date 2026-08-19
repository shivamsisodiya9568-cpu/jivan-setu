import { FontStyleDefinition } from '../types';
import {
  CHAR_MAPS,
  mapString,
  addCombiningMark,
  toSuperscript,
  toSubscript,
  toUpsideDown,
  toReversed,
  toParenthesized,
  toZalgo,
  toLeet,
  toMorse
} from '../utils/fontGenerators';

export const FONT_STYLES: FontStyleDefinition[] = [
  // 1. Math Bold
  {
    id: 'math-bold',
    name: 'Mathematical Bold',
    category: 'popular',
    tags: ['bold', 'heavy', 'thick', 'instagram', 'header', 'professional'],
    description: 'Clean, punchy bold characters that stand out on any platform.',
    example: '𝐏𝐫𝐚𝐠𝐚𝐭𝐢 𝐒𝐚𝐡𝐚𝐲𝐚𝐤',
    isPopular: true,
    generator: (t) => mapString(t, CHAR_MAPS.boldUpper, CHAR_MAPS.boldLower, CHAR_MAPS.boldDigits)
  },

  // 2. Math Italic
  {
    id: 'math-italic',
    name: 'Mathematical Italic',
    category: 'stylish',
    tags: ['italic', 'slanted', 'elegant', 'bio', 'quote'],
    description: 'Gracefully slanted letters with mathematical precision.',
    example: '𝑃𝑟𝑎𝑔𝑎𝑡𝑖 𝑆𝑎ℎ𝑎𝑦𝑎𝑘',
    isPopular: true,
    generator: (t) => mapString(t, CHAR_MAPS.italicUpper, CHAR_MAPS.italicLower)
  },

  // 3. Math Bold Italic
  {
    id: 'math-bold-italic',
    name: 'Mathematical Bold Italic',
    category: 'popular',
    tags: ['bold', 'italic', 'heavy', 'slanted', 'stylish'],
    description: 'Combines the power of bold weights with italic slant.',
    example: '𝑷𝒓𝒂𝒈𝒂𝒕𝒊 𝑺𝒂𝒉𝒂𝒚𝒂𝒌',
    isPopular: true,
    generator: (t) => mapString(t, CHAR_MAPS.boldItalicUpper, CHAR_MAPS.boldItalicLower)
  },

  // 4. Sans-Serif Normal
  {
    id: 'sans-normal',
    name: 'Modern Sans-Serif',
    category: 'professional',
    tags: ['clean', 'modern', 'minimal', 'sans', 'simple'],
    description: 'Ultra-clean sans-serif typeface suitable for sleek captions.',
    example: '𝖯𝗋𝖺𝗀𝖺𝗍𝗂 𝖲𝖺𝗁𝖺𝗒𝖺𝗄',
    generator: (t) => mapString(t, CHAR_MAPS.sansUpper, CHAR_MAPS.sansLower, CHAR_MAPS.sansDigits)
  },

  // 5. Sans-Serif Bold
  {
    id: 'sans-bold',
    name: 'Sans-Serif Bold',
    category: 'professional',
    tags: ['bold', 'sans', 'modern', 'clean', 'linkedin', 'headline'],
    description: 'Modern corporate bold typeface for LinkedIn and business profiles.',
    example: '𝗣𝗿𝗮𝗴𝗮𝘁𝗶 𝗦𝗮𝗵𝗮𝘆𝗮𝗸',
    isPopular: true,
    generator: (t) => mapString(t, CHAR_MAPS.sansBoldUpper, CHAR_MAPS.sansBoldLower, CHAR_MAPS.sansBoldDigits)
  },

  // 6. Script / Cursive
  {
    id: 'script-normal',
    name: 'Classic Script Cursive',
    category: 'fancy',
    tags: ['script', 'cursive', 'handwritten', 'aesthetic', 'cute', 'calligraphy'],
    description: 'Delicate cursive script resembling fountain pen calligraphy.',
    example: '𝒫𝓇𝒶ℊ𝒶𝓉𝒾 𝒮𝒶𝒽𝒶𝓎𝒶𝓀',
    isPopular: true,
    generator: (t) => mapString(t, CHAR_MAPS.scriptUpper, CHAR_MAPS.scriptLower)
  },

  // 7. Script Bold
  {
    id: 'script-bold',
    name: 'Bold Script Calligraphy',
    category: 'fancy',
    tags: ['script', 'cursive', 'bold', 'calligraphy', 'fancy', 'aesthetic', 'instagram'],
    description: 'Luxurious heavy calligraphy with swooping flourishes.',
    example: '𝓟𝓻𝓪𝓰𝓪𝓽𝓲 𝓢𝓪𝓱𝓪𝔂𝓪𝓴',
    isPopular: true,
    generator: (t) => mapString(t, CHAR_MAPS.scriptBoldUpper, CHAR_MAPS.scriptBoldLower)
  },

  // 8. Fraktur / Gothic
  {
    id: 'fraktur-normal',
    name: 'Fraktur Gothic',
    category: 'gothic',
    tags: ['gothic', 'fraktur', 'medieval', 'dark', 'vintage', 'tattoo'],
    description: 'Authentic 16th-century Blackletter Fraktur typesetting.',
    example: '𝔓𝔯𝔞𝔤𝔞𝔱𝔦 𝔖𝔞𝔥𝔞𝔶𝔞𝔨',
    generator: (t) => mapString(t, CHAR_MAPS.frakturUpper, CHAR_MAPS.frakturLower)
  },

  // 9. Fraktur Bold
  {
    id: 'fraktur-bold',
    name: 'Gothic Bold / Old English',
    category: 'gothic',
    tags: ['gothic', 'fraktur', 'bold', 'metal', 'gaming', 'discord'],
    description: 'Heavy Blackletter Gothic text popular for gaming clans and metal music.',
    example: '𝕻𝖗𝖆𝖌𝖆𝖙𝖎 𝕾𝖆𝖍𝖆𝖞𝖆𝖐',
    isPopular: true,
    generator: (t) => mapString(t, CHAR_MAPS.frakturBoldUpper, CHAR_MAPS.frakturBoldLower)
  },

  // 10. Double-Struck / Blackboard
  {
    id: 'double-struck',
    name: 'Double-Struck / Blackboard',
    category: 'stylish',
    tags: ['double', 'struck', 'blackboard', 'outline', 'math', 'academic', 'stylish'],
    description: 'Hollow chalkboard mathematical typography.',
    example: 'ℙ𝕣𝕒𝕘𝕒𝕥𝕚 𝕊𝕒𝕙𝕒𝕪𝕒𝕜',
    isPopular: true,
    generator: (t) => mapString(t, CHAR_MAPS.doubleStruckUpper, CHAR_MAPS.doubleStruckLower, CHAR_MAPS.doubleStruckDigits)
  },

  // 11. Monospace / Typewriter
  {
    id: 'monospace',
    name: 'Monospace Typewriter',
    category: 'professional',
    tags: ['code', 'monospace', 'typewriter', 'developer', 'retro', 'terminal'],
    description: 'Fixed-width vintage typewriter & terminal font.',
    example: '𝙿𝚛𝚊𝚐𝚊𝚝𝚒 𝚂𝚊𝚑𝚊𝚢𝚊𝚔',
    isPopular: true,
    generator: (t) => mapString(t, CHAR_MAPS.monoUpper, CHAR_MAPS.monoLower, CHAR_MAPS.monoDigits)
  },

  // 12. Circled / Bubble
  {
    id: 'circled-normal',
    name: 'Circled Bubble',
    category: 'cute',
    tags: ['circle', 'bubble', 'cute', 'round', 'friendly'],
    description: 'Playful characters encased in clean geometric circles.',
    example: 'Ⓟⓡⓐⓖⓐⓣⓘ Ⓢⓐⓗⓐⓨⓐⓚ',
    isPopular: true,
    generator: (t) => mapString(t, CHAR_MAPS.circledUpper, CHAR_MAPS.circledLower, CHAR_MAPS.circledDigits)
  },

  // 13. Dark Inverted Circled
  {
    id: 'circled-dark',
    name: 'Negative Circled Dark',
    category: 'symbols',
    tags: ['circle', 'inverted', 'black', 'badge', 'gaming'],
    description: 'Bold white characters on solid black circular badges.',
    example: '🅟🅡🅐🅖🅐🅣🅘 🅢🅐🅗🅐🅨🅐🅚',
    generator: (t) => mapString(t.toUpperCase(), CHAR_MAPS.negCircledUpper, undefined, CHAR_MAPS.negCircledDigits)
  },

  // 14. Squared Outline
  {
    id: 'squared-outline',
    name: 'Squared Box Outline',
    category: 'symbols',
    tags: ['square', 'box', 'border', 'clean', 'tag'],
    description: 'Distinctive uppercase characters inside sharp square outlines.',
    example: '🄿🅁🄰🄶🄰🅃🄸 🅂🄰🄷🄰🅈🄰🄺',
    generator: (t) => mapString(t.toUpperCase(), CHAR_MAPS.squaredUpper)
  },

  // 15. Squared Dark
  {
    id: 'squared-dark',
    name: 'Negative Squared Dark',
    category: 'gaming',
    tags: ['square', 'dark', 'badge', 'gaming', 'discord', 'tag'],
    description: 'Solid square blocks with inverted white lettering.',
    example: '🅿🆁🅰🅶🅰🆃🅸 🆂🅰🅷🅰🆈🅰🅺',
    generator: (t) => mapString(t.toUpperCase(), CHAR_MAPS.negSquaredUpper)
  },

  // 16. Small Caps
  {
    id: 'small-caps',
    name: 'Aesthetic Small Caps',
    category: 'popular',
    tags: ['smallcaps', 'caps', 'aesthetic', 'instagram', 'bio', 'minimal'],
    description: 'Clean petite capital glyphs widely loved across Instagram and TikTok bios.',
    example: 'ᴘʀᴀɢᴀᴛɪ sᴀʜᴀʏᴀᴋ',
    isPopular: true,
    generator: (t) => mapString(t, CHAR_MAPS.smallCapsUpper, CHAR_MAPS.smallCapsLower)
  },

  // 17. Fullwidth / Vaporwave
  {
    id: 'fullwidth',
    name: 'Fullwidth Vaporwave',
    category: 'stylish',
    tags: ['vaporwave', 'wide', 'spaced', 'aesthetic', 'retro', 'synthwave'],
    description: 'Spaced Japanese Zenkaku fullwidth aesthetic characters.',
    example: 'Ｐｒａｇａｔｉ　Ｓａｈａｙａｋ',
    generator: (t) => mapString(t, CHAR_MAPS.fullwidthUpper, CHAR_MAPS.fullwidthLower, CHAR_MAPS.fullwidthDigits)
  },

  // 18. Superscript
  {
    id: 'superscript',
    name: 'Tiny Superscript',
    category: 'cute',
    tags: ['superscript', 'tiny', 'small', 'cute', 'formula'],
    description: 'Delicate elevated miniature text for subtle annotations.',
    example: 'ᴾʳᵃᵍᵃᵗⁱ ˢᵃʰᵃʸᵃᵏ',
    generator: (t) => toSuperscript(t)
  },

  // 19. Subscript
  {
    id: 'subscript',
    name: 'Subscript Lower',
    category: 'unicode',
    tags: ['subscript', 'low', 'small', 'chemistry'],
    description: 'Lower-baseline subscript text characters.',
    example: 'ₚᵣₐ₉ₐₜᵢ ₛₐₕₐᵧₐₖ',
    generator: (t) => toSubscript(t)
  },

  // 20. Strikethrough Single
  {
    id: 'strike-single',
    name: 'Single Strikethrough',
    category: 'social',
    tags: ['strike', 'line', 'cancelled', 'twitter', 'discount'],
    description: 'Continuous horizontal line struck through your text.',
    example: 'P̶r̶a̶g̶a̶t̶i̶ ̶S̶a̶h̶a̶y̶a̶k̶',
    generator: (t) => addCombiningMark(t, '\u0336')
  },

  // 21. Single Underline
  {
    id: 'underline-single',
    name: 'Underline Continuous',
    category: 'social',
    tags: ['underline', 'line', 'emphasis', 'important'],
    description: 'Crisp underline beneath every character.',
    example: 'P̲r̲a̲g̲a̲t̲i̲ ̲S̲a̲h̲a̲y̲a̲k̲',
    generator: (t) => addCombiningMark(t, '\u0332')
  },

  // 22. Double Underline
  {
    id: 'underline-double',
    name: 'Double Underline',
    category: 'stylish',
    tags: ['underline', 'double', 'emphasis', 'stylish'],
    description: 'Prominent dual underlines beneath words.',
    example: 'P̳r̳a̳g̳a̳t̳i̳ ̳S̳a̳h̳a̳y̳a̳k̳',
    generator: (t) => addCombiningMark(t, '\u0333')
  },

  // 23. Wave Underline
  {
    id: 'underline-wave',
    name: 'Wavy Tilde Underline',
    category: 'cute',
    tags: ['wave', 'tilde', 'cute', 'quirky', 'ocean'],
    description: 'Playful wavy squiggles dancing under text.',
    example: 'P̰r̰a̰g̰a̰t̰ḭ ̰S̰a̰h̰a̰y̰a̰k̰',
    generator: (t) => addCombiningMark(t, '\u0330')
  },

  // 24. Slash Through
  {
    id: 'slash-through',
    name: 'Diagonal Slash Through',
    category: 'symbols',
    tags: ['slash', 'cut', 'glitch', 'cyber'],
    description: 'Edgy diagonal strike slashes cutting across each character.',
    example: 'P̷r̷a̷g̷a̷t̷i̷ ̷S̷a̷h̷a̷y̷a̷k̷',
    generator: (t) => addCombiningMark(t, '\u0338')
  },

  // 25. Dot Above
  {
    id: 'dot-above',
    name: 'Stippled Dot Above',
    category: 'cute',
    tags: ['dot', 'minimal', 'cute', 'clean'],
    description: 'Minimalist aesthetic accent dots perched on top.',
    example: 'Ṗṙȧġȧṫi̇ ̇Ṡȧḣȧẏȧk̇',
    generator: (t) => addCombiningMark(t, '\u0307')
  },

  // 26. Upside Down / Flip
  {
    id: 'upside-down',
    name: 'Upside Down / Flipped',
    category: 'gaming',
    tags: ['flip', 'upsidedown', 'inverted', 'puzzle', 'discord'],
    description: 'Completely inverted upside-down mirror flip.',
    example: 'ʞɐʎɐɥS ıʇɐƃɐɹԀ',
    generator: (t) => toUpsideDown(t)
  },

  // 27. Reversed / Mirror
  {
    id: 'reversed-mirror',
    name: 'Reversed Mirror Reflection',
    category: 'stylish',
    tags: ['reverse', 'mirror', 'backward', 'reflection'],
    description: 'Backwards reflection of Latin characters.',
    example: 'ʞɒyɒdɒꙄ iʇɒϱɒяꟼ',
    generator: (t) => toReversed(t)
  },

  // 28. Parenthesized
  {
    id: 'parenthesized',
    name: 'Parenthesized Enclosure',
    category: 'unicode',
    tags: ['parenthesis', 'brackets', 'contained', 'numbers'],
    description: 'Individual characters wrapped in round parenthesized curves.',
    example: '⒫⒭⒜⒢⒜⒯⒤ ⒮⒜⒣⒜⒴⒜⒦',
    generator: (t) => toParenthesized(t)
  },

  // 29. Sparkle Aesthetic
  {
    id: 'sparkle-aesthetic',
    name: 'Sparkle Star Glow',
    category: 'cute',
    tags: ['sparkle', 'star', 'cute', 'glow', 'instagram', 'aesthetic'],
    description: 'Surrounded by shimmering celestial stars and sparkles.',
    example: '✨ 𝒫𝓇𝒶ℊ𝒶𝓉𝒾 𝒮𝒶𝒽𝒶𝓎𝒶𝓀 ✨',
    isPopular: true,
    generator: (t) => `✨ ${mapString(t, CHAR_MAPS.scriptUpper, CHAR_MAPS.scriptLower)} ✨`
  },

  // 30. Heart Love Aesthetic
  {
    id: 'heart-aesthetic',
    name: 'Heart Romance Aesthetic',
    category: 'cute',
    tags: ['heart', 'love', 'cute', 'sweet', 'pink', 'couple'],
    description: 'Framed by cute glowing hearts for sweet romantic captions.',
    example: '💖 𝓟𝓻𝓪𝓰𝓪𝓽𝓲 𝓢𝓪𝓱𝓪𝔂𝓪𝓴 💖',
    isPopular: true,
    generator: (t) => `💖 ${mapString(t, CHAR_MAPS.scriptBoldUpper, CHAR_MAPS.scriptBoldLower)} 💖`
  },

  // 31. Royal Crown Wings
  {
    id: 'royal-wings',
    name: 'Royal Crown Wings',
    category: 'fancy',
    tags: ['crown', 'royal', 'wings', 'king', 'queen', 'vip'],
    description: 'Grand ornate winged frame with royal crown emblem.',
    example: '꧁👑 𝐏𝐫𝐚𝐠𝐚𝐭𝐢 𝐒𝐚𝐡𝐚𝐲𝐚𝐤 👑꧂',
    isPopular: true,
    generator: (t) => `꧁👑 ${mapString(t, CHAR_MAPS.boldUpper, CHAR_MAPS.boldLower, CHAR_MAPS.boldDigits)} 👑꧂`
  },

  // 32. Japanese Ribbon Flourish
  {
    id: 'japanese-ribbon',
    name: 'Aesthetic Flourish Wings',
    category: 'fancy',
    tags: ['flourish', 'wings', 'ribbon', 'aesthetic', 'instagram', 'bio'],
    description: 'Classic swooping Japanese aesthetic flourish brackets.',
    example: '꧁༺ 𝒫𝓇𝒶ℊ𝒶𝓉𝒾 𝒮𝒶𝒽𝒶𝓎𝒶𝓀 ༻꧂',
    isPopular: true,
    generator: (t) => `꧁༺ ${mapString(t, CHAR_MAPS.scriptUpper, CHAR_MAPS.scriptLower)} ༻꧂`
  },

  // 33. Star Shooting Stream
  {
    id: 'star-stream',
    name: 'Shooting Star Stream',
    category: 'social',
    tags: ['star', 'stream', 'shooting', 'retro', 'tiktok'],
    description: 'Shooting star trails flanking your bold statement.',
    example: '★彡 𝐏𝐫𝐚𝐠𝐚𝐭𝐢 𝐒𝐚𝐡𝐚𝐲𝐚𝐤 彡★',
    generator: (t) => `★彡 ${mapString(t, CHAR_MAPS.boldUpper, CHAR_MAPS.boldLower, CHAR_MAPS.boldDigits)} 彡★`
  },

  // 34. Cyber Warrior Gaming
  {
    id: 'gaming-warrior',
    name: 'Gaming Clan Blades',
    category: 'gaming',
    tags: ['gaming', 'clan', 'warrior', 'swords', 'freefire', 'pubg', 'bgmi'],
    description: 'Combat crossed swords battle tag for Free Fire, PUBG & Valorant IDs.',
    example: '⚔️ 𝕻𝖗𝖆𝖌𝖆𝖙𝖎 𝕾𝖆𝖍𝖆𝖞𝖆𝖐 ⚔️',
    isPopular: true,
    generator: (t) => `⚔️ ${mapString(t, CHAR_MAPS.frakturBoldUpper, CHAR_MAPS.frakturBoldLower)} ⚔️`
  },

  // 35. Cyber Lightning Electric
  {
    id: 'electric-cyber',
    name: 'Cyberpunk Electric Bolt',
    category: 'gaming',
    tags: ['cyber', 'electric', 'lightning', 'neon', 'tech', 'gamer'],
    description: 'Electrified lightning brackets for edgy cyberpunk usernames.',
    example: '⚡『 𝐏𝐫𝐚𝐠𝐚𝐭𝐢 𝐒𝐚𝐡𝐚𝐲𝐚𝐤 』⚡',
    generator: (t) => `⚡『 ${mapString(t, CHAR_MAPS.boldUpper, CHAR_MAPS.boldLower, CHAR_MAPS.boldDigits)} 』⚡`
  },

  // 36. Skull Gothic Tomb
  {
    id: 'skull-gothic',
    name: 'Skull Gothic Undertaker',
    category: 'gothic',
    tags: ['skull', 'gothic', 'dark', 'metal', 'demon'],
    description: 'Dark gothic skull framing with bold Fraktur letters.',
    example: '☠️ 𝕻𝖗𝖆𝖌𝖆𝖙𝖎 𝕾𝖆𝖍𝖆𝖞𝖆𝖐 ☠️',
    generator: (t) => `☠️ ${mapString(t, CHAR_MAPS.frakturBoldUpper, CHAR_MAPS.frakturBoldLower)} ☠️`
  },

  // 37. Japanese Kanji Corner Brackets
  {
    id: 'kanji-brackets',
    name: 'Japanese Kanji Brackets',
    category: 'stylish',
    tags: ['japanese', 'brackets', 'kanji', 'anime', 'aesthetic'],
    description: 'Traditional solid black Japanese quotation boxes.',
    example: '【 𝐏𝐫𝐚𝐠𝐚𝐭𝐢 𝐒𝐚𝐡𝐚𝐲𝐚𝐤 】',
    generator: (t) => `【 ${mapString(t, CHAR_MAPS.boldUpper, CHAR_MAPS.boldLower, CHAR_MAPS.boldDigits)} 】`
  },

  // 38. Corner Quote Brackets
  {
    id: 'corner-quotes',
    name: 'Corner Frame Brackets',
    category: 'stylish',
    tags: ['brackets', 'quotes', 'corner', 'minimal', 'clean'],
    description: 'Elegant corner framing marks.',
    example: '『 𝒫𝓇𝒶ℊ𝒶𝓉𝒾 𝒮𝒶𝒽𝒶𝓎𝒶𝓀 』',
    generator: (t) => `『 ${mapString(t, CHAR_MAPS.scriptUpper, CHAR_MAPS.scriptLower)} 』`
  },

  // 39. Diamond Luxury Frame
  {
    id: 'diamond-luxury',
    name: 'Diamond Luxury Accent',
    category: 'stylish',
    tags: ['diamond', 'luxury', 'gold', 'jewelry', 'clean', 'saas'],
    description: 'Subtle diamond gem dividers for premium status titles.',
    example: '◈ ℙ𝕣𝕒𝕘𝕒𝕥𝕚 𝕊𝕒𝕙𝕒𝕪𝕒𝕜 ◈',
    generator: (t) => `◈ ${mapString(t, CHAR_MAPS.doubleStruckUpper, CHAR_MAPS.doubleStruckLower, CHAR_MAPS.doubleStruckDigits)} ◈`
  },

  // 40. Butterfly Soft Aesthetic
  {
    id: 'butterfly-aesthetic',
    name: 'Butterfly Blossom Aesthetic',
    category: 'cute',
    tags: ['butterfly', 'cute', 'soft', 'nature', 'fairy'],
    description: 'Delicate fluttering butterfly symbols with script typeface.',
    example: 'ʚĭɞ 𝒫𝓇𝒶ℊ𝒶𝓉𝒾 𝒮𝒶𝒽𝒶𝓎𝒶𝓀 ʚĭɞ',
    generator: (t) => `ʚĭɞ ${mapString(t, CHAR_MAPS.scriptUpper, CHAR_MAPS.scriptLower)} ʚĭɞ`
  },

  // 41. Cherry Blossom Sakura
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom Sakura',
    category: 'cute',
    tags: ['sakura', 'cherry', 'blossom', 'flower', 'pink', 'japan'],
    description: 'Soft blooming sakura cherry blossoms.',
    example: '🌸 𝒫𝓇𝒶ℊ𝒶𝓉𝒾 𝒮𝒶𝒽𝒶𝓎𝒶𝓀 🌸',
    generator: (t) => `🌸 ${mapString(t, CHAR_MAPS.scriptUpper, CHAR_MAPS.scriptLower)} 🌸`
  },

  // 42. Fire Blaze Flame
  {
    id: 'fire-blaze',
    name: 'Blaze Flame Fire',
    category: 'gaming',
    tags: ['fire', 'flame', 'lit', 'hype', 'gaming'],
    description: 'Hot flame markers for high-energy tags and streams.',
    example: '🔥 𝐏𝐫𝐚𝐠𝐚𝐭𝐢 𝐒𝐚𝐡𝐚𝐲𝐚𝐤 🔥',
    generator: (t) => `🔥 ${mapString(t, CHAR_MAPS.boldUpper, CHAR_MAPS.boldLower, CHAR_MAPS.boldDigits)} 🔥`
  },

  // 43. Dreamy Sky Clouds
  {
    id: 'dreamy-clouds',
    name: 'Dreamy Cloud Sky',
    category: 'cute',
    tags: ['cloud', 'dreamy', 'sky', 'calm', 'soft'],
    description: 'Floating clouds for relaxing daydream bios.',
    example: '☁️ 𝒫𝓇𝒶ℊ𝒶𝓉𝒾 𝒮𝒶𝒽𝒶𝓎𝒶𝓀 ☁️',
    generator: (t) => `☁️ ${mapString(t, CHAR_MAPS.scriptUpper, CHAR_MAPS.scriptLower)} ☁️`
  },

  // 44. Spaced Minimalist Zen
  {
    id: 'spaced-zen',
    name: 'Wide Spaced Minimalist',
    category: 'professional',
    tags: ['spaced', 'clean', 'minimal', 'zen', 'modern'],
    description: 'Deliberately spaced minimalist typography.',
    example: 'P  r  a  g  a  t  i    S  a  h  a  y  a  k',
    generator: (t) => Array.from(t).join(' ')
  },

  // 45. Zalgo Corrupted Glitch
  {
    id: 'zalgo-glitch',
    name: 'Zalgo Corrupted Glitch',
    category: 'gaming',
    tags: ['zalgo', 'glitch', 'corrupted', 'void', 'horror', 'discord'],
    description: 'Eerie stacked diacritical marks creating a chaotic digital glitch.',
    example: 'P̶r̶a̶g̶a̶t̶i̶ ̶S̶a̶h̶a̶y̶a̶k̶ (Glitch)',
    isPopular: true,
    generator: (t) => toZalgo(t, 3)
  },

  // 46. Leet Speak (1337)
  {
    id: 'leet-speak',
    name: 'Hacker Leet Speak (1337)',
    category: 'gaming',
    tags: ['leet', '1337', 'hacker', 'gamer', 'retro'],
    description: 'Classic BBS hacker number substitution cipher.',
    example: 'Pr49471 54h4y4k',
    generator: (t) => toLeet(t)
  },

  // 47. Morse Code
  {
    id: 'morse-code',
    name: 'International Morse Code',
    category: 'symbols',
    tags: ['morse', 'code', 'dots', 'secret', 'military', 'cipher'],
    description: 'Dotted and dashed international radio telegraph code.',
    example: '.--. .-. .- --. .- - ..',
    generator: (t) => toMorse(t)
  },

  // 48. Small Caps with Star Accents
  {
    id: 'smallcaps-stars',
    name: 'Starlight Small Caps',
    category: 'popular',
    tags: ['smallcaps', 'stars', 'aesthetic', 'bio', 'instagram'],
    description: 'Aesthetic small caps framed in four-point sparkling stars.',
    example: '✦ ᴘʀᴀɢᴀᴛɪ sᴀʜᴀʏᴀᴋ ✦',
    isPopular: true,
    generator: (t) => `✦ ${mapString(t, CHAR_MAPS.smallCapsUpper, CHAR_MAPS.smallCapsLower)} ✦`
  },

  // 49. Dot Accent Box
  {
    id: 'dot-box',
    name: 'Zenith Dot Frame',
    category: 'stylish',
    tags: ['dots', 'minimal', 'frame', 'clean'],
    description: 'Geometrical dot brackets for contemporary social bios.',
    example: '•—» 𝐏𝐫𝐚𝐠𝐚𝐭𝐢 𝐒𝐚𝐡𝐚𝐲𝐚𝐤 «—•',
    generator: (t) => `•—» ${mapString(t, CHAR_MAPS.boldUpper, CHAR_MAPS.boldLower, CHAR_MAPS.boldDigits)} «—•`
  },

  // 50. Music Beats Melody
  {
    id: 'music-melody',
    name: 'Musical Beats & Notes',
    category: 'social',
    tags: ['music', 'melody', 'audio', 'spotify', 'beats'],
    description: 'Musical harmony symbols for Spotify playlist titles and music bios.',
    example: '🎵 𝒫𝓇𝒶ℊ𝒶𝓉𝒾 𝒮𝒶𝒽𝒶𝓎𝒶𝓀 🎶',
    generator: (t) => `🎵 ${mapString(t, CHAR_MAPS.scriptUpper, CHAR_MAPS.scriptLower)} 🎶`
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Styles', icon: 'Sparkles' },
  { id: 'popular', label: 'Popular', icon: 'Flame' },
  { id: 'stylish', label: 'Stylish', icon: 'Crown' },
  { id: 'fancy', label: 'Fancy & Cursive', icon: 'Feather' },
  { id: 'gaming', label: 'Gaming & Clan', icon: 'Gamepad2' },
  { id: 'social', label: 'Social Media', icon: 'Instagram' },
  { id: 'cute', label: 'Cute & Aesthetic', icon: 'Heart' },
  { id: 'professional', label: 'Professional & Sans', icon: 'Briefcase' },
  { id: 'gothic', label: 'Gothic & Fraktur', icon: 'Skull' },
  { id: 'symbols', label: 'Symbols & Shapes', icon: 'Shapes' },
  { id: 'unicode', label: 'Unicode Special', icon: 'Binary' }
] as const;
