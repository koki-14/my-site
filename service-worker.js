const CACHE_NAME = "calendar-v1";

const urls = [

"/",
"/calendar.html",

"/css/calendar.css",
"/js/calendar.js",

"/data/2026/schedule.json",
"/data/2027/schedule.json",

"/manifest.json"
];

self.addEventListener("install", e => {

  e.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache =>
      cache.addAll(urls)
    )
  );

});

self.addEventListener("fetch", e => {

  e.respondWith(

    caches.match(e.request)

      .then(response => {

        return response ||
          fetch(e.request);

      })

  );

});