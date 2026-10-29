# Cloudflare Pages Deployment Guide for ReadTriangle 📐

> **Deploying ReadTriangle to Cloudflare Pages**

---

## 🚀 Deployment Options

### Option 1: Deploy via Cloudflare Dashboard (GitHub Integration)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select repository: `shivamsisodiya9568-cpu/readtriangle`.
3. Set Build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Click **Save and Deploy**.

---

### Option 2: Deploy via Direct Upload (Wrangler CLI)

1. Build the production application:
   ```bash
   npm run build
   ```

2. Authenticate Wrangler CLI:
   ```bash
   npx wrangler login
   ```

3. Deploy to Cloudflare Pages project named `readtriangle`:
   ```bash
   npx wrangler pages deploy dist --project-name=readtriangle
   ```

---

## 📄 SPA Routing Setup (`_redirects`)

Cloudflare Pages supports SPA client-side routing via [`public/_redirects`](file:///c:/Users/shiva/OneDrive/Documents/New%20folder/public/_redirects):

```
/*  /index.html  200
```

All route URLs (`/pdf-to-audio`, `/pdf-reader`, `/app`, `/features`, etc.) are cleanly rewritten to `/index.html` with a 200 HTTP status code.
