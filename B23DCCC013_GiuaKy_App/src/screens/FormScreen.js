import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '../context/TaskContext';
import AppButton from '../components/AppButton';
import { colors, font, priorityStyle, CATEGORIES, PRIORITIES } from '../theme/colors';
import { parseDate, today, maskDate } from '../utils/date';

// Nút chọn (danh mục / ưu tiên): khi được chọn thì nền nhạt + viền màu
function Option({ label, active, onPress, color = colors.primary, bg = colors.primaryLight, dot, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        active && { backgroundColor: bg, borderColor: color },
        pressed && styles.pressed,
        style,
      ]}>
      <Text style={[styles.optionText, active && { color }]}>
        {dot && <Text style={{ color }}>● </Text>}
        {label}
      </Text>
    </Pressable>
  );
}

// Dùng chung cho Thêm và Sửa: có route.params.id => đang sửa
export default function FormScreen({ route, navigation }) {
  const { tasks, addTask, updateTask } = useTasks();
  const id = route.params?.id;
  const old = tasks.find(t => t.id === id);

  const [title, setTitle] = useState(old?.title ?? '');
  const [note, setNote] = useState(old?.note ?? '');
  const [category, setCategory] = useState(old?.category ?? CATEGORIES[0]);
  const [priority, setPriority] = useState(old?.priority ?? PRIORITIES[1]);
  const [dueDate, setDueDate] = useState(old?.dueDate ?? '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = 'Vui lòng nhập tên công việc';
    else if (title.trim().length > 50) e.title = 'Tên công việc tối đa 50 ký tự';

    const date = parseDate(dueDate);
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dueDate)) e.dueDate = 'Vui lòng nhập đúng định dạng dd/mm/yyyy';
    else if (!date) e.dueDate = 'Ngày không tồn tại, vui lòng kiểm tra lại';
    else if (!id && date < today()) e.dueDate = 'Hạn không được trước ngày hôm nay';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    const data = { title: title.trim(), note, category, priority, dueDate };
    id ? updateTask(id, data) : addTask(data);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.flex} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.labelRow}>
            <Text style={styles.label}>Tên công việc <Text style={styles.red}>*</Text></Text>
            <Text style={styles.counter}>{title.length}/50</Text>
          </View>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            value={title}
            onChangeText={setTitle}
            placeholder="VD: Ôn tập chương 3"
            placeholderTextColor={colors.sub}
          />
          {errors.title && <Text style={styles.error}>{errors.title}</Text>}

          <Text style={styles.label}>Ghi chú</Text>
          <TextInput
            style={[styles.input, styles.note]}
            value={note}
            onChangeText={setNote}
            placeholder="Thêm mô tả (không bắt buộc)"
            placeholderTextColor={colors.sub}
            multiline
          />

          <Text style={styles.label}>Danh mục</Text>
          <View style={styles.grid}>
            {CATEGORIES.map(c => (
              <Option key={c} label={c} active={category === c} onPress={() => setCategory(c)}
                style={styles.half} />
            ))}
          </View>

          <Text style={styles.label}>Mức ưu tiên</Text>
          <View style={styles.grid}>
            {PRIORITIES.map(p => (
              <Option key={p} label={p} dot active={priority === p} onPress={() => setPriority(p)}
                color={priorityStyle[p].color} bg={priorityStyle[p].bg} style={styles.flex1} />
            ))}
          </View>

          <Text style={styles.label}>Hạn hoàn thành <Text style={styles.red}>*</Text></Text>
          <View style={[styles.input, styles.dateRow, errors.dueDate && styles.inputError]}>
            <Text>📅</Text>
            <TextInput
              style={styles.dateInput}
              value={dueDate}
              onChangeText={t => setDueDate(maskDate(t))}
              placeholder="dd/mm/yyyy"
              placeholderTextColor={colors.sub}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
          {errors.dueDate && <Text style={styles.error}>{errors.dueDate}</Text>}
        </ScrollView>

        <View style={styles.bottomBar}>
          <AppButton title={id ? 'Cập nhật' : 'Lưu công việc'} onPress={save} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 16 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  label: { fontSize: font.body, fontWeight: '700', color: colors.text, marginTop: 16, marginBottom: 8 },
  red: { color: colors.danger },
  counter: { fontSize: font.small, color: colors.sub, marginBottom: 8 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: font.body,
    color: colors.text,
  },
  note: { height: 100, textAlignVertical: 'top' },
  inputError: { borderColor: colors.danger, backgroundColor: '#FFF5F5' },
  error: { color: colors.danger, fontSize: font.small, marginTop: 6 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  half: { width: '48.5%' },
  flex1: { flex: 1 },
  option: {
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  optionText: { fontSize: font.body, fontWeight: '600', color: colors.text },
  pressed: { opacity: 0.6 },

  dateRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 0 },
  dateInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 10, fontSize: font.body, color: colors.text },

  bottomBar: { padding: 16, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border },
});
