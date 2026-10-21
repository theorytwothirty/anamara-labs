// Offline-first app files: always revalidate with the network for fresh code, fall back to the last copy when offline.
// Only this site's own GET requests are touched; the backend API is never cached.
var KEY = 'mindflow';

self.addEventListener('install', function(){ self.skipWaiting() });
self.addEventListener('activate', function(eve){ eve.waitUntil(self.clients.claim()) });

self.addEventListener('fetch', function(eve, u){
  u = new URL(eve.request.url);
  if(u.origin !== location.origin || 'GET' !== eve.request.method){ return }
  eve.respondWith(fetch(u.href, {cache: 'no-cache'}).then(function(res, copy){
    if(res.ok){ copy = res.clone(); caches.open(KEY).then(function(c){ c.put(eve.request, copy) }) }
    return res;
  }).catch(function(){
    return caches.match(eve.request, {ignoreSearch: true}).then(function(hit){
      return hit || new Response('MindFlow is offline and this page was never opened before. Reconnect once to save it.', {status: 503, headers: {'Content-Type': 'text/plain'}});
    });
  }));
});
