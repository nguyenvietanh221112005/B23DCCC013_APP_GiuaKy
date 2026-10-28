// Bảng màu, cỡ chữ, đổ bóng dùng chung cho toàn app
export const colors = {
  primary: '#7C5A45', // Nâu Mocha
  primaryLight: '#F3EAE3',
  bg: '#F8F4EF', // nền kem như giấy
  card: '#FFFFFF',
  text: '#2B211B',
  sub: '#8A7B70',
  border: '#E8DFD6',
  danger: '#DC2626',
  dangerLight: '#FDE2E2',
  success: '#16A34A',
  successLight: '#DCFCE7',
  disabled: '#D1D5DB',
};

export const font = { big: 26, title: 20, body: 15, small: 13 };

// Màu nhãn ưu tiên: chữ đậm trên nền nhạt
export const priorityStyle = {
  Cao: { color: '#DC2626', bg: '#FDE2E2' },
  'Trung bình': { color: '#B45309', bg: '#FEF3C7' },
  Thấp: { color: '#16A34A', bg: '#DCFCE7' },
};

export const shadow = {
  elevation: 2,
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
};

export const CATEGORIES = ['Học tập', 'Công việc', 'Sức khoẻ', 'Cá nhân'];
export const PRIORITIES = ['Cao', 'Trung bình', 'Thấp'];
