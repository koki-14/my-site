/* ==========================================
   背景スライドショー（横スライド）
========================================== */
document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 表示する画像一覧
  // 写真を増やす場合はここへ追加
  // ==========================================
  const slides = [
    "../img/slide/slide1.jpg",
    "../img/slide/slide2.jpg",
    "../img/slide/slide3.jpg",
    "../img/slide/slide4.jpg",
    "../img/slide/slide5.jpg",
    "../img/slide/slide6.jpg"
    // "../img/slide7.jpg"
  ];

  // ==========================================
  // HTMLから画像要素を取得
  // ==========================================
  const img1 = document.getElementById("slide1");
  const img2 = document.getElementById("slide2");

  // 万が一画像が無ければ終了
  if (!img1 || !img2) return;

  // ==========================================
  // 現在表示中の画像
  // ==========================================
  let current = img1;

  // 次に表示する画像
  let next = img2;

  // 現在の画像番号
  let index = 0;

  // ==========================================
  // 4秒ごとに画像切替
  // ==========================================
  setInterval(() => {

    // 次の画像番号
    index = (index + 1) % slides.length;

    // ==========================================
    // 次に表示する画像をセット
    // ==========================================
    next.src = slides[index];

    // アニメーション無しで
    // 画面右側へ待機させる
    next.style.transition = "none";
    next.style.transform = "translateX(100%)";

    // ==========================================
    // 次の画面描画タイミングで
    // スライド開始
    // ==========================================
    requestAnimationFrame(() => {

      // アニメーション時間
      current.style.transition = "transform .8s ease";
      next.style.transition = "transform .8s ease";

      // 現在の画像を左へ移動
      current.style.transform = "translateX(-100%)";

      // 次の画像を中央へ移動
      next.style.transform = "translateX(0)";

    });

    // ==========================================
    // スライド終了後
    // ==========================================
    setTimeout(() => {

      // 古い画像を右側へ戻す
      current.style.transition = "none";
      current.style.transform = "translateX(100%)";

      // ==========================================
      // 表示画像を入れ替える
      //
      // current ← next
      // next ← current
      // ==========================================
      [current, next] = [next, current];

    }, 800);

  }, 4000);

});