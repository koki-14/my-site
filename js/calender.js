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

if(schedules[date]){

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