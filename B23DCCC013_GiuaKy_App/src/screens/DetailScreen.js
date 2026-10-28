import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../context/TaskContext';
import AppButton from '../components/AppButton';
import Badge from '../components/Badge';
import { colors, font, priorityStyle, shadow } from '../theme/colors';
import { daysLeft, isOverdue, parseDate, fullDate } from '../utils/date';

// Một dòng thông tin: nhãn bên trái, giá trị bên phải
function InfoRow({ label, value, color }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, color && { color }]}>{value}</Text>
    </View>
  );
}

export default function DetailScreen({ route, navigation }) {
  const { tasks, toggleTask } = useTasks();
  const task = tasks.find(t => t.id === route.params.id);
  if (!task) return null; // phòng trường hợp việc đã bị xoá

  const overdue = isOverdue(task);
  const p = priorityStyle[task.priority];

  // Hộp đếm ngày: xanh dương (còn hạn), đỏ (quá hạn), xanh lá (đã xong)
  const n = daysLeft(task.dueDate);
  let text = n > 0 ? `Còn ${n} ngày` : n === 0 ? 'Hạn hôm nay' : `Quá hạn ${-n} ngày`;
  let color = overdue ? colors.danger : colors.primary;
  let bg = overdue ? colors.dangerLight : colors.primaryLight;
  let icon = overdue ? '!' : '⏰';
  if (task.done) {
    text = 'Đã hoàn thành';
    color = colors.success;
    bg = colors.successLight;
    icon = '✓';
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.badges}>
            <Badge label={task.priority} color={p.color} bg={p.bg} />
            <Badge label={task.category} color={colors.primary} bg={colors.primaryLight} />
            {overdue && <Badge label="Quá hạn" color="#fff" bg={colors.danger} />}
          </View>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={[styles.status, task.done && { color: colors.success }]}>
            ● {task.done ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
          </Text>
        </View>

        <View style={[styles.countdown, { backgroundColor: bg }]}>
          <Text style={[styles.icon, { backgroundColor: color }]}>{icon}</Text>
          <View>
            <Text style={[styles.countText, { color }]}>{text}</Text>
            <Text style={styles.sub}>Hạn: {fullDate(parseDate(task.dueDate))}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <InfoRow label="Danh mục" value={task.category} />
          <InfoRow label="Mức ưu tiên" value={task.priority} color={p.color} />
          <InfoRow label="Hạn hoàn thành" value={task.dueDate} color={overdue ? colors.danger : undefined} />
          <InfoRow label="Trạng thái" value={task.done ? 'Đã hoàn thành' : 'Chưa hoàn thành'} />
        </View>

        <View style={styles.card}>
          <Text style={styles.noteLabel}>Ghi chú</Text>
          {task.note ? (
            <Text style={styles.note}>{task.note}</Text>
          ) : (
            <Text style={styles.noNote}>Không có ghi chú</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <AppButton title="✎  Sửa" outline color={colors.text}
          onPress={() => navigation.navigate('Form', { id: task.id })} style={styles.editBtn} />
        <AppButton
          title={task.done ? '↺  Chưa hoàn thành' : '✓  Đánh dấu hoàn thành'}
          color={task.done ? colors.sub : colors.primary}
          onPress={() => toggleTask(task.id)}
          style={styles.flex}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 14, ...shadow },
  badges: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  title: { fontSize: font.title + 2, fontWeight: '800', color: colors.text },
  status: { fontSize: font.small, color: colors.sub, marginTop: 8 },

  countdown: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, padding: 16, marginBottom: 14 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 48,
  },
  countText: { fontSize: font.title, fontWeight: '800' },
  sub: { fontSize: font.small, color: colors.sub, marginTop: 2 },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  infoLabel: { fontSize: font.body, color: colors.sub },
  infoValue: { fontSize: font.body, fontWeight: '700', color: colors.text },

  noteLabel: { fontSize: font.small, fontWeight: '700', color: colors.sub, marginBottom: 6 },
  note: { fontSize: font.body, color: colors.text, lineHeight: 22 },
  noNote: { fontSize: font.body, color: colors.sub, fontStyle: 'italic' },

  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  editBtn: { flex: 1, borderColor: colors.border },
  flex: { flex: 2 },
});
