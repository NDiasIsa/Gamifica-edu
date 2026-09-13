import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Glyph } from '@/components/ui/Glyph';
import { colors, fonts, solidShadow } from '@/constants/theme';
import { formatNumber } from '@/lib/progression';
import type { RankingEntry } from '@/types/game';

/** Situação do duelo com este colega. */
export type RowChallengeState = 'none' | 'sent' | 'received';

type RankingRowProps = {
  entry: RankingEntry;
  position: number;
  /** Só para a aluna atual: posições ganhas (+) ou perdidas (−) na temporada. */
  movement?: number;
  challengeState: RowChallengeState;
  onChallenge: () => void;
  onOpenChallenges: () => void;
};

const podium = [
  { color: colors.accent.xpGold, depth: colors.depth.gold },
  { color: colors.accent.manaCyan, depth: colors.depth.cyan },
  { color: colors.accent.hpPink, depth: colors.depth.pink },
];

const CHALLENGE_TEXT = '#F0ABFC';

export function RankingRow({ entry, position, movement = 0, challengeState, onChallenge, onOpenChallenges }: RankingRowProps) {
  const medal = podium[position - 1];
  const isMe = entry.isCurrentStudent;

  const subtitle = () => {
    if (isMe) {
      return (
        <View style={styles.subtitleRow}>
          <Text style={styles.classroom}>
            {entry.classroom}
            {movement !== 0 ? ' ·' : ''}
          </Text>
          {movement !== 0 && (
            <>
              <Glyph
                name={movement > 0 ? 'arrowUp' : 'arrowDown'}
                size={12}
                strokeWidth={3}
                color={movement > 0 ? colors.accent.success : colors.accent.hpPink}
              />
              <Text style={[styles.movement, { color: movement > 0 ? colors.accent.success : colors.accent.hpPink }]}>
                {Math.abs(movement)} {Math.abs(movement) === 1 ? 'posição' : 'posições'}
              </Text>
            </>
          )}
        </View>
      );
    }
    if (challengeState !== 'none') {
      return (
        <View style={styles.subtitleRow}>
          <Glyph name="sword" size={12} strokeWidth={2.8} color={CHALLENGE_TEXT} />
          <Text style={styles.challengeText}>{challengeState === 'sent' ? 'Desafio enviado' : 'Te desafiou!'}</Text>
        </View>
      );
    }
    return <Text style={styles.classroom}>{entry.classroom}</Text>;
  };

  return (
    <View style={[styles.row, isMe && styles.rowMe]}>
      <View style={[styles.position, medal && { backgroundColor: medal.color, ...solidShadow(3, medal.depth) }]}>
        <Text style={[styles.positionText, medal && { color: colors.bg.base }]}>#{position}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {entry.name}
          {isMe ? ' (você)' : ''}
        </Text>
        {subtitle()}
      </View>

      <Text style={styles.xp}>{formatNumber(entry.xp)} XP</Text>

      {!isMe &&
        (challengeState === 'sent' ? (
          <Pressable
            onPress={onOpenChallenges}
            style={({ pressed }) => [styles.action, styles.actionPending, pressed && styles.pressedOpacity]}
            accessibilityRole="button"
            accessibilityLabel={`Desafio enviado para ${entry.name}. Ver desafios`}>
            <Glyph name="clock" size={20} color={colors.text.secondary} />
          </Pressable>
        ) : (
          <Pressable
            onPress={challengeState === 'received' ? onOpenChallenges : onChallenge}
            style={({ pressed }) => [styles.action, styles.actionChallenge, pressed && styles.pressedDown]}
            accessibilityRole="button"
            accessibilityLabel={
              challengeState === 'received' ? `Ver desafio de ${entry.name}` : `Desafiar ${entry.name}`
            }>
            <Glyph name="sword" size={22} strokeWidth={2.6} color={colors.text.onColor} />
          </Pressable>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  rowMe: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.bg.surface2,
    ...solidShadow(4, colors.depth.primary),
  },
  position: {
    width: 44,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg.base,
  },
  positionText: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.text.primary,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  name: {
    fontFamily: fonts.black,
    fontSize: 16,
    color: colors.text.primary,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  classroom: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.text.secondary,
  },
  movement: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
  },
  challengeText: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
    color: CHALLENGE_TEXT,
  },
  xp: {
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.accent.xpGold,
  },
  action: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionChallenge: {
    backgroundColor: colors.brand.magenta,
    ...solidShadow(3, colors.depth.magenta),
  },
  actionPending: {
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface2,
  },
  pressedDown: {
    transform: [{ translateY: 2 }],
  },
  pressedOpacity: {
    opacity: 0.7,
  },
});
