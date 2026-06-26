const CACHE_NAME = "koki's-Site-v1.01";

const urls = [

"/",
"/index.html",
"/pages/home.html",
"/pages/about.html",
"/pages/calender.html",
"/pages/contact.html",
"/pages/schedulu.html",
"/pages/profile/koki.html",
"/pages/profile/ayano.html",

"/css/admin.css",
"/css/style.css",
"/css/calendar.css",
"/css/contact.css",
"/css/profile.css",

"/js/admin.js",
"/js/script.js",
"/js/calendar.js",
"/js/install.js",

"/data/2026/schedule.json",
"/data/2027/schedule.json",
"/data/2028/schedule.json",

"/stamp/kinosaki.png",

"/img/admin.jpg",
"/img/hero.jpg",
"/img/koki.jpg",
"/img/ayano.jpg",

"/icon/icon-1.png",
"/icon/icon-2.png",
"/icon/icon-koki.png",
"/icon/icon-ayano.png",
"/icon/icon-insta.png",

"/icon/kinosaki.png",

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