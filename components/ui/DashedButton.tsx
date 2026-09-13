import { Pressable, StyleSheet, Text } from 'react-native';

import { Glyph } from '@/components/ui/Glyph';
import { colors, fonts } from '@/constants/theme';

type DashedButtonProps = {
  label: string;
  hint?: string;
  onPress: () => void;
};

/** Botão tracejado "+ Adicionar…" usado nas listas do professor. */
export function DashedButton({ label, hint, onPress }: DashedButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Glyph name="plus" size={18} strokeWidth={3} color={colors.brand.primaryLight} />
      <Text style={styles.label}>{label}</Text>
      {hint && (
        <Text style={styles.hint} numberOfLines={1}>
          {hint}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.bg.border,
  },
  pressed: {
    backgroundColor: colors.bg.surface,
  },
  label: {
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.brand.primaryLight,
  },
  hint: {
    flexShrink: 1,
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
});
