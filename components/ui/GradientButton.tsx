import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { colors, fonts, solidShadow } from '@/constants/theme';

type GradientButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** md: textos longos, como "INICIAR RODADA DE PERGUNTAS". */
  size?: 'md' | 'lg';
};

/** CTA principal (roxo → magenta) com sombra sólida "3D". */
export function GradientButton({ label, onPress, disabled, size = 'lg' }: GradientButtonProps) {
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
        style={styles.button}>
        <Text style={[styles.label, size === 'md' && styles.labelMd]} numberOfLines={1}>
          {label}
        </Text>
        <View style={styles.playCircle}>
          <Icon name="play" size={14} />
        </View>
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
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
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
