// Unicode mappings and conversion helper functions

export const CHAR_MAPS = {
  // Math Bold
  boldUpper: '𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙',
  boldLower: '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳',
  boldDigits: '𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗',

  // Math Italic
  italicUpper: '𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍',
  italicLower: '𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧',

  // Math Bold Italic
  boldItalicUpper: '𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁',
  boldItalicLower: '𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛',

  // Sans-Serif
  sansUpper: '𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹',
  sansLower: '𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓',
  sansDigits: '𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫',

  // Sans-Serif Bold
  sansBoldUpper: '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭',
  sansBoldLower: '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇',
  sansBoldDigits: '𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵',

  // Script Normal
  scriptUpper: '𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵',
  scriptLower: '𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏',

  // Script Bold
  scriptBoldUpper: '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩',
  scriptBoldLower: '𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃',

  // Fraktur Normal
  frakturUpper: '𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ',
  frakturLower: '𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔯',

  // Fraktur Bold
  frakturBoldUpper: '𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅',
  frakturBoldLower: '𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟',

  // Double-Struck
  doubleStruckUpper: '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ',
  doubleStruckLower: '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫',
  doubleStruckDigits: '𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡',

  // Monospace
  monoUpper: '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉',
  monoLower: '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣',
  monoDigits: '𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿',

  // Circled
  circledUpper: 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ',
  circledLower: 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ',
  circledDigits: '⓪①②③④⑤⑥⑦⑧⑨',

  // Negative Circled
  negCircledUpper: '🅐🅑🅒🅓🅔𝅘𝅥𝅯🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩',
  negCircledDigits: '⓿❶❷❸❹❺❻❼❽❾',

  // Squared
  squaredUpper: '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉',

  // Negative Squared
  negSquaredUpper: '🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉',

  // Small Caps
  smallCapsUpper: 'ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ',
  smallCapsLower: 'ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ',

  // Fullwidth
  fullwidthUpper: 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ',
  fullwidthLower: 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ',
  fullwidthDigits: '０１２３４５６７８９',
};

const BASE_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const BASE_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const BASE_DIGITS = '0123456789';

// Map single characters from source string using array of codepoints
export function mapString(
  text: string,
  upperMap?: string,
  lowerMap?: string,
  digitsMap?: string
): string {
  if (!text) return '';
  const upperArr = upperMap ? Array.from(upperMap) : [];
  const lowerArr = lowerMap ? Array.from(lowerMap) : [];
  const digitsArr = digitsMap ? Array.from(digitsMap) : [];

  return Array.from(text)
    .map((char) => {
      const uIdx = BASE_UPPER.indexOf(char);
      if (uIdx !== -1 && upperArr[uIdx]) return upperArr[uIdx];

      const lIdx = BASE_LOWER.indexOf(char);
      if (lIdx !== -1 && lowerArr[lIdx]) return lowerArr[lIdx];

      const dIdx = BASE_DIGITS.indexOf(char);
      if (dIdx !== -1 && digitsArr[dIdx]) return digitsArr[dIdx];

      return char;
    })
    .join('');
}

// Combining Marks (Underline, Strike, Slash, Dots, etc.)
export function addCombiningMark(text: string, mark: string): string {
  if (!text) return '';
  return Array.from(text)
    .map((c) => (c === ' ' ? c : c + mark))
    .join('');
}

// Superscript
const SUPERSCRIPT_MAP: Record<string, string> = {
  a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ',
  j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', r: 'ʳ', s: 'ˢ',
  t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
  A: 'ᴬ', B: 'ᴮ', C: 'ᶜ', D: 'ᴰ', E: 'ᴱ', F: 'ᶠ', G: 'ᴳ', H: 'ᴴ', I: 'ᴵ',
  J: 'ᴶ', K: 'ᴷ', L: 'ᴸ', M: 'ᴹ', N: 'ᴺ', O: 'ᴼ', P: 'ᴾ', R: 'ᴿ', T: 'ᵀ',
  U: 'ᵁ', V: 'ⱽ', W: 'ᵂ',
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾'
};

export function toSuperscript(text: string): string {
  return Array.from(text)
    .map((c) => SUPERSCRIPT_MAP[c] || c)
    .join('');
}

// Subscript
const SUBSCRIPT_MAP: Record<string, string> = {
  a: 'ₐ', e: 'ₑ', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ',
  o: 'ₒ', p: 'ₚ', r: 'ᵣ', s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', x: 'ₓ',
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎'
};

export function toSubscript(text: string): string {
  return Array.from(text)
    .map((c) => SUBSCRIPT_MAP[c] || c)
    .join('');
}

// Upside Down (Flip)
const UPSIDE_DOWN_MAP: Record<string, string> = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ',
  j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ',
  s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
  A: '∀', B: '𐐒', C: 'Ɔ', D: '◖', E: 'Ǝ', F: 'Ⅎ', G: '⅁', H: 'H', I: 'I',
  J: 'ſ', K: 'ʞ', L: '˥', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Ò', R: 'ᴚ',
  S: 'S', T: '⊥', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
  '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
  '?': '¿', '!': '¡', '.': '˙', ',': '\'', '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{',
  '<': '>', '>': '<', '_': '‾'
};

export function toUpsideDown(text: string): string {
  return Array.from(text)
    .reverse()
    .map((c) => UPSIDE_DOWN_MAP[c] || c)
    .join('');
}

