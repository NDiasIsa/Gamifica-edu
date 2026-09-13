import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Glyph } from '@/components/ui/Glyph';
import { colors, fonts } from '@/constants/theme';

type StepperProps = {
  value: number;
  onChange: (value: number) => void;
  step: number;
  min: number;
  max: number;
  /** Texto exibido no lugar do número (ex.: "8,5", "Grátis"). */
  format?: (value: number) => string;
  suffix?: string;
  accessibilityLabel: string;
};

/** Botões − e + em volta de um valor grande (nota, preço, nível). */
export function Stepper({ value, onChange, step, min, max, format, suffix, accessibilityLabel }: StepperProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, Math.round(next * 100) / 100));

  return (
    <View style={styles.row} accessibilityLabel={`${accessibilityLabel}: ${format ? format(value) : value}`}>
      <StepButton
        icon="minus"
        disabled={value <= min}
        label={`Diminuir ${accessibilityLabel}`}
        onPress={() => onChange(clamp(value - step))}
      />
      <View style={styles.valueBox}>
        <Text style={styles.value}>{format ? format(value) : value}</Text>
        {suffix && <Text style={styles.suffix}>{suffix}</Text>}
      </View>
      <StepButton
        icon="plus"
        disabled={value >= max}
        label={`Aumentar ${accessibilityLabel}`}
        onPress={() => onChange(clamp(value + step))}
      />
    </View>
  );
}

function StepButton({
  icon,
  disabled,
  label,
  onPress,
}: {
  icon: 'minus' | 'plus';
  disabled: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}>
      <Glyph name={icon} size={18} strokeWidth={3} color={colors.text.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.35,
  },
  valueBox: {
    minWidth: 56,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 2,
  },
  value: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.text.primary,
  },
  suffix: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
    color: colors.text.secondary,
  },
});
