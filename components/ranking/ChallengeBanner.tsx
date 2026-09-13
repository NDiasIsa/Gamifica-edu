import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Glyph } from '@/components/ui/Glyph';
import { colors, fonts, solidShadow, withAlpha } from '@/constants/theme';

type ChallengeBannerProps = {
  invites: number;
  sent: number;
  onPress: () => void;
};

export function ChallengeBanner({ invites, sent, onPress }: ChallengeBannerProps) {
  const badge =
    invites > 0
      ? `${invites} ${invites === 1 ? 'CONVITE' : 'CONVITES'}`
      : sent > 0
        ? `${sent} ${sent === 1 ? 'ENVIADO' : 'ENVIADOS'}`
        : null;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Desafio de perguntas${badge ? `, ${badge.toLowerCase()}` : ''}`}
      style={({ pressed }) => [styles.banner, pressed && styles.pressed]}>
      <View style={styles.icon}>
        <Glyph name="sword" size={24} strokeWidth={2.6} color={colors.text.onColor} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>Desafio de perguntas</Text>
        <Text style={styles.subtitle}>Chame um colega da sua turma para um duelo valendo XP</Text>
      </View>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.brand.magenta,
    backgroundColor: colors.bg.surface2,
    ...solidShadow(4, colors.depth.magenta),
  },
  pressed: {
    transform: [{ translateY: 2 }],
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand.magenta,
    ...solidShadow(3, colors.depth.magenta),
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  title: {
    fontFamily: fonts.black,
    fontSize: 15,
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: withAlpha(colors.brand.magenta, 0.18),
  },
  badgeText: {
    fontFamily: fonts.black,
    fontSize: 10,
    letterSpacing: 0.6,
    color: '#F0ABFC',
  },
});
