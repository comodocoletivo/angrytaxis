importScripts('scripts/serviceworker-cache-polyfill.js');

var cache_version, current_cache, preFetchUrls, expectedCacheNames, fetchUrl;

cache_version = 1;
current_cache = { prefetch: 'angrycache-v' + cache_version };
fetchUrl = [];

self.addEventListener('install', function(event) {

  // Antes de fazer o fetch é indicado quais arquivos serão cacheados.
  preFetchUrls = [
    "favicon-off.ico"
    "favicon.ico"

    "images/address-icon-placeholder.png",
    "images/address-icon.svg",
    "images/comodo-logo.svg",
    "images/complaint-icon.png",
    "images/date-icon-placeholder.png",
    "images/date-icon.svg",
    "images/favicon.png",
    "images/hour-icon-placeholder.png",
    "images/hour-icon.svg",
    "images/icon-app-store.svg",
    "images/icon-btn-denunciar.svg",
    "images/icon-btn-elogiar.svg",
    "images/icon-google-play.svg",
    "images/icon-heatmap-hover.svg",
    "images/icon-heatmap.svg",
    "images/icon-marker-hover.svg",
    "images/icon-marker.svg",
    "images/icon-my-location-hover.svg",
    "images/icon-my-location.svg",
    "images/icon-praise-hover.svg",
    "images/icon-praise.svg",
    "images/logo-animated-shadow.png",
    "images/logo-animated.png",
    "images/logo-mobile-offline.png",
    "images/logo-mobile.png",
    "images/logo.png",
    "images/notification-icon.png",
    "images/praise-icon.png",
    "images/user-icon.png",

    "translate/en.json",
    "translate/pt-BR.json",

    "styles/main.css"
  ];

  // console.log('Recursos para prefetch: ', preFetchUrls);

  event.waitUntil(
    caches.open(current_cache['prefetch'])
    .then(function(cache) {
      return cache.addAll(fetchUrl.map(function(fetchUrl) {
        return new Request(fetchUrl, {mode: 'no-cors'});
      })).then(function() {
        console.log('Todos os recursos foram buscados e armazenados em cache.');
      });
    }).catch(function(error) {
      console.log('Prefetch error: ', error);
    })
  );
});

self.addEventListener('activate', function(event) {
  expectedCacheNames = Object.keys(current_cache).map(function(key) {
    return current_cache[key];
  });

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) == -1) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  fetchUrl.push(event.request.url);

  // console.log('Urls requisitadas:: ', event.request.url);

  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      if (response) {
        return response;
      }

      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(function(response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        var responseToCache = response.clone();

        caches.open(current_cache).then(function(cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
