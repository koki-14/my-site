const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const overlay = document.getElementById("overlay");
const navLinks = nav.querySelectorAll("a");

// メニュー開閉
menuBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
  overlay.classList.toggle("active");
});

// 背景タップで閉じる
overlay.addEventListener("click", closeMenu);

// リンク押下で閉じる
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

function closeMenu() {
  nav.classList.remove("active");
  overlay.classList.remove("active");
}
