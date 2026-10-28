import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, font } from '../theme/colors';

// Nút dùng chung: outline = nền trắng viền màu; mờ khi nhấn; xám khi bị vô hiệu hoá
export default function AppButton({ title, onPress, disabled, outline, color = colors.primary, style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        { borderColor: color, backgroundColor: outline ? colors.card : color },
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      <Text style={[styles.text, { color: outline ? color : '#fff' }, disabled && styles.disabledText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  text: { fontSize: font.body, fontWeight: '700' },
  pressed: { opacity: 0.6 },
  disabled: { backgroundColor: colors.bg, borderColor: colors.disabled },
  disabledText: { color: colors.sub },
});
