/* Increment VERSION after changing any application asset. */
const VERSION = 'v2-score-icons';
const PREFIX = `optimus2-${self.registration.scope}-`;
const CACHE = PREFIX + VERSION;
const ASSETS = ['./index.html','./style.css','./board.css','./mobile.css','./symbols.js','./game.js','./store.js','./scoring.js','./app.js','./offline.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./README.md'];
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
 event.waitUntil((async()=>{
  const keys = await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch', event => {
 const url = new URL(event.request.url);
 if(event.request.method!=='GET'||!url.href.startsWith(self.registration.scope)) return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  // A complete version is served together, online and offline.
  const cached=await cache.match(event.request,{ignoreSearch:true});
  if(cached) return cached;
  if(event.request.mode==='navigate' && (url.pathname===new URL(self.registration.scope).pathname || url.pathname.endsWith('/index.html'))) {
   return cache.match('./index.html');
  }
  return fetch(event.request);
 })());
});
