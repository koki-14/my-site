// =====================================
// ログアウトボタンを取得
// HTML側の id="logoutBtn" を取得する
// =====================================
const logoutBtn = document.getElementById("logoutBtn");

// =====================================
// 管理者パスワード
// 実際の運用ではコードに直接書かない方が安全です。
// （今回は簡易ログイン用）
// =====================================
const ADMIN_PASS = "0520";

// =====================================
// 管理者ログイン
// =====================================
function adminLogin() {

  // パスワード入力ダイアログを表示
  const password = prompt("ログインパスワード");

  // 「キャンセル」が押された場合は何もしない
  if (password === null) {
    return;
  }

  // パスワードが一致した場合
  if (password === ADMIN_PASS) {

    // ログイン状態を保存
    // sessionStorage はブラウザを閉じると自動で消える
    sessionStorage.setItem("admin", "1");

    // Home画面へ移動
    // replace()を使うことでログイン画面を履歴に残さない
    location.replace("pages/home.html");

  } else {

    // パスワードが違う
    alert("パスワードが違います");

  }

}

// =====================================
// ログアウトボタン取得
const logoutBtn = document.getElementById("logoutBtn");

// 要素が存在するかチェック（超重要）
if (logoutBtn) {

  logoutBtn.addEventListener("click", () => {

    // 管理者ログイン状態を削除
    sessionStorage.removeItem("admin");

    // indexへ戻す（履歴を残さない）
    location.replace("../index.html");

  });

}