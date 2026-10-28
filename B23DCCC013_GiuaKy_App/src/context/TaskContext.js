import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDate, today } from '../utils/date';

const KEY = 'TASKS';
const TaskContext = createContext();

// Ngày cách hôm nay n ngày (để dữ liệu mẫu luôn có việc quá hạn)
const addDays = n => {
  const d = today();
  d.setDate(d.getDate() + n);
  return formatDate(d);
};

const sampleTasks = () => [
  { id: '1', title: 'Nộp báo cáo thực tập', note: '', category: 'Công việc', priority: 'Cao', dueDate: addDays(-3), done: false },
  { id: '2', title: 'Chạy bộ 3km quanh hồ', note: '', category: 'Sức khoẻ', priority: 'Thấp', dueDate: addDays(0), done: false },
  { id: '3', title: 'Ôn tập giữa kỳ Cấu trúc dữ liệu', note: 'Ôn chương 1-4: danh sách liên kết, ngăn xếp, hàng đợi, cây nhị phân.', category: 'Học tập', priority: 'Cao', dueDate: addDays(2), done: false },
  { id: '4', title: 'Làm bài tập React Native', note: 'Làm màn hình danh sách và form, nộp trên LMS trước 23:59.', category: 'Học tập', priority: 'Trung bình', dueDate: addDays(5), done: false },
  { id: '5', title: 'Họp nhóm đồ án', note: 'Phòng 302', category: 'Công việc', priority: 'Trung bình', dueDate: addDays(-2), done: true },
  { id: '6', title: 'Mua quà sinh nhật mẹ', note: '', category: 'Cá nhân', priority: 'Thấp', dueDate: addDays(-1), done: true },
  { id: '7', title: 'Đi khám răng định kỳ', note: '', category: 'Sức khoẻ', priority: 'Trung bình', dueDate: addDays(7), done: false },
  { id: '8', title: 'Dọn dẹp phòng trọ', note: '', category: 'Cá nhân', priority: 'Thấp', dueDate: addDays(10), done: false },
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Đọc dữ liệu khi mở app; lần đầu chưa có thì dùng dữ liệu mẫu
  useEffect(() => {
    AsyncStorage.getItem(KEY).then(json => {
      setTasks(json ? JSON.parse(json) : sampleTasks());
      setLoaded(true);
    });
  }, []);

  // Mỗi lần tasks thay đổi thì lưu lại
  useEffect(() => {
    if (loaded) AsyncStorage.setItem(KEY, JSON.stringify(tasks));
  }, [tasks, loaded]);

  const addTask = task =>
    setTasks(prev => [...prev, { ...task, id: Date.now().toString(), done: false }]);
  const updateTask = (id, data) =>
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
  const toggleTask = id =>
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  const deleteTask = id => setTasks(prev => prev.filter(t => t.id !== id));
  const clearDone = () => setTasks(prev => prev.filter(t => !t.done));

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, updateTask, toggleTask, deleteTask, clearDone }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
