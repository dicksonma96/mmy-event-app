export default function (epoch) {
  const dateObj = new Date(epoch); // Create a Date object from the epoch timestamp

  const date = dateObj.toLocaleDateString(); // Format the date as a string
  const time = dateObj.toLocaleTimeString(); // Format the time as a string

  return { date, time };
}
