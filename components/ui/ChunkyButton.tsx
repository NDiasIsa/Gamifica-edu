import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { Glyph, type GlyphName } from '@/components/ui/Glyph';
import { colors, fonts, solidShadow } from '@/constants/theme';

type ChunkyButtonProps = {
  label: string;
  onPress: () => void;
  /** solid: cor sólida com sombra 3D · outline: botão secundário. */
  variant?: 'solid' | 'outline';
  color?: string;
  depthColor?: string;
  textColor?: string;
  icon?: GlyphName;
  height?: number;
  fontSize?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ChunkyButton({
  label,
  onPress,
  variant = 'solid',
  color = colors.brand.magenta,
  depthColor = colors.depth.magenta,
  textColor = colors.text.onColor,
  icon,
  height = 60,
  fontSize = 20,
  disabled,
  style,
}: ChunkyButtonProps) {
  const solid = variant === 'solid';
  const labelColor = solid ? textColor : colors.text.secondary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        { height, borderRadius: height * 0.3 },
        solid
          ? { backgroundColor: color, ...solidShadow(pressed ? 3 : 6, depthColor) }
          : styles.outline,
        pressed && (solid ? styles.pressedSolid : styles.pressedOutline),
        disabled && styles.disabled,
        style,
      ]}>
      {icon && <Glyph name={icon} size={fontSize + 2} strokeWidth={2.6} color={labelColor} />}
      <Text style={[styles.label, { fontSize, color: labelColor }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  outline: {
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface2,
  },
  pressedSolid: {
    transform: [{ translateY: 3 }],
  },
  pressedOutline: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontFamily: fonts.display,
    letterSpacing: 0.8,
  },
});
