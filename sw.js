const CACHE_NAME = 'fillmaster-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  // Külső könyvtárak (CDN) - FONTOS: Ezeknek pontosan egyezniük kell az index.html-lel!
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/bwip-js@3.0.4/dist/bwip-js-min.js'
];

// Telepítéskor elmentjük a statikus fájlokat
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Caching assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Kérések figyelése
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Ha megvan cache-ben (pl. React libek), visszaadjuk onnan
      if (cachedResponse) {
        return cachedResponse;
      }
      // Ha nincs, megpróbáljuk letölteni a netről
      return fetch(event.request).catch(() => {
        // Ha nincs net és nincs cache-ben sem -> itt lehetne egy fallback oldalt adni
        // De az App Shell (index.html) már cache-elve van fentebb.
      });
    })
  );
});

// Régi cache törlése frissítéskor
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});
