import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Glyph } from '@/components/ui/Glyph';
import { colors, fonts, solidShadow } from '@/constants/theme';
import { subjectGlyph } from '@/lib/activityMeta';
import { cardStateMeta, cardStateOrder, type DeckStats } from '@/lib/flashcards';
import { formatNumber } from '@/lib/progression';
import type { Subject } from '@/types/game';

type DeckCardProps = {
  subject: Subject;
  stats: DeckStats;
  onPress: () => void;
};

export function DeckCard({ subject, stats, onPress }: DeckCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Baralho de ${subject.name}: ${stats.cardCount} cards, ${stats.xpEarned} XP ganho`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.top}>
        <View style={[styles.symbol, { backgroundColor: subject.color }, solidShadow(4, subject.depthColor)]}>
          <Glyph name={subjectGlyph[subject.id]} size={24} strokeWidth={2.8} color={colors.bg.base} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{subject.name}</Text>
          <Text style={styles.meta} numberOfLines={1}>
            {stats.topicCount} tópicos · {stats.cardCount} cards cadastrados
          </Text>
        </View>
        <View style={styles.xp}>
          <Text style={styles.xpLabel}>XP GANHO</Text>
          <View style={styles.xpValueRow}>
            <Glyph name="bolt" size={13} color={colors.accent.xpGold} />
            <Text style={styles.xpValue}>{formatNumber(stats.xpEarned)} XP</Text>
          </View>
        </View>
      </View>

      <View style={styles.states}>
        <View style={styles.stateList}>
          {cardStateOrder.map((state) => {
            const meta = cardStateMeta[state];
            return (
              <View key={state} style={styles.stateItem}>
                <View style={[styles.diamond, { backgroundColor: meta.color }]} />
                <Text style={[styles.stateCount, { color: meta.color }]}>{stats.byState[state]}</Text>
                <Text style={styles.stateLabel}>{meta.plural}</Text>
              </View>
            );
          })}
        </View>
        <Glyph name="chevronRight" size={18} strokeWidth={3} color={colors.text.secondary} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    padding: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
    ...solidShadow(4, colors.depth.card),
  },
  pressed: {
    transform: [{ translateY: 2 }],
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  symbol: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  name: {
    fontFamily: fonts.black,
    fontSize: 16,
    color: colors.text.primary,
  },
  meta: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  xp: {
    alignItems: 'flex-end',
    gap: 1,
  },
  xpLabel: {
    fontFamily: fonts.black,
    fontSize: 9,
    letterSpacing: 0.72,
    color: colors.text.secondary,
  },
  xpValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  xpValue: {
    fontFamily: fonts.black,
    fontSize: 15,
    color: colors.accent.xpGold,
  },
  states: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 10,
    borderRadius: 12,
    backgroundColor: colors.bg.base,
  },
  stateList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  diamond: {
    width: 8,
    height: 8,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  stateCount: {
    fontFamily: fonts.black,
    fontSize: 13,
  },
  stateLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
});
