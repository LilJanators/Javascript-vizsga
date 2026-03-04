export function pad2(n){
  return String(n).padStart(2, "0");
}

export function toDateInputValue(date){
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}-${month}-${day}`;
}

export function formatHuDateTime(dateTime){
  const year = dateTime.getFullYear();
  const month = pad2(dateTime.getMonth() + 1);
  const day = pad2(dateTime.getDate());
  const hours = pad2(dateTime.getHours());
  const minutes = pad2(dateTime.getMinutes());
  return `${year}. ${month}. ${day}. ${hours}:${minutes}`;
}

export function initials(name){
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return (first + second).toUpperCase();
}
