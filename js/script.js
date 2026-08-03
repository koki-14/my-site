
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

// PCでは無効
const isMobile = window.matchMedia("(max-width: 768px)").matches;

const maxWidth = 260; // メニュー幅

// 状態
let startX = 0;
let startY = 0;   // ← 追加
let currentX = 0;
let dragging = false;
let menuOpen = false;
let lastX = 0;
let velocity = 0;
let lastTime = 0;
let swipeDirection = null; // ← 追加




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
// ★ iOS風スワイプ
// ・スマホのみ
// ・左端　　px以内から開始
// ・右方向の横スワイプで開く
// ・縦スクロールは無視
// ・メニューが開いているときは左スワイプで閉じる
// ・慣性 + バネ
// ===============================

if (isMobile) {

  // ===============================
  // タッチ開始
  // ===============================
  document.addEventListener("touchstart", (e) => {

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

    lastX = startX;
    lastTime = Date.now();

    velocity = 0;

    dragging = false;
    swipeDirection = null;


    // ===============================
    // メニューが閉じている場合
    // ===============================

    if (!menuOpen) {

      // 左端300px以内で開始した場合のみ
      if (startX <= 300) {

        // この時点ではまだドラッグ開始しない
        // 横か縦かを判定するため
        dragging = true;

      }

    }

    // ===============================
    // メニューが開いている場合
    // ===============================

    else {

      // 開いているときは画面のどこからでも
      // 閉じるスワイプを許可

      dragging = true;

    }

  });


  // ===============================
  // タッチ移動
  // ===============================
  document.addEventListener("touchmove", (e) => {

    if (!dragging) return;


    currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;


    // ===============================
    // 開始位置からの移動量
    // ===============================

    const diffX = currentX - startX;
    const diffY = currentY - startY;


    // ===============================
    // まだ方向が決まっていない場合
    // ===============================

    if (swipeDirection === null) {

      // 少ししか動いていない場合
      // → 判定しない

      if (
        Math.abs(diffX) < 10 &&
        Math.abs(diffY) < 10
      ) {

        return;

      }


      // ===============================
      // 縦方向が強い
      // ===============================

      if (Math.abs(diffY) > Math.abs(diffX)) {

        swipeDirection = "vertical";

        dragging = false;

        nav.classList.remove("dragging");

        return;

      }


      // ===============================
      // 横方向が強い
      // ===============================

      swipeDirection = "horizontal";

      nav.classList.add("dragging");

    }


    // ===============================
    // 縦スワイプなら何もしない
    // ===============================

    if (swipeDirection !== "horizontal") {

      return;

    }


    // ===============================
    // メニューが閉じている場合
    // ===============================

    if (!menuOpen) {

      // 左方向へのスワイプは禁止

      if (diffX < 0) {

        setPosition(0);

        return;

      }


      // 右方向への移動量
      let x = diffX;


      // 0～maxWidthに制限

      x = Math.max(
        0,
        Math.min(maxWidth, x)
      );


      const now = Date.now();

      calcVelocity(x, now);

      setPosition(x);

    }


    // ===============================
    // メニューが開いている場合
    // ===============================

    else {

      // 開いている状態から
      // 左方向へスライドすると閉じる

      let x = maxWidth + diffX;


      // 0～maxWidthに制限

      x = Math.max(
        0,
        Math.min(maxWidth, x)
      );


      const now = Date.now();

      calcVelocity(x, now);

      setPosition(x);

    }

  });


  // ===============================
  // タッチ終了
  // ===============================
  document.addEventListener("touchend", () => {

    if (!dragging) return;


    dragging = false;

    nav.classList.remove("dragging");


    // ===============================
    // 縦スワイプなら終了
    // ===============================

    if (swipeDirection !== "horizontal") {

      swipeDirection = null;

      return;

    }


    // ===============================
    // 現在のメニュー位置取得
    // ===============================

    const matrix = new WebKitCSSMatrix(
      getComputedStyle(nav).transform
    );

    let x = matrix.m41 + maxWidth;


    // ===============================
    // 慣性
    // ===============================

    x += velocity * 250;


    // 範囲制限

    x = Math.max(
      0,
      Math.min(maxWidth, x)
    );


    // ===============================
    // 開く / 閉じる判定
    // ===============================

    if (x > maxWidth / 2) {

      // -------------------------------
      // 開く
      // -------------------------------

      menuOpen = true;

      openMenu();

      springTo(maxWidth);

    }

    else {

      // -------------------------------
      // 閉じる
      // -------------------------------

      menuOpen = false;

      closeMenu();

      springTo(0);

    }


    swipeDirection = null;

  });


  // ===============================
  // オーバーレイをタップして閉じる
  // ===============================

  overlay.addEventListener("click", () => {

    menuOpen = false;

    closeMenu();

    springTo(0);

  });

}


