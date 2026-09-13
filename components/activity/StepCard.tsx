import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { colors, fonts, solidShadow } from '@/constants/theme';
import { materialFormatMeta } from '@/lib/activityMeta';
import { formatNumber } from '@/lib/progression';
import type { StudyStep } from '@/types/game';

export type StepStatus = 'completed' | 'next' | 'pending';

type StepCardProps = {
  step: StudyStep;
  index: number;
  status: StepStatus;
  onPress: () => void;
};

// As etapas alternam as cores de acento do círculo (rosa, ciano, verde).
const circlePalette = [
  { color: colors.accent.hpPink, depth: colors.depth.pink },
  { color: colors.accent.manaCyan, depth: colors.depth.cyan },
  { color: colors.accent.success, depth: colors.depth.success },
];

export function StepCard({ step, index, status, onPress }: StepCardProps) {
  const circle = circlePalette[index % circlePalette.length];
  const format = materialFormatMeta[step.format];
  const isCompleted = status === 'completed';
  const isNext = status === 'next';

  return (
    <Pressable
      onPress={onPress}
      disabled={isCompleted}
      accessibilityRole="button"
      accessibilityState={{ disabled: isCompleted }}
      accessibilityLabel={`${step.title}, ${format.label} ${step.length}, ${step.points} pontos${isCompleted ? ', concluída' : ''}`}
      style={({ pressed }) => [styles.card, isNext && styles.cardNext, pressed && styles.pressed]}>
      <View style={styles.row}>
        <View style={[styles.circle, { backgroundColor: circle.color }, solidShadow(4, circle.depth)]}>
          <Icon name="cap" size={26} />
        </View>
        <View style={styles.text}>
          <Text style={styles.title} numberOfLines={1}>
            {step.title}
          </Text>
          <View style={styles.meta}>
            <Icon name={format.icon} size={13} />
            <Text style={styles.metaText}>
              {format.label} · {step.length}
            </Text>
          </View>
        </View>
        {isCompleted ? (
          <View style={styles.doneBadge}>
            <Icon name="check" size={16} />
          </View>
        ) : (
          step.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NOVO</Text>
            </View>
          )
        )}
      </View>

      <View style={styles.reward}>
        <View style={styles.rewardLabel}>
          <Icon name="bolt-reward" size={15} />
          <Text style={styles.rewardText}>
            +{formatNumber(step.points)} pontos{isCompleted ? ' · concluída' : ''}
          </Text>
        </View>
        <Icon name={isNext ? 'chev-active' : 'chev'} size={20} />
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
  cardNext: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.bg.surface2,
    ...solidShadow(4, colors.depth.primary),
  },
  pressed: {
    transform: [{ translateY: 2 }],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontFamily: fonts.black,
    fontSize: 16,
    color: colors.text.primary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  doneBadge: {
    width: 26,
    height: 26,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.success,
  },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: colors.brand.magenta,
    ...solidShadow(2, colors.depth.magenta),
  },
  newBadgeText: {
    fontFamily: fonts.display,
    fontSize: 11,
    color: colors.text.onColor,
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: colors.bg.base,
  },
  rewardLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardText: {
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.accent.success,
  },
});
