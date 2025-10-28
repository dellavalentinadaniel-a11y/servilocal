/**
 * Service Worker para ServiLocal PWA
 * Proporciona funcionamiento offline y caché de recursos
 */

const CACHE_NAME = 'servilocal-v1';
const OFFLINE_URL = '/index.html';

// Recursos críticos para cachear al instalar
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/buscar.html',
  '/perfil.html',
  '/proveedor.html',
  '/css/tokens.css',
  '/css/components.css',
  '/js/accesibilidad.js',
  '/js/componentes.js',
  '/js/cookies.js',
  '/js/favoritos.js',
  '/js/busqueda.js',
  '/js/schema.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cacheando recursos críticos');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .catch((error) => {
        console.error('[SW] Error al cachear recursos:', error);
      })
  );
  
  // Forzar la activación inmediata
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Eliminando caché antigua:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
  
  // Tomar control de todas las páginas inmediatamente
  return self.clients.claim();
});

// Interceptar peticiones de red
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar peticiones no-HTTP/HTTPS
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Ignorar peticiones de API externas (excepto fuentes y FontAwesome)
  if (url.origin !== location.origin && 
      !url.href.includes('fonts.googleapis.com') &&
      !url.href.includes('cdnjs.cloudflare.com')) {
    return;
  }
  
  // Estrategia: Cache First para recursos estáticos
  if (request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'font' ||
      request.destination === 'image') {
    
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((response) => {
              // Cachear la respuesta para futuras peticiones
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            })
            .catch(() => {
              // Si falla, intentar devolver algo del caché
              return caches.match(request);
            });
        })
    );
    return;
  }
  
  // Estrategia: Network First para páginas HTML
  if (request.destination === 'document' || request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cachear la respuesta exitosa
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Si falla la red, usar caché
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Última opción: página offline
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }
  
  // Para todo lo demás, intentar red primero
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  );
});

// Mensaje desde la aplicación
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME)
      .then(() => {
        console.log('[SW] Caché limpiado');
        event.ports[0].postMessage({ success: true });
      });
  }
});

// Sincronización en background (para futuras features)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-favoritos') {
    event.waitUntil(syncFavoritos());
  }
});

async function syncFavoritos() {
  // TODO: Implementar sincronización de favoritos con servidor
  console.log('[SW] Sincronizando favoritos...');
}

// Notificaciones push (para futuras features)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'ServiLocal';
  const options = {
    body: data.body || 'Tienes una nueva notificación',
    icon: '/imagen/icon-192x192.png',
    badge: '/imagen/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
    actions: [
      { action: 'open', title: 'Abrir' },
      { action: 'close', title: 'Cerrar' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Click en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Si ya hay una ventana abierta, enfocarla
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // Si no, abrir una nueva
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});
