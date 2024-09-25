export function mongoDateToObject(mongoDate) {
  const date = mongoDate ? new Date(mongoDate) : new Date();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1, // Months are zero-indexed, so add 1
    monthName: monthNames[date.getMonth()],
    day: date.getDate(),
    hours: date.getHours(),
    mins: date.getMinutes(),
    secs: date.getSeconds(),
  };
}

export function mongoDateToInputValue(mongoDate) {
  const date = mongoDate ? new Date(mongoDate) : new Date();

  return `${date.getFullYear()}-${twoDigits(date.getMonth() + 1)}-${twoDigits(
    date.getDate()
  )}`;
}

function twoDigits(number) {
  return number.toString().padStart(2, "0");
}
