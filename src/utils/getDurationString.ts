// Returns a string like "2 years and 1 month" for the duration between start and end.
// Accepts "Aug 2024", "Sept 2021", "Present", etc.
export function getDurationString(start: string, end: string): string {
  const parseDate = (str: string): Date => {
    if (str.toLowerCase() === "present") return new Date(Date.now());
    const [monthStr, yearStr] = str.split(" ");
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    let monthIdx = months.findIndex(
      (m) => m === monthStr.toLowerCase().slice(0, 3)
    );
    if (monthIdx === -1) monthIdx = 0;
    return new Date(Number(yearStr), monthIdx, 1);
  };

  const startDate = parseDate(start);
  const endDate = parseDate(end);

  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const yearStr = years > 0 ? `${years} year${years > 1 ? "s" : ""}` : "";
  const monthStr = months > 0 ? `${months} month${months > 1 ? "s" : ""}` : "";

  if (yearStr && monthStr) return `${yearStr} and ${monthStr}`;
  if (yearStr) return yearStr;
  if (monthStr) return monthStr;
  return "Less than a month";
}
