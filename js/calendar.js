// ===============================
// DOM要素の取得
// ===============================
const calendar = document.getElementById("calendar");     // カレンダー本体のコンテナ
const monthTitle = document.getElementById("monthTitle"); // 表示中の年月タイトル
const prevBtn = document.getElementById("prevBtn");       // 前月ボタン
const nextBtn = document.getElementById("nextBtn");       // 次月ボタン

// ===============================
// 状態管理
// ===============================
let current = new Date();   // 現在表示している年月（初期は今日）
let schedules = {};         // スケジュールデータ（JSONから取得）
let loadedYear = null;      // すでに読み込んだ年（無駄な通信防止）

// ===============================
// 前月ボタン処理
// ===============================
prevBtn.addEventListener("click", async () => {
  current.setMonth(current.getMonth() - 1); // 1ヶ月戻す
  await drawCalendar();                      // カレンダー再描画
});

// ===============================
// 次月ボタン処理
// ===============================
nextBtn.addEventListener("click", async () => {
  current.setMonth(current.getMonth() + 1); // 1ヶ月進める
  await drawCalendar();                      // カレンダー再描画
});

// ===============================
// スケジュールデータを読み込む
// ===============================
async function loadSchedule() {
  const year = current.getFullYear(); // 現在表示中の年

  // すでに同じ年を読み込んでいるなら処理しない（無駄なfetch防止）
  if (loadedYear === year) return;

  try {
    // 年ごとのJSONファイルを取得
    const res = await fetch(`../data/${year}/schedule.json`);

    // 成功したらJSONを使用、失敗したら空データ
    schedules = res.ok ? await res.json() : {};
  } catch (e) {
    // 通信エラー時も空データにする
    schedules = {};
  }

  // 読み込んだ年を記録
  loadedYear = year;
}

// ===============================
// イベントの種類からCSSクラスを決定
// ===============================
function getClass(type) {
  switch (type) {
    case "travel": return "travel";       // 旅行
    case "festival": return "festival";   // 祭り
    case "work": return "work";           // 仕事
    case "personal": return "personal";   // 個人予定
    case "birthday": return "birthday";   // 誕生日
    default: return "event";              // その他
  }
}

// ===============================
// 指定日のイベントをセルに描画
// ===============================
function drawEvents(cell, date) {
  // その日付に予定がなければ何もしない
  if (!schedules[date]) return;

  // 複数イベントを1つずつ表示
  schedules[date].forEach(item => {
    const div = document.createElement("div");
    div.className = "event " + getClass(item.type); // 種類ごとに色分け
    div.textContent = item.title;                   // イベント名
    cell.appendChild(div);                          // セルに追加
  });
}

// ===============================
// カレンダー全体を描画
// ===============================
async function drawCalendar() {
  await loadSchedule(); // スケジュール読み込み

  calendar.innerHTML = ""; // 既存のカレンダーをリセット

  const year = current.getFullYear();
  const month = current.getMonth();

  // 上部の年月表示
  monthTitle.textContent = `${year}年 ${month + 1}月`;

  // 月初の曜日（0:日曜〜6:土曜）
  const firstDay = new Date(year, month, 1).getDay();

  // 月の日数（翌月0日＝今月最終日）
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 祝日リスト（外部関数がある場合のみ取得）
  let holidayList = {};
  if (typeof createHolidayList === "function") {
    holidayList = createHolidayList(year);
  }

  // 曜日表示
  const weeks = ["日","月","火","水","木","金","土"];

  weeks.forEach(d => {
    const div = document.createElement("div");
    div.className = "week";
    div.textContent = d;
    calendar.appendChild(div);
  });

  // 月初の空白（前月分の空セル）
  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  // 日付セルの生成
  for (let day = 1; day <= lastDate; day++) {
    const cell = document.createElement("div");
    cell.className = "day";

    // YYYY-MM-DD形式の文字列を作成
    const date =
      `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // 日付表示部分
    const dateDiv = document.createElement("div");
    dateDiv.className = "date";
    dateDiv.textContent = day;
    cell.appendChild(dateDiv);

    // 祝日の場合の処理
    if (holidayList[date]) {
      cell.classList.add("holiday");

      const h = document.createElement("div");
      h.className = "event holiday";
      h.textContent = holidayList[date];
      cell.appendChild(h);
    }

    // スケジュール表示
    drawEvents(cell, date);

    // カレンダーに追加
    calendar.appendChild(cell);
  }
}

// ===============================
// ページ読み込み時にカレンダー表示
// ===============================
window.addEventListener("DOMContentLoaded", drawCalendar);