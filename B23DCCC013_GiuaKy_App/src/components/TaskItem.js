import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Badge from './Badge';
import { colors, font, priorityStyle, shadow } from '../theme/colors';
import { isOverdue } from '../utils/date';

export default function TaskItem({ task, onPress, onLongPress, onToggle }) {
  const overdue = isOverdue(task);
  const p = priorityStyle[task.priority];

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.card, task.done && styles.done, pressed && styles.pressed]}>
      {/* Checkbox tự làm bằng Pressable */}
      <Pressable onPress={onToggle} hitSlop={8} style={[styles.checkbox, task.done && styles.checked]}>
        {task.done && <Text style={styles.tick}>✓</Text>}
      </Pressable>

      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={[styles.title, task.done && styles.lineThrough]} numberOfLines={1}>
            {task.title}
          </Text>
          <Badge label={task.priority} color={p.color} bg={p.bg} />
        </View>
        <View style={styles.row}>
          <Text style={styles.sub}>🏷 {task.category}</Text>
          <Text style={[styles.sub, overdue && styles.red]}>📅 {task.dueDate}</Text>
          {overdue && <Badge label="Quá hạn" color="#fff" bg={colors.danger} />}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    marginBottom: 12,
    borderRadius: 14,
    ...shadow,
  },
  done: { opacity: 0.5 },
  pressed: { opacity: 0.7 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.disabled,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checked: { backgroundColor: colors.primary, borderColor: colors.primary },
  tick: { color: '#fff', fontWeight: 'bold' },
  info: { flex: 1, gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { flex: 1, fontSize: font.body, fontWeight: '700', color: colors.text },
  lineThrough: { textDecorationLine: 'line-through' },
  sub: { fontSize: font.small, color: colors.sub },
  red: { color: colors.danger },
});
