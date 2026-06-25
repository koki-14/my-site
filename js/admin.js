// 🔐 管理者確認

const ok = sessionStorage.getItem("admin");

if (!ok) {
  alert("ログインしてください");
  location.href = "../index.html";
}
