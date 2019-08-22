const PWA_CHECK_CACHE_URL = '/pwa_check';

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
  if (url.match(PWA_CHECK_CACHE_URL)) {
    if (method === 'POST') {
      request.json().then(body => {
        caches.open(PWA_CHECK_CACHE_URL).then(function (cache) {
          cache.put(PWA_CHECK_CACHE_URL, new Response(JSON.stringify(body)));
        });
      });
      event.respondWith(new Response('{}'));
    } else {
      event.respondWith(
        caches.open(PWA_CHECK_CACHE_URL).then(function (cache) {
          return cache.match(PWA_CHECK_CACHE_URL).then(function (response) {
            return response || new Response('{}');;
          }) || new Response('{}');
        })
      );
    }
  } else {
    return event;
  }
});