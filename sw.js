// Offline support: the app keeps working without a connection.
const CACHE = 'spuddy-v5';
const SHELL = ['./', 'index.html', 'styles.css', 'foods.js', 'potato.js', 'xmas.js', 'share.js', 'ai.js', 'app.js', 'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Only our own files and the scanner library are cached; everything else (food lookup, sharing) goes straight to the network.
  if (e.request.method !== 'GET' || (url.origin !== location.origin && url.hostname !== 'unpkg.com')) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(e.request, { ignoreSearch: url.origin === location.origin });
    // 'no-cache' = always check with the server, so all files update together.
    const fresh = fetch(e.request, url.origin === location.origin ? { cache: 'no-cache' } : {}).then(res => {
      if (res && (res.ok || res.type === 'opaque')) cache.put(e.request, res.clone());
      return res;
    });
    // Our own files: newest version when online, cached copy when offline. Library from the CDN: cache first.
    if (url.origin !== location.origin && hit) { fresh.catch(() => { }); return hit; }
    return fresh.catch(() => hit || Response.error());
  }));
});
