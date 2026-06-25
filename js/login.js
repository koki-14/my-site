const logoutBtn = document.getElementById("logoutBtn");


// 🔐 管理者パスワード
const ADMIN_PASS = "0520";

// ログイン
function adminLogin() {
  const p = prompt("ログインパスワード");

  if (p === ADMIN_PASS) {
    sessionStorage.setItem("admin", "1");
    location.href = "pages/home.html";
  } else {
    alert("パスワードが違います");
  }
}

// ログアウト

logoutBtn.addEventListener("click", () => {

  sessionStorage.removeItem("admin");
  location.href = "../index.html";
});