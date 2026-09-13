import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { Glyph, type GlyphName } from '@/components/ui/Glyph';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { colors, fonts, solidShadow } from '@/constants/theme';
import { DAILY_FLASHCARD_XP_LIMIT } from '@/lib/flashcards';
import { formatNumber } from '@/lib/progression';

type FlashStatsCardProps = {
  totalCards: number;
  cardsToday: number;
  xpToday: number;
};

function Stat({ icon, iconColor, value, label }: { icon: GlyphName; iconColor: string; value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <View style={styles.statValueRow}>
        <Glyph name={icon} size={20} strokeWidth={2.8} color={iconColor} />
        <Text style={styles.statValue}>{formatNumber(value)}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export function FlashStatsCard({ totalCards, cardsToday, xpToday }: FlashStatsCardProps) {
  const remaining = Math.max(0, DAILY_FLASHCARD_XP_LIMIT - xpToday);

  return (
    <LinearGradient
      colors={[colors.depth.deep, colors.bg.surface2]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.card}>
      <View style={styles.stats}>
        <Stat icon="cards" iconColor={colors.brand.primaryLight} value={totalCards} label="Total de flash cards" />
        <View style={styles.divider} />
        <Stat icon="check" iconColor={colors.accent.success} value={cardsToday} label="Cards feitos hoje" />
      </View>

      <View style={styles.daily}>
        <View style={styles.dailyHeader}>
          <View style={styles.dailyTitle}>
            <Glyph name="bolt" size={14} color={colors.accent.xpGold} />
            <Text style={styles.dailyTitleText}>XP ganho hoje</Text>
          </View>
          <Text style={styles.dailyValue}>
            {formatNumber(xpToday)} / {formatNumber(DAILY_FLASHCARD_XP_LIMIT)} XP
          </Text>
        </View>
        <ProgressBar
          ratio={xpToday / DAILY_FLASHCARD_XP_LIMIT}
          color={colors.accent.xpGold}
          trackColor={colors.bg.surface2}
          size="lg"
        />
        <Text style={styles.dailyHint}>
          {remaining > 0
            ? `Faltam ${formatNumber(remaining)} XP para bater o limite de hoje`
            : 'Limite de hoje atingido! Você ainda pode praticar, mas o XP volta amanhã.'}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.brand.primary,
    ...solidShadow(5, colors.depth.header),
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 33,
    color: colors.text.primary,
  },
  statLabel: {
    fontFamily: fonts.extraBold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  divider: {
    width: 2,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  daily: {
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.bg.base,
  },
  dailyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dailyTitleText: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: colors.text.primary,
  },
  dailyValue: {
    fontFamily: fonts.black,
    fontSize: 13,
    color: colors.accent.xpGold,
  },
  dailyHint: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.text.secondary,
  },
});
