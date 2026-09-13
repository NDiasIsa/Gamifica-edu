import { Pressable, StyleSheet, View } from 'react-native';

import { Glyph, type GlyphName } from '@/components/ui/Glyph';
import { colors, solidShadow } from '@/constants/theme';

type IconButtonProps = {
  icon: GlyphName;
  onPress: () => void;
  accessibilityLabel: string;
  /** primary: roxo com sombra 3D · ghost: fundo surface2 com borda. */
  variant?: 'primary' | 'ghost';
  size?: number;
  /** Bolinha magenta de novidade. */
  dot?: boolean;
};

export function IconButton({ icon, onPress, accessibilityLabel, variant = 'ghost', size = 44, dot }: IconButtonProps) {
  const primary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.button,
        { width: size, height: size, borderRadius: size * 0.32 },
        primary ? styles.primary : styles.ghost,
        pressed && (primary ? styles.pressedPrimary : styles.pressedGhost),
      ]}>
      <Glyph
        name={icon}
        size={primary ? 24 : 22}
        strokeWidth={primary ? 3.2 : 2.4}
        color={colors.text.primary}
      />
      {dot && <View style={styles.dot} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.brand.primary,
    ...solidShadow(4, colors.depth.primary),
  },
  ghost: {
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface2,
  },
  pressedPrimary: {
    transform: [{ translateY: 2 }],
  },
  pressedGhost: {
    opacity: 0.7,
  },
  dot: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 9,
    height: 9,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: colors.bg.surface2,
    backgroundColor: colors.brand.magenta,
  },
});
