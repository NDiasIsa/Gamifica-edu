import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { SubjectTag } from '@/components/ui/SubjectTag';
import { colors, fonts, solidShadow } from '@/constants/theme';
import { subjects } from '@/data/mock';
import { activityTypeMeta, subjectSymbol } from '@/lib/activityMeta';
import { activityPoints, formatNumber } from '@/lib/progression';
import type { Activity } from '@/types/game';

type ActivityCardProps = {
  activity: Activity;
  onPress: () => void;
};

export function ActivityCard({ activity, onPress }: ActivityCardProps) {
  const subject = subjects[activity.subjectId];
  const type = activityTypeMeta[activity.type];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${subject.name}: ${activity.title}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.strip, { backgroundColor: subject.color }]} />

      <View style={styles.info}>
        <SubjectTag subject={subject} />
        <Text style={styles.title} numberOfLines={1}>
          {activity.title}
        </Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Icon name="coin" size={14} />
            <Text style={styles.points}>{formatNumber(activityPoints(activity))} pts</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name={type.icon} size={14} />
            <Text style={styles.type} numberOfLines={1}>
              {type.label} · {activity.size}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.symbolWrap}>
        <View
          style={[
            styles.symbol,
            { backgroundColor: subject.color },
            solidShadow(5, subject.depthColor),
          ]}>
          <Icon name={subjectSymbol[activity.subjectId].icon} size={28} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
    ...solidShadow(4, colors.depth.card),
  },
  pressed: {
    transform: [{ translateY: 2 }],
    boxShadow: `0px 2px 0px 0px ${colors.depth.card}`,
  },
  strip: {
    alignSelf: 'stretch',
    width: 8,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 5,
    paddingLeft: 14,
    paddingVertical: 14,
  },
  title: {
    fontFamily: fonts.black,
    fontSize: 16,
    color: colors.text.primary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  points: {
    fontFamily: fonts.black,
    fontSize: 12,
    color: colors.accent.xpGold,
  },
  type: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  symbolWrap: {
    paddingLeft: 8,
    paddingRight: 14,
  },
  symbol: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
