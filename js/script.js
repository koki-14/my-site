
// ===============================
// DOM取得
// ===============================
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const overlay = document.getElementById("overlay");
const navLinks = nav.querySelectorAll("a");

// ===============================
// ログインチェック（必須）
if (sessionStorage.getItem("admin") !== "1") {
  location.replace("../index.html");
}

// PWA / 戻る対策
window.addEventListener("pageshow", () => {
  if (sessionStorage.getItem("admin") !== "1") {
    location.replace("../index.html");
  }
});

// ===============================
// スクロール制御
// ===============================
let scrollY = 0;

function lockScroll() {
  scrollY = window.scrollY;

  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = "100%";
}

function unlockScroll() {
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";

  window.scrollTo(0, scrollY);
}

// ===============================
// メニュー開閉（統一管理）
// ===============================
function openMenu() {

  menuOpen = true;

  nav.classList.add("active");
  overlay.classList.add("active");
  logoutBtn?.classList.add("active");

  nav.style.transition = "transform .35s cubic-bezier(.2,.8,.2,1)";
  nav.style.transform = "translateX(0)";

  overlay.style.opacity = "0.5";

  lockScroll();

}

function closeMenu() {

  menuOpen = false;

  nav.classList.remove("active");
  overlay.classList.remove("active");
  logoutBtn?.classList.remove("active");

  nav.style.transition = "transform .35s cubic-bezier(.2,.8,.2,1)";
  nav.style.transform = "translateX(-100%)";

  overlay.style.opacity = "0";

  unlockScroll();

}

// ===============================
// ボタン操作
// ===============================
menuBtn.addEventListener("click", () => {
  const isOpen = nav.classList.contains("active");

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

// 背景タップで閉じる
overlay.addEventListener("click", closeMenu);

// リンク押下で閉じる
navLinks.forEach(link => {
  link.addEventListener("click", closeMenu);
});

// ===============================
// Service Worker登録
// ===============================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("../service-worker.js");
}

// ===============================
// Instagramリンク（フォールバック付き）
// ===============================
function openInstagram(appUrl, webUrl) {
  window.location.href = appUrl;

  setTimeout(() => {
    window.location.href = webUrl;
  }, 700);
}

// -------------------------------
// Koki
// -------------------------------
const instagramLinkKoki = document.getElementById("instagramLink_koki");

if (instagramLinkKoki) {
  instagramLinkKoki.addEventListener("click", (e) => {
    e.preventDefault();

    openInstagram(
      "instagram://user?username=k_j.f_a",
      "https://www.instagram.com/k_j.f_a/"
    );
  });
}

// -------------------------------
// Ayano
// -------------------------------
const instagramLinkAyano = document.getElementById("instagramLink_ayano");

if (instagramLinkAyano) {
  instagramLinkAyano.addEventListener("click", (e) => {
    e.preventDefault();

    openInstagram(
      "instagram://user?username=kame__0227",
      "https://www.instagram.com/kame__0227/"
    );
  });
}


// ===============================
// ★ iOS風スワイプ（追従＋影＋PC無効+慣性 + バネ + 半開き対応）
// ===============================

// PCでは無効
const isMobile = window.matchMedia("(max-width: 768px)").matches;

const maxWidth = 260; // メニュー幅

// 状態
let startX = 0;
let currentX = 0;
let dragging = false;
let menuOpen = false;
let lastX = 0;
let velocity = 0;
let lastTime = 0;


// 影（オーバーレイ透明度）
function setOverlay(x) {
  const p = Math.min(x / maxWidth, 1);
  overlay.style.opacity = p * 0.5;
}

// メニュー位置
function setNav(x) {
  const translate = -maxWidth + x;
  nav.style.transform = `translateX(${translate}px)`;
}


// ===============================
// アニメ補助（バネ）
// ===============================
function springTo(target) {

  nav.style.transition =
      "transform .35s cubic-bezier(.2,.8,.2,1)";

  nav.style.transform =
      `translateX(${target-maxWidth}px)`;

  overlay.style.transition =
      "opacity .25s ease";

  overlay.style.opacity =
      (target/maxWidth)*0.5;

}

// ===============================
// メニュー位置更新
// ===============================
function setPosition(x) {
  const translate = x - maxWidth;
  nav.style.transform = `translateX(${translate}px)`;

  overlay.style.opacity = (x / maxWidth) * 0.5;
}

// ===============================
// 慣性計算
// ===============================
function calcVelocity(x, time) {
  const dt = time - lastTime;

  if (dt > 0) {
    velocity = (x - lastX) / dt;
  }

  lastX = x;
  lastTime = time;
}

// ===============================
// iOS風スワイプ
// ===============================
if (isMobile) {

  document.addEventListener("touchstart", (e) => {

    startX = e.touches[0].clientX;
    lastX = startX;
    lastTime = Date.now();

    if (startX < 30 || menuOpen) {
      dragging = true;
      nav.classList.add("dragging");
    }

  });

  document.addEventListener("touchmove", (e) => {

    if (!dragging) return;

    currentX = e.touches[0].clientX;

    const now = Date.now();

    let diff = currentX - startX;

    if (menuOpen) {
      diff -= maxWidth;
    }

    diff = Math.max(-maxWidth, Math.min(0, diff));

    const x = diff + maxWidth;

    calcVelocity(x, now);

    setPosition(x);

  });

  document.addEventListener("touchend", () => {

    if (!dragging) return;

    dragging = false;

    nav.classList.remove("dragging");

    const matrix = new WebKitCSSMatrix(
      getComputedStyle(nav).transform
    );

    let x = matrix.m41 + maxWidth;

    // 慣性
    x += velocity * 250;

    x = Math.max(0, Math.min(maxWidth, x));

    if (x > maxWidth / 2) {

      menuOpen = true;

      openMenu();

      springTo(maxWidth);

    } else {

      menuOpen = false;

      closeMenu();

      springTo(0);

    }

  });

  overlay.addEventListener("click", () => {

    menuOpen = false;

    closeMenu();

    springTo(0);

  });

}