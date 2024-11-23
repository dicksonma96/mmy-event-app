export default function downloadCSV(data, filename = "data.csv") {
  if (!data || !data.length) {
    console.error("No data available to download.");
    return;
  }

  // Extract keys for CSV header
  const keys = Object.keys(data[0]);
  const csvContent = [
    keys.join(","), // Header row
    ...data.map((row) =>
      keys
        .map(
          (key) => JSON.stringify(row[key] || "") // Escape values
        )
        .join(",")
    ),
  ].join("\n");

  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link to trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  // Append the link, trigger click, and remove the link
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke the Blob URL
  URL.revokeObjectURL(url);
}
