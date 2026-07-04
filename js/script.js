const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const overlay = document.getElementById("overlay");
const navLinks = nav.querySelectorAll("a");


// ログインチェック（必須）
if (sessionStorage.getItem("admin") !== "1") {
  location.replace("../index.html");
}

// スワイプ・戻る対策（PWA対策）
window.addEventListener("pageshow", () => {

  if (sessionStorage.getItem("admin") !== "1") {
    location.replace("../index.html");
  }

});



// メニュー開閉
// メニューを開閉でactiveクラスがなければ追加、あれば削除

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
  overlay.classList.toggle("active");
  logoutBtn.classList.toggle("active");

});

// 背景タップで閉じる
overlay.addEventListener("click", closeMenu);

// リンク押下で閉じる
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});


// menuを閉じると 例)スライドメニュー=nav　nav.active{ left: 0;}    →nav{ left: -250px;}  隠れる
function closeMenu() {
  nav.classList.remove("active");
  overlay.classList.remove("active");
  logoutBtn.classList.remove("active");
}


// Service Worker登録
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("../service-worker.js");
}




const instagramLinkKoki = document.getElementById("instagramLink_koki");

if (instagramLinkKoki) {
  instagramLinkKoki.addEventListener("click", (e) => {
    // 処理

    e.preventDefault();

    // アプリを起動
    window.location.href = "instagram://user?username=k_j.f_a";

    // 起動できなかったらブラウザへ
    setTimeout(() => {
        window.location.href = "https://www.instagram.com/k_j.f_a/";
    }, 700);

  });
}

const instagramLinkAyano = document.getElementById("instagramLink_ayano");

if (instagramLinkAyano) {
  instagramLinkAyano.addEventListener("click", (e) => {
    // 処理

    e.preventDefault();

    // アプリを起動
    window.location.href = "instagram://user?username=kame__0227";

    // 起動できなかったらブラウザへ
    setTimeout(() => {
        window.location.href = "https://www.instagram.com/kame__0227/";
    }, 700);


  });
}




