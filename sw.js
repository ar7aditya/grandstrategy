// ─── Grand Strategy Service Worker v2 ───────────────────────────────────────
const CACHE = 'gs-v2';
const FONT_CACHE = 'gs-fonts-v2';

const APP_SHELL = ['./index.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE && k !== FONT_CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return;

  // Fonts: cache-first
  if (url.hostname.includes('fonts.g')) {
    e.respondWith(
      caches.open(FONT_CACHE).then(cache =>
        cache.match(request).then(hit => hit || fetch(request).then(res => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        }))
      )
    );
    return;
  }

  // CDN scripts: cache-first
  if (url.hostname === 'unpkg.com') {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(request).then(hit => hit || fetch(request).then(res => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        }).catch(() => hit))
      )
    );
    return;
  }

  // App shell: network-first with cache fallback
  e.respondWith(
    fetch(request)
      .then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(request, res.clone()));
        return res;
      })
      .catch(() =>
        caches.match(request).then(hit => hit || caches.match('./index.html'))
      )
  );
});
