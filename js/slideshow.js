/* ==========================================
   背景スライドショー（横スライド）
========================================== */
document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 表示する画像一覧
  // ==========================================
  const slides = [
    "../img/slide/slide1.jpg",
    "../img/slide/slide2.jpg",
    "../img/slide/slide3.jpg",
    "../img/slide/slide4.jpg",
    "../img/slide/slide5.jpg",
    "../img/slide/slide6.jpg"
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
  // 初期画像・位置設定
  // ==========================================
  img1.src = slides[0];
  img2.src = slides[1];
  bg1.style.backgroundImage = `url(${slides[0]})`;
  bg2.style.backgroundImage = `url(${slides[1]})`;

  img1.style.transform = "translateX(0)";
  img2.style.transform = "translateX(100%)";
  bg1.style.transform = "translateX(0) scale(1.2)";
  bg2.style.transform = "translateX(100%) scale(1.2)";

  // ==========================================
  // 現在表示中の管理変数
  // ==========================================
  let current = img1;
  let next = img2;
  let currentBg = bg1;
  let nextBg = bg2;
  let index = 0;

  // ==========================================
  // 4秒ごとにスライド
  // ==========================================
  setInterval(() => {
    // 次のインデックスを計算
    index = (index + 1) % slides.length;

    // 次に表示する画像を設定
    next.src = slides[index];
    nextBg.style.backgroundImage = `url(${slides[index]})`;

    // 【修正】一度アニメーションなしで確実に右側に配置する
    next.style.transition = "none";
    next.style.transform = "translateX(100%)";
    nextBg.style.transition = "none";
    nextBg.style.transform = "translateX(100%) scale(1.2)";

    // 【修正】2回の requestAnimationFrame でブラウザに右側配置を認識させる
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // アニメーションを有効化
        current.style.transition = "transform .8s ease";
        next.style.transition = "transform .8s ease";
        currentBg.style.transition = "transform .8s ease";
        nextBg.style.transition = "transform .8s ease";

        // スライド実行（左へ移動）
        current.style.transform = "translateX(-100%)";
        currentBg.style.transform = "translateX(-100%) scale(1.2)";

        // 次の画像を中心へ
        next.style.transform = "translateX(0)";
        nextBg.style.transform = "translateX(0) scale(1.2)";
      });
    });

    // アニメーション完了後（800ms後）にリセットと入れ替え
    setTimeout(() => {
      current.style.transition = "none";
      current.style.transform = "translateX(100%)";
      currentBg.style.transition = "none";
      currentBg.style.transform = "translateX(100%) scale(1.2)";

      // 変数の入れ替え
      [current, next] = [next, current];
      [currentBg, nextBg] = [nextBg, currentBg];
    }, 800);
  }, 4000);
});