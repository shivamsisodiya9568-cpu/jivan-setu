# Astro JS Integration Guide

> **Astro JS installed in Pragati Sahayak Document Studio**

---

## 🚀 Overview

Astro JS (`astro`) and `@astrojs/react` have been installed into your workspace context.

---

## 🛠 Available NPM Scripts

You can run Astro commands directly from your project terminal:

- **Start Astro Dev Server**:
  ```bash
  npm run astro:dev
  ```

- **Build Astro Production Site**:
  ```bash
  npm run astro:build
  ```

- **Preview Astro Build**:
  ```bash
  npm run astro:preview
  ```

- **Run Astro CLI Commands**:
  ```bash
  npx astro --help
  ```

---

## 📄 Configuration (`astro.config.mjs`)

Your project contains [`astro.config.mjs`](file:///c:/Users/shiva/OneDrive/Documents/New%20folder/astro.config.mjs) configured with React support:

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

---

## 🌟 Creating a New Standalone Astro Project

If you prefer a completely separate standalone Astro project in a subfolder:

```bash
npm create astro@latest astro-app
```
