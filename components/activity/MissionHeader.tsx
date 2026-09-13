import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SubjectTag } from '@/components/ui/SubjectTag';
import { colors, fonts, solidShadow } from '@/constants/theme';
import { subjects } from '@/data/mock';
import { activityProgress, formatNumber } from '@/lib/progression';
import { activityTypeMeta, subjectSymbol } from '@/lib/activityMeta';
import type { Activity } from '@/types/game';

type MissionHeaderProps = {
  activity: Activity;
  completedStepIds: string[];
};

export function MissionHeader({ activity, completedStepIds }: MissionHeaderProps) {
  const subject = subjects[activity.subjectId];
  const type = activityTypeMeta[activity.type];
  const progress = activityProgress(activity, completedStepIds);
  const typeLabel = activity.type === 'trilha' ? type.detailLabel : `${type.detailLabel} · ${activity.size}`;

  return (
    <LinearGradient
      colors={[colors.depth.deep, colors.bg.surface2]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.card}>
      <View style={styles.top}>
        <View style={styles.info}>
          <SubjectTag subject={subject} />
          <Text style={styles.title} numberOfLines={2}>
            {activity.title}
          </Text>
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Icon name="coin" size={15} />
              <Text style={styles.points}>{formatNumber(progress.totalPoints)} pts</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name={activity.type === 'trilha' ? 'map-light' : type.icon} size={15} />
              <Text style={styles.type} numberOfLines={1}>
                {typeLabel}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={[styles.symbol, { backgroundColor: subject.color }, solidShadow(6, subject.depthColor)]}>
          <Icon name={subjectSymbol[activity.subjectId].largeIcon} size={38} />
        </View>
      </View>

      <View style={styles.progress}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>
            {progress.completedSteps} de {progress.totalSteps} etapas concluídas
          </Text>
          <View style={styles.metaItemTight}>
            <Icon name="bolt-success" size={13} />
            <Text style={styles.progressPoints}>
              {formatNumber(progress.earnedPoints)} / {formatNumber(progress.totalPoints)} pts
            </Text>
          </View>
        </View>
        <ProgressBar
          ratio={progress.totalPoints ? progress.earnedPoints / progress.totalPoints : 0}
          color={colors.accent.success}
          size="lg"
        />
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
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.text.primary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  metaItemTight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  points: {
    fontFamily: fonts.black,
    fontSize: 13,
    color: colors.accent.xpGold,
  },
  type: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.brand.primaryLight,
  },
  symbol: {
    width: 76,
    height: 76,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    gap: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  progressPoints: {
    fontFamily: fonts.black,
    fontSize: 12,
    color: colors.accent.success,
  },
});
