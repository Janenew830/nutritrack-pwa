importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn@6.4.1/workbox/workbox-sw.js');

// 初始化 Workbox
workbox.setConfig({
  debug: true
});

// 缓存名称
const CACHE_VERSION = 'v3';
const CACHE_PREFIX = 'nutritrack';
const STATIC_CACHE_NAME = `${CACHE_PREFIX}-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `${CACHE_PREFIX}-dynamic-${CACHE_VERSION}`;

// 路徑處理：處理 GitHub Pages 子目錄
const BASE_PATH = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1);

// 定义需要缓存的资源
const STATIC_RESOURCES = [
  './',
  './index.html',
  './manifest.json',
  './service-worker.js',
  './styles.css',
  // 图标文件
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
  './icons/apple-touch-icon-167x167.svg',
  // 第三方资源
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];

// 预缓存静态资源
workbox.precaching.precacheAndRoute(STATIC_RESOURCES.map(resource => ({
  url: resource,
  revision: null  // 不验证内容哈希
})), {
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/]
});

// 缓存第三方资源（如Google Fonts、Chart.js）
workbox.routing.registerRoute(
  ({url}) => url.origin === 'https://fonts.googleapis.com' ||
           url.origin === 'https://cdn.jsdelivr.net',
  new workbox.strategies.CacheFirst({
    cacheName: 'third-party-cache',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 7 * 24 * 60 * 60 // 7天
      })
    ]
  })
);

// 处理离线场景
workbox.routing.setCatchHandler(({event}) => {
  switch (event.request.destination) {
    case 'document':
      // 显示一个简单的离线页面
      return caches.match('./') || Response.error();
    case 'image':
      // 返回占位图
      return caches.match('/icons/icon-192x192.svg');
    default:
      return Response.error();
  }
});

// 清理旧缓存
workbox.precaching.cleanupOutdatedCaches();

// 添加安装事件监听
self.addEventListener('install', event => {
  console.log('[Service Worker] 安装完成');
});

// 添加激活事件监听
self.addEventListener('activate', event => {
  console.log('[Service Worker] 激活完成');
});