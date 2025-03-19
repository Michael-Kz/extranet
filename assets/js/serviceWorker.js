'use strict';

const CACHE_NAME = 'offline-cache';
const OFFLINE_PAGE = '/.system-pages/offline/index.html'; // Путь к оффлайн-странице

// Установка Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.add(OFFLINE_PAGE); // Кэшируем оффлайн-страницу
        })
    );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache); // Удаляем старые кэши
                    }
                })
            );
        })
    );
});

// Перехват сетевых запросов
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            // Если сеть недоступна, возвращаем оффлайн-страницу
            return caches.match(OFFLINE_PAGE);
        })
    );
});