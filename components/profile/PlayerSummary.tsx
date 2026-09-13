import { StyleSheet, Text, View } from 'react-native';

import { Glyph } from '@/components/ui/Glyph';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { colors, fonts, solidShadow } from '@/constants/theme';
import { subjectOrder, subjects } from '@/data/mock';
import { formatNumber, subjectLevel } from '@/lib/progression';
import type { Student } from '@/types/game';

type PlayerSummaryProps = {
  student: Student;
  totalXp: number;
  level: number;
  classPosition: number;
};

/** Topo do Perfil: cartão do jogador + EXP por matéria em versão compacta. */
export function PlayerSummary({ student, totalXp, level, classPosition }: PlayerSummaryProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.card, styles.playerCard]}>
        <View>
          <Text style={styles.name} numberOfLines={2}>
            {student.name}
          </Text>
          <Text style={styles.classroom}>{student.title}</Text>
        </View>

        <View style={styles.xpBlock}>
          <Text style={styles.xpLabel}>XP TOTAL</Text>
          <View style={styles.xpValueRow}>
            <Glyph name="bolt" size={16} color={colors.accent.xpGold} />
            <Text style={styles.xpValue}>{formatNumber(totalXp)}</Text>
          </View>
        </View>

        <View style={styles.chips}>
          <View style={[styles.chip, styles.levelChip]} accessibilityLabel={`Nível ${level}`}>
            <Text style={styles.chipText}>NV {level}</Text>
          </View>
          <View style={[styles.chip, styles.rankChip]} accessibilityLabel={`${classPosition}º na turma`}>
            <Text style={styles.chipText}>#{classPosition}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, styles.expCard]}>
        <Text style={styles.expTitle}>EXP POR MATÉRIA</Text>
        <View style={styles.bars}>
          {subjectOrder.map((id) => {
            const subject = subjects[id];
            const progress = subjectLevel(student.subjectXp[id]);
            return (
              <View key={id} style={styles.bar}>
                <View style={styles.barHeader}>
                  <View style={styles.barName}>
                    <View style={[styles.diamond, { backgroundColor: subject.color }]} />
                    <Text style={styles.subjectName}>{subject.name}</Text>
                  </View>
                  <Text style={[styles.subjectLevel, { color: subject.color }]}>Nv {progress.level}</Text>
                </View>
                <ProgressBar ratio={progress.ratio} color={subject.color} size="xs" />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  card: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  playerCard: {
    width: 146,
    padding: 12,
    gap: 8,
    justifyContent: 'space-between',
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.text.primary,
  },
  classroom: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  xpBlock: {
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
    gap: 5,
  },
  xpValue: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 28,
    color: colors.accent.xpGold,
  },
  chips: {
    flexDirection: 'row',
    gap: 6,
    paddingBottom: 3,
  },
  chip: {
    flex: 1,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelChip: {
    backgroundColor: colors.accent.xpGold,
    ...solidShadow(3, colors.depth.gold),
  },
  rankChip: {
    backgroundColor: colors.accent.manaCyan,
    ...solidShadow(3, colors.depth.cyan),
  },
  chipText: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.bg.base,
  },
  expCard: {
    flex: 1,
    minWidth: 0,
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  expTitle: {
    fontFamily: fonts.black,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.brand.primaryLight,
  },
  bars: {
    gap: 5,
  },
  bar: {
    gap: 3,
  },
  barHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  barName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  diamond: {
    width: 6,
    height: 6,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  subjectName: {
    fontFamily: fonts.extraBold,
    fontSize: 10,
    color: colors.text.primary,
  },
  subjectLevel: {
    fontFamily: fonts.black,
    fontSize: 10,
  },
});
