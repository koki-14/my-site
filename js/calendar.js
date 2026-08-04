// ======================================================
// HTMLの読み込みが完全に終わってから実行
// ======================================================
document.addEventListener("DOMContentLoaded", () => {

  // ======================================================
  // DOM要素の取得
  // ======================================================

  const calendar = document.getElementById("calendar");
  const monthTitle = document.getElementById("monthTitle");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // モーダル
  const scheduleModal = document.getElementById("scheduleModal");
  const modalDate = document.getElementById("modalDate");
  const modalEvents = document.getElementById("modalEvents");
  const modalClose = document.getElementById("modalClose");


  // ======================================================
  // DOMが存在するか確認
  // ======================================================

  if (!calendar) {
    console.error("#calendar が見つかりません");
    return;
  }

  if (!monthTitle) {
    console.error("#monthTitle が見つかりません");
    return;
  }

  if (!prevBtn) {
    console.error("#prevBtn が見つかりません");
    return;
  }

  if (!nextBtn) {
    console.error("#nextBtn が見つかりません");
    return;
  }


  // ======================================================
  // 状態管理
  // ======================================================

  let current = new Date();

  // スケジュールデータ
  let schedules = {};

  // 現在読み込んでいる年
  let loadedYear = null;


  // ======================================================
  // 前月ボタン
  // ======================================================

  prevBtn.addEventListener("click", async () => {

    current.setMonth(current.getMonth() - 1);

    await drawCalendar();

  });


  // ======================================================
  // 次月ボタン
  // ======================================================

  nextBtn.addEventListener("click", async () => {

    current.setMonth(current.getMonth() + 1);

    await drawCalendar();

  });


  // ======================================================
  // スケジュールデータ読み込み
  // ======================================================

  async function loadSchedule() {

    const year = current.getFullYear();


    // ---------------------------------------------
    // 同じ年なら再読み込みしない
    // ---------------------------------------------

    if (loadedYear === year) {
      return;
    }


    try {

      const res = await fetch(
        `../data/${year}/schedule.json`
      );


      // ---------------------------------------------
      // JSONが存在しない場合
      // ---------------------------------------------

      if (!res.ok) {

        console.error(
          `schedule.jsonを読み込めませんでした: ${res.status}`
        );

        schedules = {};
        loadedYear = year;

        return;
      }


      // ---------------------------------------------
      // JSONを読み込み
      // ---------------------------------------------

      schedules = await res.json();

      loadedYear = year;


      console.log(
        `${year}年のスケジュールを読み込みました`,
        schedules
      );


    } catch (error) {

      console.error(
        "JSON読み込みエラー:",
        error
      );

      schedules = {};

    }

  }


  // ======================================================
  // イベント種類 → CSSクラス
  // ======================================================

  function getClass(type) {

    switch (type) {

      case "travel":
        return "travel";

      case "festival":
        return "festival";

      case "work":
        return "work";

      case "personal":
        return "personal";

      case "birthday":
        return "birthday";

      default:
        return "event";

    }

  }


  // ======================================================
  // 指定日のイベントを表示
  // ======================================================

  function drawEvents(cell, date) {

    // 予定がなければ終了
    if (!schedules[date]) {
      return;
    }


    // 複数イベント
    schedules[date].forEach(item => {

      const div = document.createElement("div");

      div.className =
        "event " + getClass(item.type);

      div.textContent = item.title;

      cell.appendChild(div);

    });

  }


  // ======================================================
  // カレンダー描画
  // ======================================================

  async function drawCalendar() {

    // ---------------------------------------------
    // JSON読み込み
    // ---------------------------------------------

    await loadSchedule();


    // ---------------------------------------------
    // カレンダーをリセット
    // ---------------------------------------------

    calendar.innerHTML = "";


    // ---------------------------------------------
    // 年・月
    // ---------------------------------------------

    const year = current.getFullYear();
    const month = current.getMonth();


    // ---------------------------------------------
    // タイトル
    // ---------------------------------------------

    monthTitle.textContent =
      `${year}年 ${month + 1}月`;


    // ---------------------------------------------
    // 月初の曜日
    // ---------------------------------------------

    const firstDay =
      new Date(year, month, 1).getDay();


    // ---------------------------------------------
    // 月末の日付
    // ---------------------------------------------

    const lastDate =
      new Date(year, month + 1, 0).getDate();


    // ==================================================
    // 祝日
    // ==================================================

    let holidayList = {};

    if (typeof createHolidayList === "function") {

      holidayList =
        createHolidayList(year);

    }


    // ==================================================
    // 曜日
    // ==================================================

    const weeks = [
      "日",
      "月",
      "火",
      "水",
      "木",
      "金",
      "土"
    ];


    weeks.forEach(day => {

      const div =
        document.createElement("div");

      div.className = "week";

      div.textContent = day;

      calendar.appendChild(div);

    });


    // ==================================================
    // 月初の空白
    // ==================================================

    for (let i = 0; i < firstDay; i++) {

      const empty =
        document.createElement("div");

      empty.className = "empty";

      calendar.appendChild(empty);

    }


    // ==================================================
    // 今日の日付
    // ==================================================

    const today = new Date();

    const todayDate =
      `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(
        today.getDate()
      ).padStart(2, "0")}`;


    // ==================================================
    // 日付セル作成
    // ==================================================

    for (
      let day = 1;
      day <= lastDate;
      day++
    ) {

      // ---------------------------------------------
      // セル
      // ---------------------------------------------

      const cell =
        document.createElement("div");

      cell.className = "day";


      // ---------------------------------------------
      // YYYY-MM-DD
      // ---------------------------------------------

      const date =
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


      // ---------------------------------------------
      // 今日
      // ---------------------------------------------

      if (date === todayDate) {

        cell.classList.add("today");

      }


      // ---------------------------------------------
      // 日付表示
      // ---------------------------------------------

      const dateDiv =
        document.createElement("div");

      dateDiv.className = "date";

      dateDiv.textContent = day;

      cell.appendChild(dateDiv);


      // ==================================================
      // 祝日
      // ==================================================

      if (holidayList[date]) {

        cell.classList.add("holiday");


        const h =
          document.createElement("div");

        h.className = "event holiday";

        h.textContent =
          holidayList[date];

        cell.appendChild(h);

      }


      // ==================================================
      // 予定
      // ==================================================

      drawEvents(
        cell,
        date
      );


      // ==================================================
      // 日付クリック
      // ==================================================

      cell.addEventListener("click", () => {

        openScheduleModal(
          date,
          holidayList[date]
        );

      });


      // ==================================================
      // カレンダーに追加
      // ==================================================

      calendar.appendChild(cell);

    }

  }


  // ======================================================
  // 予定詳細モーダル
  // ======================================================

  function openScheduleModal(
    date,
    holidayName
  ) {

    // ---------------------------------------------
    // モーダル要素がない場合
    // ---------------------------------------------

    if (
      !scheduleModal ||
      !modalDate ||
      !modalEvents
    ) {

      console.error(
        "モーダル用のHTMLが見つかりません"
      );

      return;

    }


    // ---------------------------------------------
    // 日付
    // ---------------------------------------------

    modalDate.textContent = date;


    // ---------------------------------------------
    // 内容をリセット
    // ---------------------------------------------

    modalEvents.innerHTML = "";


    // ==================================================
    // 祝日
    // ==================================================

    if (holidayName) {

      const holiday =
        document.createElement("div");

      holiday.className =
        "modal-holiday";

      holiday.textContent =
        `祝日：${holidayName}`;

      modalEvents.appendChild(holiday);

    }


    // ==================================================
    // 予定取得
    // ==================================================

    const events =
      schedules[date];


    // ==================================================
    // 予定なし
    // ==================================================

    if (
      !events ||
      events.length === 0
    ) {

      const empty =
        document.createElement("p");

      empty.textContent =
        "予定はありません。";

      modalEvents.appendChild(empty);

    }


    // ==================================================
    // 予定あり
    // ==================================================

    else {

      events.forEach(item => {

        const event =
          document.createElement("div");

        event.className =
          "modal-event " +
          getClass(item.type);


        // ---------------------------------------------
        // タイトル
        // ---------------------------------------------

        const title =
          document.createElement("div");

        title.className =
          "modal-event-title";

        title.textContent =
          item.title;

        event.appendChild(title);


        // ---------------------------------------------
        // 時間
        // ---------------------------------------------

        if (item.time) {

          const time =
            document.createElement("div");

          time.textContent =
            `時間：${item.time}`;

          event.appendChild(time);

        }


        // ---------------------------------------------
        // 場所
        // ---------------------------------------------

        if (item.place) {

          const place =
            document.createElement("div");

          place.textContent =
            `場所：${item.place}`;

          event.appendChild(place);

        }


        // ---------------------------------------------
        // 詳細
        // ---------------------------------------------

        if (item.detail) {

          const detail =
            document.createElement("div");

          detail.textContent =
            `詳細：${item.detail}`;

          event.appendChild(detail);

        }


        // ---------------------------------------------
        // 種類
        // ---------------------------------------------

        const type =
          document.createElement("div");

        type.className =
          "modal-event-type";

        type.textContent =
          `種類：${item.type}`;

        event.appendChild(type);


        // ---------------------------------------------
        // モーダルに追加
        // ---------------------------------------------

        modalEvents.appendChild(event);

      });

    }


    // ==================================================
    // モーダル表示
    // ==================================================

    scheduleModal.classList.add("show");

  }


  // ======================================================
  // モーダル閉じる
  // ======================================================

  if (modalClose) {

    modalClose.addEventListener(
      "click",
      () => {

        scheduleModal.classList.remove("show");

      }
    );

  }


  // ======================================================
  // モーダル外側クリック
  // ======================================================

  if (scheduleModal) {

    scheduleModal.addEventListener(
      "click",
      (e) => {

        if (
          e.target === scheduleModal
        ) {

          scheduleModal.classList.remove(
            "show"
          );

        }

      }
    );

  }


  // ======================================================
  // ESCキー
  // ======================================================

  document.addEventListener(
    "keydown",
    (e) => {

      if (
        e.key === "Escape" &&
        scheduleModal
      ) {

        scheduleModal.classList.remove(
          "show"
        );

      }

    }
  );


  // ======================================================
  // 最初のカレンダー表示
  // ======================================================

  drawCalendar();

});