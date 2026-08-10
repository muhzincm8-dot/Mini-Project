/**
 * Downloads an array of transaction objects as a CSV file.
 *
 * @param {Array} transactions - Array of transaction objects with date, description, category, type, amount
 * @param {string} [filenamePrefix="transactions"] - Prefix for the downloaded filename
 */
export function downloadTransactionsCSV(transactions, filenamePrefix = "transactions") {
  const headers = ["Date", "Description", "Category", "Type", "Amount"];
  const csvContent = [
    headers.join(","),
    ...transactions.map((t) =>
      [
        t.date,
        `"${(t.description || "").replace(/"/g, '""')}"`,
        t.category,
        t.type,
        t.amount,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filenamePrefix}_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
