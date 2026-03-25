const CACHE_NAME = 'nutritrack-v4';
const STATIC_CACHE_NAME = 'nutritrack-static-v4';
const DYNAMIC_CACHE_NAME = 'nutritrack-dynamic-v4';

// 路徑處理：確保相對路徑正確
const basePath = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1);

// 需要缓存的静态资源（使用相对路径）
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './service-worker.js',
  // 图标文件 (SVG格式)
  './icons/icon-72x72.svg',
  './icons/icon-96x96.svg',
  './icons/icon-128x128.svg',
  './icons/icon-144x144.svg',
  './icons/icon-152x152.svg',
  './icons/icon-192x192.svg',
  './icons/icon-384x384.svg',
  './icons/icon-512x512.svg',
  './icons/apple-touch-icon.svg',
  './icons/apple-touch-icon-180x180.svg',
  './icons/apple-touch-icon-152x152.svg',
  './icons/apple-touch-icon-167x167.svg'
];

// 需要缓存的第三方资源
const EXTERNAL_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', event => {
  console.log('[Service Worker] 安装中...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] 缓存静态资源');
        return cache.addAll(STATIC_ASSETS.map(asset => basePath + asset.replace('./', '')));
      })
      .then(() => {
        console.log('[Service Worker] 安装完成');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] 安装失败:', error);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  console.log('[Service Worker] 激活中...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('[Service Worker] 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] 激活完成');
      return self.clients.claim();
    })
  );
});

// 获取事件 - 网络优先，回退缓存
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 对于API请求，使用網絡优先策略
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return response;
        })
        .catch(() => {
          return new Response(JSON.stringify({ error: '网络连接失败' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // 对于静态资源，使用缓存优先策略
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('[Service Worker] 从缓存返回:', event.request.url);
          return cachedResponse;
        }

        // 不在缓存中，从網絡获取
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            // 对于第三方资源，使用动态缓存
            const isExternal = EXTERNAL_ASSETS.some(external => event.request.url.includes(external));
            const cacheToUse = isExternal ? DYNAMIC_CACHE_NAME : STATIC_CACHE_NAME;

            caches.open(cacheToUse)
              .then(cache => {
                cache.put(event.request, responseToCache);
                console.log('[Service Worker] 缓存新资源:', event.request.url);
              });

            return response;
          })
          .catch(error => {
            console.error('[Service Worker] 获取失败:', error);
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
            return new Response('网络连接失败，请检查网络连接。', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});