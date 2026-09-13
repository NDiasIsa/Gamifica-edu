import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Glyph, type GlyphName } from '@/components/ui/Glyph';
import { colors, fonts, solidShadow } from '@/constants/theme';

type GradientButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** md: textos longos, como "INICIAR RODADA DE PERGUNTAS". */
  size?: 'md' | 'lg';
  /** Ícone antes do texto (no lugar do círculo de "play" à direita). */
  leadingIcon?: GlyphName;
  height?: number;
};

/** CTA principal (roxo → magenta) com sombra sólida "3D". */
export function GradientButton({ label, onPress, disabled, size = 'lg', leadingIcon, height = 62 }: GradientButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [styles.shadow, pressed && styles.pressed, disabled && styles.disabled]}>
      <LinearGradient
        colors={[colors.brand.primary, colors.brand.magenta]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.button, { height }]}>
        {leadingIcon && <Glyph name={leadingIcon} size={20} strokeWidth={2.8} color={colors.text.onColor} />}
        <Text style={[styles.label, size === 'md' && styles.labelMd]} numberOfLines={1}>
          {label}
        </Text>
        {!leadingIcon && (
          <View style={styles.playCircle}>
            <Glyph name="play" size={14} color={colors.text.onColor} />
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 18,
    ...solidShadow(6, colors.depth.primary),
  },
  pressed: {
    transform: [{ translateY: 3 }],
    ...solidShadow(3, colors.depth.primary),
  },
  disabled: {
    opacity: 0.6,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  label: {
    fontFamily: fonts.display,
    fontSize: 21,
    letterSpacing: 0.84,
    color: colors.text.onColor,
  },
  labelMd: {
    fontSize: 16,
    letterSpacing: 0.48,
  },
  playCircle: {
    width: 30,
    height: 30,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
});
