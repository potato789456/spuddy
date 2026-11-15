// Offline support: the app keeps working without a connection.
const CACHE = 'spuddy-v2';
const SHELL = ['./', 'index.html', 'styles.css', 'foods.js', 'potato.js', 'app.js', 'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.hostname.includes('openfoodfacts')) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(e.request, { ignoreSearch: url.origin === location.origin });
    const fresh = fetch(e.request).then(res => {
      if (res && (res.ok || res.type === 'opaque')) cache.put(e.request, res.clone());
      return res;
    });
    // Our own files: newest version when online, cached copy when offline. Library from the CDN: cache first.
    if (url.origin !== location.origin && hit) { fresh.catch(() => { }); return hit; }
    return fresh.catch(() => hit || Response.error());
  }));
});
