export default function (time24) {
  // Split the input string into hours and minutes
  const [hours, minutes] = time24.split(":").map(Number);

  // Determine AM or PM suffix
  const suffix = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  const hours12 = hours % 12 || 12; // Convert 0 (midnight) to 12

  // Return the formatted time
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}
