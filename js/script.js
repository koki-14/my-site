const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const overlay = document.getElementById("overlay");
const navLinks = nav.querySelectorAll("a");

// メニュー開閉
// メニューを開閉でactiveクラスがなければ追加、あれば削除

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
  overlay.classList.toggle("active");
  log-btn.classList.toggle("active");

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
  log-btn.classList.remove("active");
}
