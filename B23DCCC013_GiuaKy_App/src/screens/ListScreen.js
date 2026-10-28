import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../context/TaskContext';
import TaskItem from '../components/TaskItem';
import AppButton from '../components/AppButton';
import { colors, font, shadow } from '../theme/colors';
import { isOverdue, parseDate, fullDate, today } from '../utils/date';
import { removeAccents } from '../utils/text';

const FILTERS = ['Tất cả', 'Chưa xong', 'Đã xong', 'Quá hạn'];
const PRIORITY_ORDER = { Cao: 0, 'Trung bình': 1, Thấp: 2 };

// Nội dung hiển thị khi danh sách rỗng, theo từng bộ lọc
const EMPTY = {
  'Tất cả': ['Chưa có công việc nào', 'Nhấn "+ Thêm việc" để tạo công việc đầu tiên.'],
  'Chưa xong': ['Không còn việc nào chưa xong', 'Tuyệt vời, bạn đã hoàn thành tất cả!'],
  'Đã xong': ['Chưa có việc nào hoàn thành', 'Đánh dấu vào ô vuông ở mỗi công việc khi bạn làm xong, nó sẽ xuất hiện ở đây.'],
  'Quá hạn': ['Không có việc quá hạn', 'Bạn đang theo kịp tiến độ.'],
};

export default function ListScreen({ navigation }) {
  const { tasks, toggleTask, deleteTask, clearDone } = useTasks();
  const [filter, setFilter] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'priority'

  const doneCount = tasks.filter(t => t.done).length;
  const percent = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  // Lọc -> tìm kiếm -> sắp xếp (chạy đồng thời)
  const data = tasks
    .filter(t => {
      if (filter === 'Chưa xong') return !t.done;
      if (filter === 'Đã xong') return t.done;
      if (filter === 'Quá hạn') return isOverdue(t);
      return true;
    })
    // Tìm gần đúng: bỏ dấu + không phân biệt hoa/thường ("hop" tìm ra "Họp nhóm")
    .filter(t => removeAccents(t.title).includes(removeAccents(search.trim())))
    .sort((a, b) =>
      sortBy === 'date'
        ? parseDate(a.dueDate) - parseDate(b.dueDate)
        : PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
    );

  const confirmDelete = task =>
    Alert.alert('Xoá công việc?', `Bạn có chắc muốn xoá "${task.title}"?`, [
      { text: 'Huỷ', style: 'cancel' },
      { text: 'Xoá', style: 'destructive', onPress: () => deleteTask(task.id) },
    ]);

  const confirmClearDone = () =>
    Alert.alert(
      'Xoá việc đã hoàn thành?',
      `Bạn sắp xoá ${doneCount} công việc đã hoàn thành. Thao tác này không thể hoàn tác.`,
      [
        { text: 'Huỷ', style: 'cancel' },
        { text: 'Xoá', style: 'destructive', onPress: clearDone },
      ],
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.date}>{fullDate(today())}</Text>
        <Text style={styles.heading}>Kế hoạch của tôi</Text>

        {/* Thẻ tiến độ + thanh tiến độ tự vẽ bằng View */}
        <View style={styles.progressCard}>
          <View style={styles.between}>
            <Text style={styles.progressText}>
              Đã hoàn thành {doneCount}/{tasks.length} công việc
            </Text>
            <Text style={styles.percent}>{percent}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>
        </View>

        <View style={styles.search}>
          <Text>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên công việc..."
            placeholderTextColor={colors.sub}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.filters}>
          {FILTERS.map(f => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={({ pressed }) => [styles.chip, filter === f && styles.chipActive, pressed && styles.pressed]}>
              <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.between}>
          <Text style={styles.count}>{data.length} công việc</Text>
          <Pressable
            onPress={() => setSortBy(sortBy === 'date' ? 'priority' : 'date')}
            style={({ pressed }) => [styles.sortBtn, pressed && styles.pressed]}>
            <Text style={styles.sortText}>
              ⇅ {sortBy === 'date' ? 'Theo hạn gần nhất' : 'Theo ưu tiên'}
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPress={() => navigation.navigate('Detail', { id: item.id })}
            onLongPress={() => confirmDelete(item)}
            onToggle={() => toggleTask(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>
              {search ? 'Không tìm thấy công việc' : EMPTY[filter][0]}
            </Text>
            <Text style={styles.emptyText}>
              {search ? 'Thử tìm với từ khoá khác.' : EMPTY[filter][1]}
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      {/* Thanh nút dưới cùng */}
      <View style={styles.bottomBar}>
        <AppButton title="🗑  Xoá việc đã xong" outline color={colors.danger}
          disabled={doneCount === 0} onPress={confirmClearDone} style={styles.flex} />
        <AppButton title="+  Thêm việc" onPress={() => navigation.navigate('Form')}
          style={styles.flex} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  top: { paddingHorizontal: 16, paddingTop: 16 },
  date: { fontSize: font.small, color: colors.sub },
  heading: { fontSize: font.big, fontWeight: '800', color: colors.text, marginBottom: 16 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  progressCard: { backgroundColor: colors.primary, borderRadius: 16, padding: 16, marginBottom: 16, ...shadow },
  progressText: { color: '#fff', fontSize: font.body, fontWeight: '600' },
  percent: { color: '#fff', fontSize: font.title, fontWeight: '800' },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#fff' },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  searchInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 10, fontSize: font.body, color: colors.text },

  filters: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: font.small, color: colors.sub, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  pressed: { opacity: 0.6 },

  count: { fontSize: font.small, color: colors.sub },
  sortBtn: { backgroundColor: colors.primaryLight, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  sortText: { color: colors.primary, fontSize: font.small, fontWeight: '700' },

  list: { padding: 16, flexGrow: 1 },
  empty: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
  emptyIcon: { fontSize: 40, backgroundColor: colors.primaryLight, padding: 20, borderRadius: 24, overflow: 'hidden' },
  emptyTitle: { fontSize: font.body + 2, fontWeight: '700', color: colors.text, marginTop: 16 },
  emptyText: { fontSize: font.small, color: colors.sub, textAlign: 'center', marginTop: 8, lineHeight: 20 },

  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  flex: { flex: 1 },
});
