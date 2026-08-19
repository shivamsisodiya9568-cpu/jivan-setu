# Pragati Sahayak Font Generator

> **Create stylish, unique, and copy-ready text in seconds.**  
> A premium, modern, fast, smooth, and highly responsive Unicode font generation web platform with AI-style recommendations and 50+ aesthetic typography styles.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build](https://img.shields.io/badge/build-passing-emerald.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-purple.svg)

---

## ✨ Features

- **⚡ Instant Real-Time Generation**: Converts text into 50+ Unicode font styles instantly as you type without page reloads or API delays.
- **🤖 Pragati Font Agent**: Intelligent recommendation assistant that understands context (gaming clan names, romantic names, Instagram bios, professional headlines) and suggests matching styles.
- **🎨 50+ Hand-Crafted Unicode Styles**:
  - **Mathematical**: Bold, Italic, Bold Italic, Sans-Serif, Double-Struck (Blackboard), Monospace
  - **Calligraphy & Script**: Classic Cursive, Bold Flourish Calligraphy
  - **Gothic & Medieval**: Fraktur Normal, Fraktur Bold, Old English, Dark Skull Gothic
  - **Shapes & Enclosures**: Circled, Negative Circled Dark, Squared, Negative Squared Dark, Parenthesized, Kanji Brackets
  - **Social & Aesthetic**: Small Caps, Starlight Small Caps, Vaporwave Fullwidth, Sparkles, Cherry Blossom, Heart Romance
  - **Gaming & Clan**: Battle Swords Clan Tag, Cyberpunk Electric, Fire Blaze
  - **Distortion & Tech**: Zalgo Corrupted Glitch, Hacker Leet Speak (1337), Morse Code, Strikethrough, Waves, Underlines
- **🪄 Text Customizer**: 1-click aesthetic decorators, prefix/suffix additions, and case transformations (UPPERCASE, lowercase, Capitalize, aLtErNaTiNg).
- **💖 Favorites System**: Save your favorite fonts locally with `localStorage` persistence.
- **🕒 Generation History**: Automatic local history of recently generated text with instant reuse and clear options.
- **🌓 Dark & Light Modes**: System preference auto-detection with smooth theme toggle and persistence.
- **📱 100% Responsive & Accessible**: Flawless experience from 320px mobile screens to 4K ultra-wide monitors, respecting `prefers-reduced-motion` and WCAG accessibility standards.
- **🔒 Privacy First & 100% Client-Side**: No backend servers or databases required. No user text is ever sent or stored externally.
- **📲 Progressive Web App (PWA)**: Installable on Android, iOS, Windows, and macOS with offline caching.

---

## 🚀 Quick Start (Run Locally)

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 🌐 Deploy to GitHub Pages

This project is pre-configured with relative base paths (`./`) and HashRouter for zero-config GitHub Pages deployment.

### Option 1: Direct GitHub Push + GitHub Actions (Recommended)
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Pragati Sahayak Font Generator"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
   git push -u origin main
   ```
2. Go to your GitHub repository **Settings** → **Pages**.
3. Under **Build and deployment**, select **GitHub Actions** (or deploy from the `dist` branch).

### Option 2: Upload Pre-Built `dist/` Folder
1. Run `npm run build`.
2. Upload the files inside `dist/` to any static web host (GitHub Pages, Vercel, Netlify, Cloudflare Pages, Firebase Hosting).

---

## 📂 Project Structure

```text
pragati-sahayak-font-generator/
├── public/
│   ├── favicon.svg          # Vector branding icon
│   ├── manifest.json        # PWA Web App Manifest
│   ├── robots.txt           # SEO robots directives
│   ├── sitemap.xml          # XML sitemap
│   └── sw.js                # Offline Service Worker
├── src/
│   ├── components/
│   │   ├── FontCard.tsx             # Card with preview, copy, favorite, share
│   │   ├── Footer.tsx               # Responsive SaaS footer
│   │   ├── HistoryModal.tsx         # Local history modal
│   │   ├── Navbar.tsx               # Responsive sticky navbar
│   │   ├── TextCustomizerModal.tsx  # Decorators & case changer
│   │   └── Toast.tsx                # Visual feedback alerts
│   ├── context/
│   │   └── ToastContext.tsx         # Toast notification provider
│   ├── data/
│   │   └── fontStyles.ts            # 50+ Unicode style definitions & categories
│   ├── hooks/
│   │   ├── useFavorites.ts          # localStorage favorites hook
│   │   ├── useHistory.ts            # localStorage history hook
│   │   └── useTheme.ts              # Dark/light theme hook
│   ├── pages/
│   │   ├── AboutPage.tsx            # About & Unicode architecture
│   │   ├── AgentPage.tsx            # Pragati Font Agent AI assistant
│   │   ├── ContactPage.tsx          # Contact & feedback form
│   │   ├── FavoritesPage.tsx        # Saved fonts view & exporter
│   │   ├── GeneratorPage.tsx        # Advanced font workspace
│   │   ├── HomePage.tsx             # Hero & instant live generator
│   │   ├── LibraryPage.tsx          # Complete styles catalog
│   │   ├── PrivacyPage.tsx          # Privacy policy
│   │   └── TermsPage.tsx            # Terms of use
│   ├── services/
│   │   └── aiAgentService.ts        # Intent parser & recommendation engine
│   ├── types/
│   │   └── index.ts                 # TypeScript definitions
│   ├── utils/
│   │   ├── clipboard.ts             # Robust clipboard copy utility
│   │   ├── fontGenerators.ts        # Unicode character transformation math
│   │   └── share.ts                 # Web Share API & URL generator
│   ├── App.tsx                      # App router & layouts
│   ├── index.css                    # Tailwind directives & glassmorphism
│   └── main.tsx                     # React entry point
├── index.html                       # HTML5 entry with SEO & OpenGraph tags
├── package.json                     # Dependencies & scripts
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind custom color palette & animations
├── tsconfig.json                    # TypeScript compiler options
└── vite.config.ts                   # Vite bundler configuration
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👑 Credits

Developed with ❤️ for creators, gamers, and developers by **Pragati Sahayak**.
