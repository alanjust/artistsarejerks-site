// Attention Lab PWA — Service Worker v3
const CACHE_NAME = 'attention-lab-v3';
const CORE = [
  '/css/attention.css',
  '/js/attention/slow-look-timer.js',
  '/js/attention/make-it-strange.js',
  '/js/attention/art-wheel.js',
  '/js/attention/art-elements-wheel.json',
  '/lab/aesthetic-break-01/'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k === CACHE_NAME ? null : caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (req.method === 'GET' && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        }
        return res;
      });
    }).catch(() => caches.match('/lab/aesthetic-break-01/')) // fallback
  );
});