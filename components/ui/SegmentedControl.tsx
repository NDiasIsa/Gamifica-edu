import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, solidShadow } from '@/constants/theme';

export type SegmentOption<T> = {
  value: T;
  label: string;
  disabled?: boolean;
  /** Ícone antes do texto; recebe se a opção está ativa. */
  renderIcon?: (active: boolean) => ReactNode;
};

type SegmentedControlProps<T> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** surface: fundo da tela · base: dentro de painéis/bottom sheets. */
  variant?: 'surface' | 'base';
  height?: number;
  font?: 'nunito' | 'display';
  fontSize?: number;
  activeColor?: string;
  activeDepthColor?: string;
  activeTextColor?: string;
};

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  variant = 'surface',
  height = 44,
  font = 'nunito',
  fontSize = 15,
  activeColor = colors.brand.primary,
  activeDepthColor = colors.depth.primary,
  activeTextColor = colors.text.onColor,
}: SegmentedControlProps<T>) {
  return (
    <View style={[styles.track, variant === 'base' && styles.trackBase]} accessibilityRole="tablist">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            onPress={() => onChange(option.value)}
            disabled={option.disabled}
            accessibilityRole="tab"
            accessibilityState={{ selected: active, disabled: option.disabled }}
            style={[
              styles.item,
              { height },
              active && { backgroundColor: activeColor, ...solidShadow(4, activeDepthColor) },
              option.disabled && styles.disabled,
            ]}>
            {option.renderIcon?.(active)}
            <Text
              style={[
                font === 'display' ? styles.labelDisplay : active ? styles.labelActive : styles.label,
                { fontSize, color: active ? activeTextColor : colors.text.secondary },
              ]}
              numberOfLines={1}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  trackBase: {
    backgroundColor: colors.bg.base,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 12,
  },
  disabled: {
    opacity: 0.35,
  },
  label: {
    fontFamily: fonts.extraBold,
  },
  labelActive: {
    fontFamily: fonts.black,
  },
  labelDisplay: {
    fontFamily: fonts.display,
  },
});
