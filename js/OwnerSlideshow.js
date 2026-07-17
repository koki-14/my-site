/* ==========================================
   背景スライドショー（横スライド）
========================================== */
document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 表示する画像一覧
  // 写真を増やす場合はここへ追加
  // ==========================================
  const slides = [
    "../img/owner/slide1.jpg",
    "../img/owner/slide2.jpg",
    "../img/owner/slide3.jpg",
    "../img/owner/slide4.jpg",
    "../img/owner/slide5.jpg",
    "../img/owner/slide6.jpg",
    "../img/owner/slide7.jpg",
    "../img/owner/slide8.jpg",
    "../img/owner/slide9.jpg",
    "../img/owner/slide10.jpg",
    "../img/owner/slide11.jpg",
    "../img/owner/slide12.jpg",
    "../img/owner/slide13.jpg",
    "../img/owner/slide14.jpg",
    "../img/owner/slide15.jpg",
    "../img/owner/slide16.jpg",
    "../img/owner/slide17.jpg",
    "../img/owner/slide18.jpg",
    "../img/owner/slide19.jpg",
    "../img/owner/slide20.jpg"

    // "../img/slide4.jpg"
  ];

  // ==========================================
  // HTML取得
  // ==========================================
  const img1 = document.getElementById("slide1");
  const img2 = document.getElementById("slide2");

  const bg1 = document.getElementById("bg1");
  const bg2 = document.getElementById("bg2");

  // 要素が無ければ終了
  if (!img1 || !img2 || !bg1 || !bg2) return;

  // ==========================================
  // 初期画像
  // ==========================================
  img1.src = slides[0];
  img2.src = slides[1];

  bg1.style.backgroundImage = `url(${slides[0]})`;
  bg2.style.backgroundImage = `url(${slides[1]})`;

  // 初期位置
  img1.style.transform = "translateX(0)";
  img2.style.transform = "translateX(100%)";

  bg1.style.transform = "translateX(0) scale(1.2)";
  bg2.style.transform = "translateX(100%) scale(1.2)";

  // ==========================================
  // 現在表示中
  // ==========================================
  let current = img1;
  let next = img2;

  let currentBg = bg1;
  let nextBg = bg2;

  let index = 0;

  // ==========================================
  // 4秒ごと
  // ==========================================
  setInterval(() => {

    index = (index + 1) % slides.length;

    // 次画像
    next.src = slides[index];
    nextBg.style.backgroundImage = `url(${slides[index]})`;

    // 右へ待機
    next.style.transition = "none";
    next.style.transform = "translateX(100%)";

    nextBg.style.transition = "none";
    nextBg.style.transform = "translateX(100%) scale(1.2)";

    requestAnimationFrame(() => {

      // アニメーション開始
      current.style.transition = "transform .8s ease";
      next.style.transition = "transform .8s ease";

      currentBg.style.transition = "transform .8s ease";
      nextBg.style.transition = "transform .8s ease";

      // 左へ移動
      current.style.transform = "translateX(-100%)";
      currentBg.style.transform = "translateX(-100%) scale(1.2)";

      // 中央へ
      next.style.transform = "translateX(0)";
      nextBg.style.transform = "translateX(0) scale(1.2)";
    });

    setTimeout(() => {

      // 古い画像を右へ戻す
      current.style.transition = "none";
      current.style.transform = "translateX(100%)";

      currentBg.style.transition = "none";
      currentBg.style.transform = "translateX(100%) scale(1.2)";

      // 入れ替え
      [current, next] = [next, current];
      [currentBg, nextBg] = [nextBg, currentBg];

    }, 800);

  }, 4000);

});