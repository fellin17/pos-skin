// BrandyPOS Service Worker v1.0
const CACHE = 'brandypos-v1';
const ARCHIVOS = [
  '/pos-skin/',
  '/pos-skin/index.html'
];

// Instalar y cachear archivos principales
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ARCHIVOS);
    })
  );
  self.skipWaiting();
});

// Activar y limpiar caches viejos
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: primero red, si falla usa cache
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request)
      .then(function(res) {
        // Guardar copia fresca en cache
        var resClone = res.clone();
        caches.open(CACHE).then(function(cache) {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(function() {
        return caches.match(e.request);
      })
  );
});
