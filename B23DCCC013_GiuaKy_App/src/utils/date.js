// "dd/mm/yyyy" -> Date, trả null nếu sai định dạng hoặc ngày không có thật
export function parseDate(str) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(str);
  if (!m) return null;
  const d = +m[1], mo = +m[2], y = +m[3];
  const date = new Date(y, mo - 1, d);
  // 31/02 sẽ bị JS tự đẩy sang 03/03 -> so lại để phát hiện ngày không có thật
  if (date.getDate() !== d || date.getMonth() !== mo - 1) return null;
  return date;
}

export function formatDate(date) {
  const p = n => String(n).padStart(2, '0');
  return `${p(date.getDate())}/${p(date.getMonth() + 1)}/${date.getFullYear()}`;
}

// Date -> "Thứ Tư, 28/10/2026"
const DAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
export function fullDate(date) {
  return `${DAYS[date.getDay()]}, ${formatDate(date)}`;
}

export function today() {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

// Số ngày còn lại tính từ hôm nay (âm = đã quá hạn)
export function daysLeft(str) {
  return Math.round((parseDate(str) - today()) / 86400000);
}

export function isOverdue(task) {
  return !task.done && daysLeft(task.dueDate) < 0;
}

// Tự chèn dấu "/" khi gõ số: 12032026 -> 12/03/2026
export function maskDate(text) {
  const d = text.replace(/\D/g, '').slice(0, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4)].filter(Boolean).join('/');
}
