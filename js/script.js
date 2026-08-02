
// ===============================
// DOM取得
// ===============================
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const overlay = document.getElementById("overlay");
const navLinks = nav.querySelectorAll("a");

// ===============================
// ログインチェック（必須）
const role = sessionStorage.getItem("role");

if (role !== "admin" && role !== "owner") {
  location.replace("../index.html");
}

window.addEventListener("pageshow", () => {
  const role = sessionStorage.getItem("role");

  if (role !== "admin" && role !== "owner") {
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

navLinks.forEach(link => {

  if (link.id !== "OwnerLogin") {
    link.addEventListener("click", closeMenu);
  }

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
// PCでは無効（クォーテーションの修正） 
const isMobile = window.matchMedia("(max-width: 768px)").matches; 
const maxWidth = 260; 
// メニュー幅 
// 要素の取得（HTMLに合わせて調整してください） 
const nav = document.getElementById('nav'); 
const overlay = document.getElementById('overlay'); 
// 状態 
let startX = 0; 
let currentX = 0; 
let dragging = false; 
let menuOpen = false; 
let lastX = 0; 
let velocity = 0; 
let lastTime = 0; 
// =============================== 
// メニュー位置・影の更新（テンプレートリテラル修正） 
// =============================== 
function setPosition(x) { 
const translate = x - maxWidth; 
nav.style.transform = `translateX(${translate}px)`; 
overlay.style.opacity = (x / maxWidth) * 0.5; } 
// =============================== 
// アニメ補助（バネ / トランジション設定） 
// =============================== 
function springTo(target){ 
nav.style.transition = "transform .35s cubic-bezier(.2,.8,.2,1)"; 
overlay.style.transition = "opacity .25s ease"; 
setPosition(target); } 
// =============================== 
// 慣性計算 
// =============================== 
function calcVelocity(x, time) { 
const dt = time - lastTime; 
if (dt > 0) { 
velocity = (x - lastX) / dt; 
} 
lastX = x; 
lastTime = time; } 
// =============================== 
// iOS風スワイプイベント 
// =============================== 
if (isMobile && nav && overlay){ 
document.addEventListener("touchstart", (e) => { 
startX = e.touches[0].clientX; 
lastX = startX; 
lastTime = Date.now(); 
velocity = 0; 
// ベロシティのリセット 
// 画面左端(30px以内)からのスワイプ、またはメニューが開いている時のタップ 
if (startX < 30 || menuOpen) {
dragging = true; 
// トランジションを一時的に解除して追従性を高める 
nav.style.transition = "none"; 
overlay.style.transition = "none"; 
}
}, { 
passive: true 
}); document.addEventListener("touchmove", (e) => {
if (!dragging) return;
currentX = e.touches[0].clientX; 
const now = Date.now();
// 現在のメニュー位置を計算 
let x;
if (menuOpen) {
// 開いている状態からは左スワイプ（負の移動）を許容 
const diff = currentX - startX;
x = Math.max(0, Math.min(maxWidth, maxWidth + diff)); 
} else {
// 閉じてる状態からは右スワイプ 
const diff = currentX - startX;
x = Math.max(0, Math.min(maxWidth, diff));
} calcVelocity(x, now);
setPosition(x);
// スワイプ中の画面上下スクロールを防止 
if (e.cancelable) e.preventDefault();
}, { passive: false });
document.addEventListener("touchend", () => {
if (!dragging) return;
dragging = false;
// 現在の位置をCSSから取得 
const matrix = new WebKitCSSMatrix(getComputedStyle(nav).transform);
let x = matrix.m41 + maxWidth;
// 慣性を加算 
x += velocity * 150;
// 250から150に調整（滑らかさのため） 
x = Math.max(0, Math.min(maxWidth, x));
// 半分以上開いている、または右方向への勢いがある場合 
if (x > maxWidth / 2) { menuOpen = true; springTo(maxWidth);
} else {
menuOpen = false; springTo(0);
} }); 
// オーバーレイクリックで閉じる 
overlay.addEventListener("click", () => { menuOpen = false; springTo(0); }); }
