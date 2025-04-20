'use strict';

const CACHE_NAME = 'offline-cache-v3'; // Увеличили версию кэша
const OFFLINE_URL = '/offline/index.html';
const OFFLINE_RESOURCES = [
  OFFLINE_URL,
  '/assets/css/style.css',
  '/assets/css/errors.css',
  '/assets/images/favicon/favicon.ico',
  '/assets/fonts/Montserrat-Regular.ttf',
  '/assets/fonts/Montserrat-Medium.ttf'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Кэширование оффлайн-ресурсов');
        return cache.addAll(OFFLINE_RESOURCES);
      })
      .catch(error => {
        console.error('[ServiceWorker] Ошибка кэширования:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  // Для навигационных запросов
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          console.log('[ServiceWorker] Оффлайн режим, возвращаем кэшированную страницу');
          return caches.match(OFFLINE_URL);
        })
    );
  }
  // Для CSS, JS, шрифтов и изображений
  else if (
    event.request.destination === 'style' ||
    event.request.destination === 'script' ||
    event.request.destination === 'font' ||
    event.request.destination === 'image'
  ) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request)
            .then(response => {
              // Кэшируем новые ресурсы
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
              return response;
            });
        })
        .catch(() => {
          // Для шрифтов возвращаем undefined, чтобы браузер использовал fallback
          if (event.request.destination === 'font') {
            return undefined;
          }
        })
    );
  }
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.map(key => {
          if (!cacheWhitelist.includes(key)) {
            console.log('[ServiceWorker] Удаление старого кэша:', key);
            return caches.delete(key);
          }
        })
      ))
      .then(() => self.clients.claim())
  );
});