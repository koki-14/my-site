// =========================================
// holiday.js
// 日本の祝日自動生成
// Part 1
// =========================================


// -----------------------------------------
// YYYY-MM-DDへ変換
// -----------------------------------------
function formatDate(date){

    const y = date.getFullYear();

    const m =
        String(date.getMonth()+1)
        .padStart(2,"0");

    const d =
        String(date.getDate())
        .padStart(2,"0");

    return `${y}-${m}-${d}`;

}


// -----------------------------------------
// 第○曜日を取得
//
// month
// 0=1月
// 1=2月
//
// week
// 第1=1
// 第2=2
//
// day
// 日=0
// 月=1
// ...
// 土=6
// -----------------------------------------
function nthWeekday(year,month,week,day){

    const date =
        new Date(year,month,1);

    while(date.getDay()!=day){

        date.setDate(date.getDate()+1);

    }

    date.setDate(
        date.getDate()+(week-1)*7
    );

    return date;

}


// -----------------------------------------
// 春分の日
//
// 国立天文台の近似式
// 1980～2099
// -----------------------------------------
function springEquinox(year){

    return Math.floor(
        20.8431+
        0.242194*
        (year-1980)
        -
        Math.floor(
            (year-1980)/4
        )
    );

}


// -----------------------------------------
// 秋分の日
// -----------------------------------------
function autumnEquinox(year){

    return Math.floor(
        23.2488+
        0.242194*
        (year-1980)
        -
        Math.floor(
            (year-1980)/4
        )
    );

}


// -----------------------------------------
// 祝日保存用
// -----------------------------------------
function addHoliday(list,date,name){

    list[formatDate(date)] = name;

}
// =========================================
// 基本祝日を生成
// =========================================

function createHolidayList(year){

    const holidays = {};

    // -------------------------
    // 1月
    // -------------------------

    // 元日
    addHoliday(
        holidays,
        new Date(year,0,1),
        "元日"
    );

    // 成人の日（第2月曜日）
    addHoliday(
        holidays,
        nthWeekday(year,0,2,1),
        "成人の日"
    );

    // -------------------------
    // 2月
    // -------------------------

    // 建国記念の日
    addHoliday(
        holidays,
        new Date(year,1,11),
        "建国記念の日"
    );

    // 天皇誕生日
    if(year >= 2020){

        addHoliday(
            holidays,
            new Date(year,1,23),
            "天皇誕生日"
        );

    }

    // -------------------------
    // 3月
    // -------------------------

    // 春分の日
    addHoliday(
        holidays,
        new Date(
            year,
            2,
            springEquinox(year)
        ),
        "春分の日"
    );

    // -------------------------
    // 4月
    // -------------------------

    addHoliday(
        holidays,
        new Date(year,3,29),
        "昭和の日"
    );

    // -------------------------
    // 5月
    // -------------------------

    addHoliday(
        holidays,
        new Date(year,4,3),
        "憲法記念日"
    );

    addHoliday(
        holidays,
        new Date(year,4,4),
        "みどりの日"
    );

    addHoliday(
        holidays,
        new Date(year,4,5),
        "こどもの日"
    );

    // -------------------------
    // 7月
    // -------------------------

    addHoliday(
        holidays,
        nthWeekday(year,6,3,1),
        "海の日"
    );

    // -------------------------
    // 8月
    // -------------------------

    addHoliday(
        holidays,
        new Date(year,7,11),
        "山の日"
    );

    // -------------------------
    // 9月
    // -------------------------

    addHoliday(
        holidays,
        nthWeekday(year,8,3,1),
        "敬老の日"
    );

    addHoliday(
        holidays,
        new Date(
            year,
            8,
            autumnEquinox(year)
        ),
        "秋分の日"
    );

    // -------------------------
    // 10月
    // -------------------------

    addHoliday(
        holidays,
        nthWeekday(year,9,2,1),
        "スポーツの日"
    );

    // -------------------------
    // 11月
    // -------------------------

    addHoliday(
        holidays,
        new Date(year,10,3),
        "文化の日"
    );

    addHoliday(
        holidays,
        new Date(year,10,23),
        "勤労感謝の日"
    );

    // -------------------------
    // 振替休日
    // -------------------------

    const holidayDates = Object.keys(holidays);

    holidayDates.forEach(dateStr => {

        const holidayDate = new Date(dateStr);

        // 日曜日なら翌日へ
        if (holidayDate.getDay() === 0) {

            const substitute = new Date(holidayDate);

            substitute.setDate(substitute.getDate() + 1);

            // 次の日も祝日ならさらに翌日へ
            while (holidays[formatDate(substitute)]) {

                substitute.setDate(
                    substitute.getDate() + 1
                );

            }

            holidays[
                formatDate(substitute)
            ] = "振替休日";

        }

    });


    // -------------------------
    // 国民の休日
    // （祝日に挟まれた平日）
    // -------------------------

    const start = new Date(year,0,2);
    const end   = new Date(year,11,30);

    for(
        let date = new Date(start);
        date <= end;
        date.setDate(date.getDate()+1)
    ){

        const current =
            formatDate(date);

        // 既に祝日ならスキップ
        if(holidays[current]) continue;

        // 土日ならスキップ
        if(
            date.getDay()===0 ||
            date.getDay()===6
        ){
            continue;
        }

        const before = new Date(date);
        before.setDate(before.getDate()-1);

        const after = new Date(date);
        after.setDate(after.getDate()+1);

        if(

            holidays[formatDate(before)] &&
            holidays[formatDate(after)]

        ){

            holidays[current]="国民の休日";

        }

    }

    return holidays;

}

