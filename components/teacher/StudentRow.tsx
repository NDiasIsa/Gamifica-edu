import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Glyph } from '@/components/ui/Glyph';
import { PixelAvatar } from '@/components/ui/PixelAvatar';
import { colors, fonts } from '@/constants/theme';
import type { AvatarPalette } from '@/types/game';

type StudentRowProps = {
  name: string;
  avatar: AvatarPalette;
  subtitle: string;
  subtitleColor?: string;
  /** Rótulo à direita com bolinha (ex.: último acesso). */
  status?: { label: string; color: string };
  onPress: () => void;
};

export function StudentRow({ name, avatar, subtitle, subtitleColor, status, onPress }: StudentRowProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${subtitle}${status ? `, último acesso ${status.label}` : ''}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <PixelAvatar palette={avatar} size={44} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.subtitle, subtitleColor && { color: subtitleColor, fontFamily: fonts.extraBold }]} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      {status && (
        <View style={styles.status}>
          <View style={[styles.dot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      )}
      <Glyph name="chevronRight" size={18} strokeWidth={3} color={colors.text.secondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  pressed: {
    backgroundColor: colors.bg.surface2,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  name: {
    fontFamily: fonts.black,
    fontSize: 15,
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 99,
  },
  statusText: {
    fontFamily: fonts.extraBold,
    fontSize: 11,
  },
});
