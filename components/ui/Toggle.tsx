import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

type ToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  accessibilityLabel: string;
};

/** Interruptor 44×26 dos designs do professor. */
export function Toggle({ value, onChange, accessibilityLabel }: ToggleProps) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={[styles.track, value ? styles.trackOn : styles.trackOff]}>
      <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    padding: 3,
    borderRadius: 99,
  },
  trackOn: {
    alignItems: 'flex-end',
    backgroundColor: colors.brand.primary,
  },
  trackOff: {
    alignItems: 'flex-start',
    backgroundColor: colors.bg.border,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 99,
  },
  thumbOn: {
    backgroundColor: colors.text.onColor,
  },
  thumbOff: {
    backgroundColor: colors.text.secondary,
  },
});
