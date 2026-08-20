function pad(n) {
  return String(n).padStart(2, "0");
}

function toISO(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export function generateSampleRoster() {
  return [];
}
