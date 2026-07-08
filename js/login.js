// =====================================
// 管理者パスワード
// =====================================
const ADMIN_PASS = "0520";

// =====================================
// オーナーパスワード
// =====================================
const OWNER_PASS = "6480";

// =====================================
// 管理者ログイン
// =====================================
function adminLogin() {

  const password = prompt("管理者ログインパスワード");

  if (password === null) return;

  if (password === ADMIN_PASS) {

    sessionStorage.setItem("role", "admin");
    location.replace("pages/home.html");

  } else {

    alert("パスワードが違います");

  }

}

// =====================================
// オーナーログイン
// =====================================
const OwnerLogin = document.getElementById("OwnerLogin");

if (OwnerLogin) {

  OwnerLogin.addEventListener("click", () => {

    const password = prompt("オーナーログインパスワード");

    if (password === null) return;

    if (password === OWNER_PASS) {

      sessionStorage.setItem("role", "owner");
      location.replace("owner.html");

    } else {

      alert("パスワードが違います");

    }

  });

}

// =====================================
// ログアウト（home, about, schedule, contact, calendar）
// =====================================
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.addEventListener("click", () => {

    sessionStorage.removeItem("role");
    location.replace("../index.html");

  });

}

// =====================================
// ログアウト（profileページ用）
// =====================================
const logoutBtn2 = document.getElementById("logoutBtn2");

if (logoutBtn2) {

  logoutBtn2.addEventListener("click", () => {

    sessionStorage.removeItem("role");   // ログインログを消去
    location.replace("../../index.html");

  });

}

// =====================================
// オーナーログアウト
// =====================================
const OwnerLogoutBtn = document.getElementById("OwnerLogoutBtn");

if (OwnerLogoutBtn) {

OwnerLogoutBtn.addEventListener("click", () => {

  sessionStorage.setItem("role", "admin"); // または必要な権限　　オーナーログインを消し管理者として残す
  location.replace("home.html");

});

}

// =====================================
// オーナーログアウト(Data)
// =====================================
const OwnerPagesLogoutBtn = document.getElementById("OwnerPagesLogoutBtn");

if (OwnerPagesLogoutBtn) {

  OwnerPagesLogoutBtn.addEventListener("click", () => {

    sessionStorage.setItem("role", "admin"); // オーナーログインを消し管理者として残す    

location.replace("../home.html");



  });

}