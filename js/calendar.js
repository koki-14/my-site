const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let current = new Date();
let schedules = {};
let loadedYear = null;

prevBtn.addEventListener("click", async () => {
  current.setMonth(current.getMonth() - 1);
  await drawCalendar();
});

nextBtn.addEventListener("click", async () => {
  current.setMonth(current.getMonth() + 1);
  await drawCalendar();
});

async function loadSchedule() {
  const year = current.getFullYear();

  if (loadedYear === year) return;

  try {
    const res = await fetch(`../data/${year}/schedule.json`);
    schedules = res.ok ? await res.json() : {};
  } catch (e) {
    schedules = {};
  }

  loadedYear = year;
}

function getClass(type) {
  switch (type) {
    case "travel": return "travel";
    case "festival": return "festival";
    case "work": return "work";
    case "personal": return "personal";
    default: return "event";
  }
}

function drawEvents(cell, date) {
  if (!schedules[date]) return;

  schedules[date].forEach(item => {
    const div = document.createElement("div");
    div.className = "event " + getClass(item.type);
    div.textContent = item.title;
    cell.appendChild(div);
  });
}

async function drawCalendar() {
  await loadSchedule();

  calendar.innerHTML = "";

  const year = current.getFullYear();
  const month = current.getMonth();

  monthTitle.textContent = `${year}年 ${month + 1}月`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  let holidayList = {};
  if (typeof createHolidayList === "function") {
    holidayList = createHolidayList(year);
  }

  const weeks = ["日","月","火","水","木","金","土"];

  weeks.forEach(d => {
    const div = document.createElement("div");
    div.className = "week";
    div.textContent = d;
    calendar.appendChild(div);
  });

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= lastDate; day++) {
    const cell = document.createElement("div");
    cell.className = "day";

    const date =
      `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const dateDiv = document.createElement("div");
    dateDiv.className = "date";
    dateDiv.textContent = day;
    cell.appendChild(dateDiv);

    if (holidayList[date]) {
      cell.classList.add("holiday");

      const h = document.createElement("div");
      h.className = "event holiday";
      h.textContent = holidayList[date];
      cell.appendChild(h);
    }

    drawEvents(cell, date);

    calendar.appendChild(cell);
  }
}

window.addEventListener("DOMContentLoaded", drawCalendar);