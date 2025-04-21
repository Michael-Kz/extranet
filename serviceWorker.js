'use strict'

// Конфигурация кэша
const CACHE_NAME = 'offline-cache-v4'
const OFFLINE_URL = '/.offline/index.html'
const OFFLINE_RESOURCES = [
  OFFLINE_URL,
  '/assets/css/style.css',
  '/assets/css/errors.css',
  '/assets/images/favicon/favicon.ico',
  '/assets/fonts/Montserrat-Regular.ttf',
  '/assets/fonts/Montserrat-Medium.ttf'
]

// Установка и кэширование ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Начато кэширование оффлайн-ресурсов')
      return cache
        .addAll(OFFLINE_RESOURCES)
        .then(() => console.log('[SW] Все ресурсы успешно закэшированы'))
        .catch(error => {
          console.error('[SW] Ошибка кэширования:', error)
          throw error // Важно для прерывания установки при ошибке
        })
    })
  )
})

// Обработка запросов
self.addEventListener('fetch', event => {
  // Навигационные запросы (страницы)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        console.log('[SW] Оффлайн-режим: обработка навигации')

        // Пытаемся получить оффлайн-страницу
        const cachedResponse = await caches.match(OFFLINE_URL)

        // Возвращаем кэш или fallback
        return (
          cachedResponse ||
          new Response(
            '<h1>Оффлайн-режим</h1><p>Проверьте подключение к интернету</p>',
            {
              headers: { 'Content-Type': 'text/html' },
              status: 200
            }
          )
        )
      })
    )
  } else if (
    ['style', 'script', 'font', 'image'].includes(event.request.destination)
  ) {
    event.respondWith(
      caches.match(event.request).then(response => {
        // Возвращаем кэш или делаем сетевой запрос
        return (
          response ||
          fetch(event.request)
            .then(networkResponse => {
              // Клонируем ответ для кэширования
              const clone = networkResponse.clone()
              caches
                .open(CACHE_NAME)
                .then(cache => cache.put(event.request, clone))
              return networkResponse
            })
            .catch(() => {
              // Особый случай для шрифтов
              if (event.request.destination === 'font') {
                return new Response('', { status: 204 })
              }
              return Response.error()
            })
        )
      })
    )
  }
})

// Очистка старых кэшей
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]

  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys.map(key => {
            if (!cacheWhitelist.includes(key)) {
              console.log('[SW] Удаление устаревшего кэша:', key)
              return caches.delete(key)
            }
          })
        )
      )
      .then(() => {
        console.log('[SW] Активация завершена')
        return self.clients.claim()
      })
  )
})
