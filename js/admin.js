// 🔐 管理者チェック
const ADMIN_PASS = "0520";

const ok = sessionStorage.getItem("admin");

if (!ok) {
  const p = prompt("管理者パスワードを入力してください");
  if (p !== ADMIN_PASS) {
    location.href = "index.html";
  } else {
    sessionStorage.setItem("admin", "1");
  }
}


// 🚪 ログアウト
function logout() {
  sessionStorage.removeItem("admin");
  location.href = "index.html";
}
