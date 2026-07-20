const CACHE_NAME = "koki's-Site-v1.01";

const urls = [

"/",
"/index.html",
"/pages/home.html",
"/pages/about.html",
"/pages/calendar.html",
"/pages/contact.html",
"/pages/schedule.html",
"/pages/owner.html",
"/pages/news.html",
"/pages/profile/koki.html",
"/pages/profile/ayano.html",
"/pages/Owner/data.html",

"/css/admin.css",
"/css/style.css",
"/css/calendar.css",
"/css/contact.css",
"/css/profile.css",
"/css/home.css",
"/css/owner.css",
"/css/nav.css",


"/js/script.js",
"/js/calendar.js",
"/js/holiday.js",
"/js/login.js",
"/js/install.js",
"/js/slideshow.js",
"/js/OwnerSlideshow.js",
"/js/OwnerSlideshow2.js",


"/data/2026/schedule.json",
"/data/2027/schedule.json",
"/data/2028/schedule.json",

"/stamp/kinosaki.png",

"/img/admin.jpg",
"/img/hero.jpg",
"/img/koki.jpg",
"/img/ayano.jpg",
"/img/slide/slide1.jpg",
"/img/slide/slide2.jpg",
"/img/slide/slide3.jpg",
"/img/slide/slide4.jpg",
"/img/slide/slide5.jpg",
"/img/slide/slide6.jpg",

"/img/owner/slide1.jpg",
"/img/owner/slide2.jpg",
"/img/owner/slide3.jpg",
"/img/owner/slide4.jpg",
"/img/owner/slide5.jpg",
"/img/owner/slide6.jpg",
"/img/owner/slide7.jpg",
"/img/owner/slide8.jpg",
"/img/owner/slide9.jpg",
"/img/owner/slide10.jpg",
"/img/owner/slide11.jpg",
"/img/owner/slide12.jpg",
"/img/owner/slide13.jpg",
"/img/owner/slide14.jpg",
"/img/owner/slide15.jpg",
"/img/owner/slide16.jpg",
"/img/owner/slide17.jpg",
"/img/owner/slide18.jpg",
"/img/owner/slide19.jpg",
"/img/owner/slide20.jpg",



"/icon/icon-1.png",
"/icon/icon-2.png",
"/icon/icon-koki.png",
"/icon/icon-ayano.png",
"/icon/icon-insta.png",
"/icon/kinosaki.png",

"/icon/liz.png",
"/icon/sora.png",

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