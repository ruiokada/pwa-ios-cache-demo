const CACHE_URL = '/pwa_in_use';

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', function (event) {
  const {
    request,
    request: {
      url,
      method,
    },
  } = event;
  if (url.match(CACHE_URL)) {
    if (method === 'POST') {
      request.json().then(body => {
        caches.open(CACHE_URL).then(function (cache) {
          cache.put(CACHE_URL, new Response(JSON.stringify(body)));
        });
      });
      return new Response('{}');
    } else if (method === 'DELETE') {
      event.respondWith(
        caches.open(CACHE_URL).then(function (cache) {
          return cache.delete(CACHE_URL).then(function (response) {
            return response || new Response('{}');;
          }) || new Response('{}');
        })
      );
    } else {
      event.respondWith(
        caches.open(CACHE_URL).then(function (cache) {
          return cache.match(CACHE_URL).then(function (response) {
            return response || new Response('{}');;
          }) || new Response('{}');
        })
      );
    }
  } else {
    return event;
  }
});