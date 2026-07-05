
// ===============================
// DOM取得
// ===============================
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const overlay = document.getElementById("overlay");
const navLinks = nav.querySelectorAll("a");
const logoutBtn = document.getElementById("logoutBtn"); // ★追加（未定義防止）

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
  nav.classList.add("active");
  overlay.classList.add("active");
  logoutBtn?.classList.add("active");

  lockScroll(); // ★スクロール停止
}

function closeMenu() {
  nav.classList.remove("active");
  overlay.classList.remove("active");
  logoutBtn?.classList.remove("active");

  unlockScroll(); // ★スクロール復帰
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
// ★ iOS風スワイプ（追従＋影＋PC無効）
// ===============================

// PCでは無効
const isMobile = window.matchMedia("(max-width: 768px)").matches;

const maxWidth = 260; // メニュー幅

let startX = 0;
let currentX = 0;
let dragging = false;
let menuOpen = false;

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
// タッチ開始
// ===============================
if (isMobile) {

  document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;

    // 左端 or メニュー開いてるときのみ反応
    if (startX < 30 || menuOpen) {
      dragging = true;
      nav.classList.add("dragging");
    }
  });

  // ===============================
  // スワイプ中（追従メイン）
  // ===============================
  document.addEventListener("touchmove", (e) => {
    if (!dragging) return;

    currentX = e.touches[0].clientX;
    let diff = currentX - startX;

    if (menuOpen) diff = diff - maxWidth;

    // 制限
    if (diff < -maxWidth) diff = -maxWidth;
    if (diff > 0) diff = 0;

    const x = diff + maxWidth;

    setNav(x);
    setOverlay(x);
  });

  // ===============================
  // 指を離したとき（吸着）
  // ===============================
  document.addEventListener("touchend", () => {

    if (!dragging) return;

    dragging = false;
    nav.classList.remove("dragging");

    const matrix = new WebKitCSSMatrix(getComputedStyle(nav).transform);
    const x = matrix.m41;

    // 半分基準で開閉
    if (x > -130) {
      openMenu();
      nav.style.transform = "translateX(0)";
      overlay.style.opacity = 0.5;
      menuOpen = true;
    } else {
      closeMenu();
      nav.style.transform = "translateX(-100%)";
      overlay.style.opacity = 0;
      menuOpen = false;
    }
  });

  // ===============================
  // オーバーレイで閉じる
  // ===============================
  overlay.addEventListener("click", () => {
    closeMenu();
    nav.style.transform = "translateX(-100%)";
    overlay.style.opacity = 0;
    menuOpen = false;
  });
}