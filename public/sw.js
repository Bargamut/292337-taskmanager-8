const CACHE_NAME = `STATIC_V1.0`;

const putToSWCache = (evt, response) => {
  caches.open(CACHE_NAME)
    .then((cache) => cache.put(evt.request, response));
};

self.addEventListener(`install`, (evt) => {
  const openCache = caches.open(CACHE_NAME)
    .then((cache) => {
      return cache.addAll([
        `./`,
        `./index.html`,
        `./css/normalize.css`,
        `./css/style.css`,
        `./bundle.js`
      ]);
    });

  evt.waitUntil(openCache);
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
      fetch(evt.request)
        .then((response) => {
          putToSWCache(evt, response.clone());

          return response.clone();
        })
        .catch(() => {
          return caches.match(evt.request)
            .then((response) => {
              return response;
            })
            // eslint-disable-next-line
            .catch((err) => console.log({err}))
        })
  );
});
