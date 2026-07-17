// ========================
// PWAインストールボタン
// ========================

// インストールボタン取得
const installBtn =
  document.getElementById("installBtn");

// インストールイベント保存用
let deferredPrompt;

// ------------------------
// インストール済み判定
// Android Chrome
// iPhone Safari
// 両対応
// ------------------------
function isInstalled() {

  return (
    window.matchMedia(
      "(display-mode: standalone)"
    ).matches ||

    window.navigator.standalone === true
  );

}

// ------------------------
// ページ読込時
// インストール済みなら
// ボタンを非表示
// ------------------------
window.addEventListener(
  "load",
  () => {

    if (isInstalled()) {

      installBtn.style.display = "none";

    }

  }
);

// ------------------------
// インストール可能になったら
// ボタン表示
// ------------------------
window.addEventListener(
  "beforeinstallprompt",
  (e) => {

    e.preventDefault();

    deferredPrompt = e;

    if (!isInstalled()) {

      installBtn.hidden = false;

    }

  }
);

// ------------------------
// インストールボタン押下
// ------------------------
installBtn.addEventListener(
  "click",
  async () => {

    if (!deferredPrompt) return;

    // インストール画面表示
    deferredPrompt.prompt();

    // ユーザー選択待ち
    const result =
      await deferredPrompt.userChoice;

    // インストールしたらボタンを隠す
    if (result.outcome === "accepted") {

      installBtn.style.display = "none";

    }

    deferredPrompt = null;

  }
);

// ------------------------
// インストール完了時検知
// ------------------------
window.addEventListener(
  "appinstalled",
  () => {

    console.log("インストール完了");

    installBtn.style.display = "none";

  }
);