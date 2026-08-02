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

  const year = current.getFullYear();

  try {

    const res = await fetch(`../data/${year}/schedule.json`);

    if (!res.ok) {

      console.error(
        `schedule.jsonを読み込めませんでした: ${res.status}`
      );

      schedules = {};

      return;
    }

    schedules = await res.json();

    console.log("読み込んだスケジュール:", schedules);

  } catch (error) {

    console.error("JSON読み込みエラー:", error);

    schedules = {};

  }
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

// ===============================
// 今日の日付か判定
// ===============================
const today = new Date();

const todayDate =
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

// 今日ならtodayクラスを追加
if (date === todayDate) {
  cell.classList.add("today");
}

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

  // ===============================
  // 日付クリック
  // ===============================
  cell.addEventListener("click", () => {

    // クリックした日の予定を表示
    openScheduleModal(date, holidayList[date]);

  });

    // カレンダーに追加
    calendar.appendChild(cell);
  }
}



// ===============================
// モーダル要素
// ===============================
const scheduleModal = document.getElementById("scheduleModal");
const modalDate = document.getElementById("modalDate");
const modalEvents = document.getElementById("modalEvents");
const modalClose = document.getElementById("modalClose");


// ===============================
// 予定詳細を表示
// ===============================
function openScheduleModal(date, holidayName) {

  // -------------------------------
  // 日付を表示
  // -------------------------------
  modalDate.textContent = date;


  // -------------------------------
  // 既存内容を削除
  // -------------------------------
  modalEvents.innerHTML = "";


  // -------------------------------
  // 祝日
  // -------------------------------
  if (holidayName) {

    const holiday = document.createElement("div");

    holiday.className = "modal-holiday";
    holiday.textContent = `祝日：${holidayName}`;

    modalEvents.appendChild(holiday);
  }


  // -------------------------------
  // 予定を取得
  // -------------------------------
  const events = schedules[date];


  // -------------------------------
  // 予定がない場合
  // -------------------------------
  if (!events || events.length === 0) {

    const empty = document.createElement("p");

    empty.textContent = "予定はありません。";

    modalEvents.appendChild(empty);

  }


  // -------------------------------
  // 予定を表示
  // -------------------------------
  else {

    events.forEach(item => {

      const event = document.createElement("div");

      event.className =
        "modal-event " + getClass(item.type);


      // 予定タイトル
      const title = document.createElement("div");

      title.className = "modal-event-title";
      title.textContent = item.title;

      event.appendChild(title);

      // -------------------------------
      // 時間
      // -------------------------------
      if (item.time) {

        const time = document.createElement("div");

        time.textContent = `時間：${item.time}`;

        event.appendChild(time);
      }


      // -------------------------------
      // 場所
      // -------------------------------
      if (item.place) {

        const place = document.createElement("div");

        place.textContent = `場所：${item.place}`;

        event.appendChild(place);
      }


      // -------------------------------
      // 詳細
      // -------------------------------
      if (item.detail) {

        const detail = document.createElement("div");

        detail.textContent = `詳細：${item.detail}`;

        event.appendChild(detail);
      }


      // 予定種類
      const type = document.createElement("div");

      type.className = "modal-event-type";
      type.textContent = `種類：${item.type}`;



      event.appendChild(type);

      modalEvents.appendChild(event);

    });

  }


  // -------------------------------
  // モーダル表示
  // -------------------------------
  scheduleModal.classList.add("show");

}


// ===============================
// 閉じるボタン
// ===============================
modalClose.addEventListener("click", () => {

  scheduleModal.classList.remove("show");

});


// ===============================
// モーダル外側をクリックして閉じる
// ===============================
scheduleModal.addEventListener("click", (e) => {

  if (e.target === scheduleModal) {

    scheduleModal.classList.remove("show");

  }

});


// ===============================
// ESCキーで閉じる
// ===============================
document.addEventListener("keydown", (e) => {

  if (e.key === "Escape") {

    scheduleModal.classList.remove("show");

  }

});

// ===============================
// ページ読み込み時にカレンダー表示
// ===============================
window.addEventListener("DOMContentLoaded", drawCalendar);
