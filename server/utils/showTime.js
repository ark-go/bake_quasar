function showTime(long, date) {
  var monthsArr = [
    "",
    "Января",
    "Февраля",
    "Марта",
    "Апреля",
    "Мая",
    "Июня",
    "Июля",
    "Августа",
    "Сентября",
    "Октября",
    "Ноября",
    "Декабря",
  ];

  var daysArr = [
    "",
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];

  // var dateObj = new Date();
  var dateObj = date || new Date();

  var year = dateObj.getFullYear();
  var month = dateObj.getMonth() + 1;
  var numDay = dateObj.getDate();
  var day = dateObj.getDay() + 1;
  var hour = dateObj.getHours();
  var minute = dateObj.getMinutes();
  var second = dateObj.getSeconds();

  if (hour < 10) hour = "0" + hour;

  if (minute < 10) minute = "0" + minute;
  if (second < 10) second = "0" + second;

  if (numDay < 10) numDay = "0" + numDay;
  if (month < 10) month = "0" + month;

  //var out = daysArr[day] + ", " + numDay + " " + monthsArr[month]
  //        + " " + year + ", " + hour + ":" + minute + ":" + second;
  var out = "";
  if (long === true) {
    out =
      daysArr[day] +
      ", " +
      numDay +
      " " +
      monthsArr[month] +
      " " +
      year +
      ", " +
      hour +
      ":" +
      minute +
      ":" +
      second;
  } else {
    out =
      numDay +
      "." +
      month +
      "." +
      year +
      " " +
      hour +
      ":" +
      minute +
      ":" +
      second;
    //out = month +"--"+monthsArr[month];
  }

  return out;
}
export { showTime };
