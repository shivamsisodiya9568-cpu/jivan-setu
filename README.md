# ReadTriangle 📐

> **"Turn Every Page Into a Voice."**  
> *Your documents. Your PDFs. Your reading companion.*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38b2ac?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**ReadTriangle** is a premium multilingual PDF reading platform that allows users to upload readable PDFs and listen to their contents as natural, human-like synthetic speech.

---

## 🌟 Core Features

### 1. PDF Upload & Scanned OCR Engine
- **Drag-and-Drop Uploader**: Upload books, study material, notes, articles, research documents, manuals, and e-books.
- **Tesseract OCR Integration**: Automatically recognizes text from scanned image pages and converts it to speech.
- **Graceful Invalid File Handling**: Robust error handling that prevents application crashes.

### 2. Built-In Multi-Mode PDF Reader
- **Canvas PDF Viewer**: Built-in canvas renderer powered by PDF.js with page navigation, zoom (50% to 200%), fit page/width, fullscreen mode, and dark/light reading themes.
- **Text Reader Mode**: Extracted text mode view with click-to-read sentence interaction.
- **Audiobook Listening Mode**: Distraction-free listening interface with album cover art, live audio wave animation, and current spoken sentence focus.

### 3. Natural Multilingual AI Voices
- **Male & Female Voices**: Filterable by gender and tone (*Natural, Warm, Deep, Calm, Professional*).
- **10+ Native Languages**: Hindi 🇮🇳, English 🇺🇸, Spanish 🇪🇸, Japanese 🇯🇵, Chinese 🇨🇳, French 🇫🇷, German 🇩🇪, Italian 🇮🇹, Portuguese 🇵🇹, Korean 🇰🇷, Russian 🇷🇺, Arabic 🇸🇦.
- **Voice Preview**: Single-click "Preview Voice" available on every voice option.
- **Automatic Language Detection**: Detects document script and language automatically.

### 4. Audiobook-Style Voice Player
- **Sticky Audio Control Bar**: Play, Pause, Resume, Stop, Previous/Next section, scrubbable progress bar (*"Reading page 27 of 312"*), volume, and speed selector (**0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x, 2x**).
- **Synchronized Sentence Highlighting**: Live sentence highlighting that auto-scrolls to the spoken sentence.
- **Auto Page Synchronization**: Fulfills auto-page turning as speech reaches subsequent pages.
- **Download Speech Audio**: Export generated speech audio as a downloadable audio file (`.wav`).

### 5. Continue Reading & Text Cleanup
- **Progress Persistence**: Saves reading position (*document ID, page, paragraph, sentence, voice, speed, timestamp*) in browser storage with a **"Continue Reading"** navbar dropdown.
- **Automatic Text Cleanup**: Configurable toggles to strip page numbers, repeated headers/footers, and hyphenated word breaks.

### 6. AI Document Companion & Ask Your PDF
- **Ask Your PDF**: Interactive document Q&A with page citations.
- **Document Summaries & Listen to Summary**: Generates concise summaries with a single-click **"Listen to Summary"** TTS button.
- **Study Notes**: Key takeaways and vocabulary extraction.

---

## 🔒 Privacy & Architecture

1. **Client-Side Processing**: PDF parsing, canvas rendering, Tesseract OCR, and Web Speech Synthesis run locally inside your browser sandbox.
2. **Zero Telemetry**: No third-party tracking scripts or advertising trackers.
3. **No Account Required**: Immediate access to all capabilities without registration.

---

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6 & Astro JS
- **Styling**: Tailwind CSS
- **PDF Manipulation**: `pdf-lib` & `pdfjs-dist`
- **OCR Engine**: `tesseract.js`
- **AI Integration**: Vercel AI SDK (`ai` & `@ai-sdk/google`)
- **Speech Engine**: Web Speech Synthesis API & Neural TTS

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/shivamsisodiya9568-cpu/readtriangle.git
cd readtriangle
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
