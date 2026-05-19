# Grand Strategy PWA

## How to install as a PWA

### Option A — Serve locally (recommended for testing)
You need a local web server (PWAs don't work over `file://`).

```bash
# Python 3
cd grand-strategy-pwa
python3 -m http.server 8080
# Then open http://localhost:8080
```

Or with Node:
```bash
npx serve grand-strategy-pwa
```

### Option B — Deploy to the web
Upload all three files to any static host:
- **Netlify**: drag the folder into app.netlify.com
- **Vercel**: `npx vercel grand-strategy-pwa`
- **GitHub Pages**: push to a repo and enable Pages

### Installing on device
- **Android Chrome**: tap the ⋮ menu → "Add to Home screen"  
  (or the install banner that appears automatically)
- **iOS Safari**: tap Share → "Add to Home Screen"
- **Desktop Chrome/Edge**: click the install icon in the address bar

## Files
| File | Purpose |
|------|---------|
| `index.html` | The full app (React, all views, styling) |
| `manifest.json` | PWA metadata — name, icons, colors, shortcuts |
| `sw.js` | Service worker — offline caching, background sync |

## Offline support
The service worker caches the app shell and all CDN scripts on first load.
After that the app works fully offline. Your data is stored in `localStorage`.
