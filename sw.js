var CACHE = 'qirqhadis-v6';
self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(['./', './index.html', './manifest.webmanifest', './icon-192.png']); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  if(e.request.url.indexOf('api.telegram.org') !== -1) return;
  e.respondWith(
    fetch(e.request).then(function(r){
      var cl = r.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, cl); });
      return r;
    }).catch(function(){
      return caches.match(e.request, {ignoreSearch:true}).then(function(r){
        return r || caches.match('./index.html');
      });
    })
  );
});
