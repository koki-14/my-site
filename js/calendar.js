// =========================================
// DOM取得
// =========================================

// カレンダー本体
const calendar = document.getElementById("calendar");

// タイトル
const monthTitle = document.getElementById("monthTitle");

// ボタン
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// =========================================
// 状態管理
// =========================================

// 現在表示中の年月
let current = new Date();

// 読み込んだ予定データ
let schedules = {};

// 読み込み済みの年（キャッシュ）
let loadedYear = null;

// =========================================
// イベント登録
// =========================================

// 前月
prevBtn.addEventListener("click", async () => {

  current.setMonth(current.getMonth() - 1);

  await drawCalendar();

});

// 次月
nextBtn.addEventListener("click", async () => {

  current.setMonth(current.getMonth() + 1);

  await drawCalendar();

});

// =========================================
// JSON読込
// =========================================

async function loadSchedule() {

  const year = current.getFullYear();

  if (loadedYear === year) {
    return;
  }

  try {

    const response =
      await fetch(`../data/${year}/schedule.json`);

    if (response.ok) {

      schedules = await response.json();

    } else {

      schedules = {};

    }

  } catch (error) {

    console.error("予定データの読込失敗", error);

    schedules = {};

  }

  loadedYear = year;

}

// =========================================
// 予定の色を決定
// =========================================

function getClass(type){

  switch(type){

    case "travel":
      return "travel";

    case "festival":
      return "festival";

    case "work":
      return "work";

    case "personal":
      return "personal";

    default:
      return "event";

  }

}

const holidayList =
    createHolidayList(year);

if(holidayList[date]){

    cell.classList.add("holiday");

    const holiday =
        document.createElement("div");

    holiday.className =
        "event holiday";

    holiday.textContent =
        holidayList[date];

    cell.appendChild(holiday);

}

// =========================================
// 予定表示
// =========================================

function drawEvents(cell, date){

  if(!schedules[date]) return;

  schedules[date].forEach(item => {

    const event =
      document.createElement("div");

    event.className =
      "event " + getClass(item.type);

    event.textContent =
      item.title;

    cell.appendChild(event);

  });

}

// =========================================
// カレンダー描画
// =========================================

async function drawCalendar(){

  await loadSchedule();

  calendar.innerHTML = "";

  const year = current.getFullYear();
  const month = current.getMonth();

  monthTitle.textContent =
    `${year}年 ${month + 1}月`;

  const firstDay =
    new Date(year, month, 1).getDay();

  const lastDate =
    new Date(year, month + 1, 0).getDate();

  const weeks = ["日","月","火","水","木","金","土"];

  weeks.forEach(day => {

    const div = document.createElement("div");

    div.className = "week";

    div.textContent = day;

    calendar.appendChild(div);

  });

  for(let i = 0; i < firstDay; i++){

    calendar.appendChild(document.createElement("div"));

  }

  for(let day = 1; day <= lastDate; day++){

    const cell = document.createElement("div");

    cell.className = "day";

    const date =
      `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

    cell.innerHTML =
      `<div class="date">${day}</div>`;

    drawEvents(cell, date);

    calendar.appendChild(cell);

  }

}

// =========================================
// 初期表示
// =========================================

drawCalendar();