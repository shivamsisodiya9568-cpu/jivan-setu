# Vercel Deployment & Vercel AI SDK Integration Guide

> **Pragati Sahayak PDF Generator & Font Studio**  
> *Seamless web deployment on Vercel with integrated Vercel AI SDK capabilities for website development and document intelligence.*

---

## 📐 Table of Contents

1. [Overview](#-overview)
2. [Quick Deployment to Vercel](#-quick-deployment-to-vercel)
   - [Option A: Deploy via Vercel CLI](#option-a-deploy-via-vercel-cli)
   - [Option B: Deploy via Vercel Git Integration](#option-b-deploy-via-vercel-git-integration)
3. [Vercel Configuration (`vercel.json`)](#-vercel-configuration-verceljson)
4. [Vercel AI SDK Integration](#-vercel-ai-sdk-integration)
   - [Packages Used](#packages-used)
   - [Environment Variables Setup](#environment-variables-setup)
   - [Using Vercel AI SDK in Website Development](#using-vercel-ai-sdk-in-website-development)
5. [Architecture & Services](#-architecture--services)
6. [Troubleshooting & Best Practices](#-troubleshooting--best-practices)

---

## 🚀 Overview

This repository contains the **Pragati Sahayak PDF Generator & Document Studio** built with **React 18**, **TypeScript**, **Vite 6**, and **Tailwind CSS**. 

By connecting **Vercel** and **Vercel AI SDK**, you get:
- **Instant Global Edge Deployment**: Sub-second TTFB, automatic SSL certificates, and global CDN delivery.
- **Single Page Application (SPA) Routing**: Automated fallback handling for client-side routing via `vercel.json`.
- **Vercel AI SDK Powered Document & Font Intelligence**: Integration of Vercel AI SDK (`ai` package) with generative models (Google Gemini / OpenAI) for automatic document analysis, font pairing suggestions, and smart content generation.

---

## ⚡ Quick Deployment to Vercel

### Option A: Deploy via Vercel CLI

1. Install the official Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Authenticate with your Vercel account:
   ```bash
   vercel login
   ```

3. Deploy the project to preview:
   ```bash
   vercel
   ```

4. Deploy to production:
   ```bash
   vercel --prod
   ```

---

### Option B: Deploy via Vercel Git Integration

1. Push your code to your GitHub/GitLab/Bitbucket repository:
   ```bash
   git add .
   git commit -m "Add Vercel configuration and Vercel AI SDK integration"
   git push origin main
   ```

2. Navigate to [Vercel Dashboard](https://vercel.com/new).
3. Select **Import Project** and choose your repository `pragati-sahayak-font-generator`.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

---

## 🛠 Vercel Configuration (`vercel.json`)

The project includes a pre-configured `vercel.json` file in the root directory:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

---

## 🤖 Vercel AI SDK Integration

### Packages Used

The application leverages the Vercel AI SDK for client-side and serverless AI workflows:

```bash
npm install ai @ai-sdk/google
```

- `ai`: Core Vercel AI SDK providing standard stream utilities, prompt formatting, and standard AI providers.
- `@ai-sdk/google`: Google Generative AI provider integration for Vercel AI SDK (Gemini models).

### Environment Variables Setup

Create a `.env` or `.env.local` file in your root folder (or set these in **Vercel Dashboard > Project Settings > Environment Variables**):

```env
# Google Gemini / Vercel AI SDK Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_VERCEL_AI_PROVIDER=google
```

### Using Vercel AI SDK in Website Development

The application provides a dedicated Vercel AI Service located in [`src/services/vercelAiService.ts`](file:///c:/Users/shiva/OneDrive/Documents/New%20folder/src/services/vercelAiService.ts).

#### Example: Analyzing Documents & Text Generation with Vercel AI SDK

```typescript
import { vercelAiService } from './services/vercelAiService';

// Generate text using Vercel AI SDK
const response = await vercelAiService.generateText({
  prompt: 'Summarize key points from this document text...',
  apiKey: 'YOUR_API_KEY',
  model: 'gemini-1.5-flash'
});

console.log(response);
```

#### Example: Font & UI Style Recommendations for Website Development

```typescript
// Ask Vercel AI for font styling and typography combinations
const styleAdvice = await vercelAiService.generateFontSuggestions({
  websiteTopic: 'Formal Executive Resume & Portfolio',
  apiKey: 'YOUR_API_KEY'
});
```

---

## 🏗 Architecture & Services

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Edge Platform                     │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
     ┌───────────────────┐           ┌───────────────────┐
     │ Vite React Client │           │  Vercel AI SDK    │
     │   (dist/ SPA)     │           │   (ai & @ai-sdk)  │
     └─────────┬─────────┘           └─────────┬─────────┘
               │                               │
               └───────────────┬───────────────┘
                               ▼
            ┌────────────────────────────────────┐
            │   Document & Font Assistant Services│
            │  - documentAssistantService.ts     │
            │  - vercelAiService.ts              │
            └────────────────────────────────────┘
```

---

## 🔒 Security & Privacy

1. **Client-Side Sandbox**: All PDF generation (`pdf-lib`), rendering (`pdfjs-dist`), and local AI heuristics run strictly inside the browser.
2. **BYOK (Bring Your Own Key)**: External Vercel AI API requests only occur when configured by the user, and keys are stored in `localStorage`.
3. **No Unencrypted Traffic**: Vercel automatically enforces TLS/SSL encryption for all deployed domains.

---

## 💡 Summary of Added Files

- [`vercel.json`](file:///c:/Users/shiva/OneDrive/Documents/New%20folder/vercel.json): Vercel platform rewrite rules & security headers.
- [`vercel.md`](file:///c:/Users/shiva/OneDrive/Documents/New%20folder/vercel.md): Developer & deployment documentation guide for Vercel and Vercel AI SDK.
- [`src/services/vercelAiService.ts`](file:///c:/Users/shiva/OneDrive/Documents/New%20folder/src/services/vercelAiService.ts): Service wrapper for Vercel AI SDK operations.
