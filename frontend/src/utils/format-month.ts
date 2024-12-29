export function formatMonth(date: any) {
  const d = new Date(date),
    month = "" + (d.getMonth() + 1),
    year = d.getFullYear();

  return [year, month.padStart(2, "0")].join("-");
}
