// Bỏ dấu tiếng Việt + chữ thường: "Họp nhóm Đồ án" -> "hop nhom do an"
// normalize('NFD') tách chữ và dấu ("ọ" -> "o" + dấu), rồi xoá các ký tự dấu
export function removeAccents(str) {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}
