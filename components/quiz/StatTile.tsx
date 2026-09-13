import { StyleSheet, Text, View } from 'react-native';

import { Glyph, type GlyphName } from '@/components/ui/Glyph';
import { colors, fonts } from '@/constants/theme';

type StatTileProps = {
  icon: GlyphName;
  color: string;
  value: string;
  label: string;
};

export function StatTile({ icon, color, value, label }: StatTileProps) {
  return (
    <View style={styles.tile}>
      <View style={styles.valueRow}>
        <Glyph name={icon} size={18} strokeWidth={2.8} color={color} />
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  value: {
    fontFamily: fonts.display,
    fontSize: 26,
  },
  label: {
    fontFamily: fonts.extraBold,
    fontSize: 11,
    color: colors.text.secondary,
  },
});