// Reverse / Mirror
const REVERSED_MAP: Record<string, string> = {
  a: 'ɒ', b: 'd', c: 'ɔ', d: 'b', e: 'ɘ', f: 'Ꮈ', g: 'ǫ', h: 'ʜ', i: 'i',
  j: 'ꞁ', k: 'ʞ', l: 'l', m: 'm', n: 'ᴎ', o: 'o', p: 'q', q: 'p', r: 'ɿ',
  s: 'ꙅ', t: 'ƚ', u: 'u', v: 'v', w: 'w', x: 'x', y: 'ʏ', z: 'z',
  A: 'A', B: 'ᙠ', C: 'Ɔ', D: 'ᗡ', E: 'Ǝ', F: 'ꟻ', G: 'Ꭾ', H: 'H', I: 'I',
  J: 'Ⴑ', K: '⋊', L: '⅃', M: 'M', N: 'И', O: 'O', P: 'ꟼ', Q: 'Ọ', R: 'Я',
  S: 'Ƨ', T: 'T', U: 'U', V: 'V', W: 'W', X: 'X', Y: 'Y', Z: 'Ƶ'
};

export function toReversed(text: string): string {
  return Array.from(text)
    .reverse()
    .map((c) => REVERSED_MAP[c] || c)
    .join('');
}

// Parenthesized
const PAREN_MAP: Record<string, string> = {
  a: '⒜', b: '⒝', c: '⒞', d: '⒟', e: '⒠', f: '⒡', g: '⒢', h: '⒣', i: '⒤',
  j: '⒥', k: '⒦', l: '⒧', m: '⒨', n: '⒩', o: '⒪', p: '⒫', q: '⒬', r: '⒭',
  s: '⒮', t: '⒯', u: '⒰', v: '⒱', w: '⒲', x: '⒳', y: '⒴', z: '⒵',
  A: '⒜', B: '⒝', C: '⒞', D: '⒟', E: '⒠', F: '⒡', G: '⒢', H: '⒣', I: '⒤',
  J: '⒥', K: '⒦', L: '⒧', M: '⒨', N: '⒩', O: '⒪', P: '⒫', Q: '⒬', R: '⒭',
  S: '⒮', T: '⒯', U: '⒰', V: '⒱', W: '⒲', X: '⒳', Y: '⒴', Z: '⒵',
  '1': '⑴', '2': '⑵', '3': '⑶', '4': '⑷', '5': '⑸', '6': '⑹', '7': '⑺', '8': '⑻', '9': '⑼'
};

export function toParenthesized(text: string): string {
  return Array.from(text)
    .map((c) => PAREN_MAP[c] || c)
    .join('');
}

// Zalgo / Glitch Generator
const ZALGO_UP = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343', '\u0344', '\u034a', '\u034b', '\u034c', '\u0350', '\u0300', '\u0301', '\u0302', '\u0303', '\u030b', '\u030c', '\u033e'];
const ZALGO_MID = ['\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327', '\u0328', '\u0334', '\u0335', '\u0336', '\u034f', '\u035c', '\u035d', '\u035e', '\u035f', '\u0360', '\u0362'];
const ZALGO_DOWN = ['\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f', '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a', '\u032b', '\u032c', '\u032d', '\u032e', '\u032f', '\u0330', '\u0331', '\u0332', '\u0333', '\u0339', '\u033a', '\u033b', '\u033c', '\u0345', '\u0347', '\u0348', '\u0349', '\u034d', '\u0353', '\u0354', '\u0355', '\u0356', '\u0359', '\u035a', '\u0323'];

export function toZalgo(text: string, intensity: number = 3): string {
  if (!text) return '';
  return Array.from(text)
    .map((c) => {
      if (c === ' ') return c;
      let res = c;
      const count = Math.max(1, Math.min(8, intensity));
      for (let i = 0; i < count; i++) {
        res += ZALGO_UP[Math.floor(Math.random() * ZALGO_UP.length)];
        res += ZALGO_MID[Math.floor(Math.random() * ZALGO_MID.length)];
        res += ZALGO_DOWN[Math.floor(Math.random() * ZALGO_DOWN.length)];
      }
      return res;
    })
    .join('');
}

// Leet Speak (1337)
const LEET_MAP: Record<string, string> = {
  a: '4', A: '4', e: '3', E: '3', i: '1', I: '1', o: '0', O: '0',
  s: '5', S: '5', t: '7', T: '7', b: '8', B: '8', g: '9', G: '9'
};

export function toLeet(text: string): string {
  return Array.from(text)
    .map((c) => LEET_MAP[c] || c)
    .join('');
}

// Morse Code
const MORSE_MAP: Record<string, string> = {
  a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.', h: '....',
  i: '..', j: '.---', k: '-.-', l: '.-..', m: '--', n: '-.', o: '---', p: '.--.',
  q: '--.-', r: '.-.', s: '...', t: '-', u: '..-', v: '...-', w: '.--', x: '-..-',
  y: '-.--', z: '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  ' ': '/'
};

export function toMorse(text: string): string {
  return Array.from(text.toLowerCase())
    .map((c) => MORSE_MAP[c] || c)
    .join(' ');
}
