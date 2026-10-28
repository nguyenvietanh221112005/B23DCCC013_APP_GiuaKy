import React from 'react';
import { Text, StyleSheet } from 'react-native';

// Nhãn nhỏ bo tròn (ưu tiên, danh mục, "Quá hạn")
export default function Badge({ label, color, bg }) {
  return <Text style={[styles.badge, { color, backgroundColor: bg }]}>{label}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
