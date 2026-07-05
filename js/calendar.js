// =========================================
// DOM取得
// =========================================
const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// =========================================
// 状態管理
// =========================================
let current = new Date();
let schedules = {};
let loadedYear = null;

// =========================================
// イベント登録
// =========================================
prevBtn.addEventListener("click", async () => {
  current.setMonth(current.getMonth() - 1);
  await drawCalendar();
});

nextBtn.addEventListener("click", async () => {
  current.setMonth(current.getMonth() + 1);
  await drawCalendar();
});

// =========================================
// JSON読込
// =========================================
async function loadSchedule() {
  const year = current.getFullYear();

  if (loadedYear === year) return;

  try {
    const response = await fetch(`../data/${year}/schedule.json`);

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
// 予定の種類クラス
// =========================================
function getClass(type) {
  switch (type) {
    case "travel": return "travel";
    case "festival": return "festival";
    case "work": return "work";
    case "personal": return "personal";
    default: return "event";
  }
}

// =========================================
// 予定表示
// =========================================
function drawEvents(cell, date) {
  if (!schedules[date]) return;

  schedules[date].forEach(item => {
    const event = document.createElement("div");
    event.className = "event " + getClass(item.type);
    event.textContent = item.title;
    cell.appendChild(event);
  });
}

// =========================================
// カレンダー描画
// =========================================
async function drawCalendar() {
  await loadSchedule();

  calendar.innerHTML = "";

  const year = current.getFullYear();
  const month = current.getMonth();

  monthTitle.textContent = `${year}年 ${month + 1}月`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 祝日リスト（存在する場合のみ）
  let holidayList = {};
  if (typeof createHolidayList === "function") {
    holidayList = createHolidayList(year);
  }

  const weeks = ["日", "月", "火", "水", "木", "金", "土"];

  // 曜日行
  weeks.forEach(day => {
    const div = document.createElement("div");
    div.className = "week";
    div.textContent = day;
    calendar.appendChild(div);
  });

  // 空白
  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  // 日付生成
  for (let day = 1; day <= lastDate; day++) {
    const cell = document.createElement("div");
    cell.className = "day";

    const date =
      `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // 日付表示（先に作る）
    const dateDiv = document.createElement("div");
    dateDiv.className = "date";
    dateDiv.textContent = day;
    cell.appendChild(dateDiv);

    // 祝日
    if (holidayList[date]) {
      cell.classList.add("holiday");

      const holiday = document.createElement("div");
      holiday.className = "event holiday";
      holiday.textContent = holidayList[date];
      cell.appendChild(holiday);
    }

    // 予定
    drawEvents(cell, date);

    calendar.appendChild(cell);
  }
}

// =========================================
// 初期表示
// =========================================
drawCalendar();