import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';

type SectionLabelProps = {
  label: string;
  /** Texto de apoio alinhado à direita. */
  hint?: string;
};

export function SectionLabel({ label, hint }: SectionLabelProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {hint && (
        <Text style={styles.hint} numberOfLines={1}>
          {hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  label: {
    fontFamily: fonts.black,
    fontSize: 11,
    letterSpacing: 1.1,
    color: colors.brand.primaryLight,
  },
  hint: {
    flexShrink: 1,
    fontFamily: fonts.extraBold,
    fontSize: 11,
    color: colors.text.secondary,
  },
});
