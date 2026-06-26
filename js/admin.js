
// =========================
// ログイン処理
// =========================
const ADMIN_PASS = "0520";

function adminLogin() {

  const p = prompt("パスワード");

  if (p === ADMIN_PASS) {
    sessionStorage.setItem("admin", "1");
    location.replace("pages/home.html");
  }

}


// =========================
// ログアウト処理(home,about,schedule,contact,calender)
// =========================
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

  logoutBtn.addEventListener("click", () => {

    sessionStorage.removeItem("admin");

    location.replace("../index.html");

  });

}

// =========================
// ログアウト処理(profile)
// =========================
const logoutBtn2 = document.getElementById("logoutBtn2");

if (logoutBtn2) {

  logoutBtn2.addEventListener("click", () => {

    sessionStorage.removeItem("admin");

    location.replace("../../index.html");

  });

}