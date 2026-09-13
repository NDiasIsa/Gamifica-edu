import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { PixelSprite } from '@/components/ui/PixelAvatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { colors, fonts, solidShadow } from '@/constants/theme';
import { subjectOrder, subjects } from '@/data/mock';
import { formatNumber, subjectLevel } from '@/lib/progression';
import type { AvatarPalette, Student } from '@/types/game';

type ProfileCardProps = {
  student: Student;
  avatar: AvatarPalette;
  level: number;
  totalXp: number;
  classPosition: number;
};

/** Personagem com os itens equipados na loja do Perfil. */
function HeroAvatar({ palette }: { palette: AvatarPalette }) {
  return (
    <LinearGradient colors={palette.background} style={[styles.avatar, { borderColor: palette.border }]}>
      <View style={styles.ground} />
      <View style={styles.pixelAvatar}>
        <PixelSprite palette={palette} size={88} />
      </View>
      <View style={[styles.sparkle, styles.sparkleGold]} />
      <View style={[styles.sparkle, styles.sparkleCyan]} />
    </LinearGradient>
  );
}

function SubjectXpRow({ name, color, xp }: { name: string; color: string; xp: number }) {
  const progress = subjectLevel(xp);

  return (
    <View style={styles.xpRow}>
      <View style={styles.xpHeader}>
        <View style={styles.xpName}>
          <View style={styles.diamondBox}>
            <View style={[styles.diamond, { backgroundColor: color }]} />
          </View>
          <Text style={styles.subjectName}>{name}</Text>
        </View>
        <Text style={[styles.subjectLevel, { color }]}>Nv {progress.level}</Text>
      </View>
      <ProgressBar ratio={progress.ratio} color={color} />
    </View>
  );
}

export function ProfileCard({ student, avatar, level, totalXp, classPosition }: ProfileCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.avatarCol}>
        <HeroAvatar palette={avatar} />
        <View style={styles.chips}>
          <View style={[styles.chip, styles.levelChip]} accessibilityLabel={`Nível ${level}`}>
            <Text style={styles.chipText}>NV {level}</Text>
          </View>
          <View style={[styles.chip, styles.rankChip]} accessibilityLabel={`${classPosition}º na turma`}>
            <Text style={styles.chipText}>#{classPosition}</Text>
          </View>
        </View>
        <View style={styles.xpTotal}>
          <Icon name="bolt-gold" size={14} />
          <Text style={styles.xpTotalText}>{formatNumber(totalXp)} XP</Text>
        </View>
      </View>

      <View style={styles.expCol}>
        <View>
          <Text style={styles.playerName} numberOfLines={1}>
            {student.name}
          </Text>
          <Text style={styles.playerTitle} numberOfLines={1}>
            {student.title} · {student.classroom}
          </Text>
        </View>
        <Text style={styles.sectionLabel}>EXP POR MATÉRIA</Text>
        <View style={styles.xpBars}>
          {subjectOrder.map((id) => (
            <SubjectXpRow
              key={id}
              name={subjects[id].name}
              color={subjects[id].color}
              xp={student.subjectXp[id]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 14,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  avatarCol: {
    width: 104,
    gap: 8,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.brand.primary,
    overflow: 'hidden',
  },
  ground: {
    position: 'absolute',
    left: -2,
    top: 86,
    width: 104,
    height: 16,
    backgroundColor: colors.bg.base,
  },
  pixelAvatar: {
    position: 'absolute',
    left: 6,
    top: 10,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkleGold: {
    left: 10,
    top: 12,
    width: 4,
    height: 4,
    backgroundColor: colors.accent.xpGold,
  },
  sparkleCyan: {
    left: 84,
    top: 8,
    width: 3,
    height: 3,
    backgroundColor: colors.accent.manaCyan,
  },
  chips: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    width: 49,
    height: 26,
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
    fontSize: 13,
    color: colors.bg.base,
  },
  xpTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    borderRadius: 9,
    backgroundColor: colors.bg.base,
  },
  xpTotalText: {
    fontFamily: fonts.black,
    fontSize: 12,
    color: colors.accent.xpGold,
  },
  expCol: {
    flex: 1,
    minWidth: 0,
    gap: 8,
  },
  playerName: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.text.primary,
  },
  playerTitle: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  sectionLabel: {
    fontFamily: fonts.black,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.brand.primaryLight,
  },
  xpBars: {
    gap: 7,
  },
  xpRow: {
    gap: 4,
  },
  xpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  xpName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  diamondBox: {
    width: 11.314,
    height: 11.314,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamond: {
    width: 8,
    height: 8,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  subjectName: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: colors.text.primary,
  },
  subjectLevel: {
    fontFamily: fonts.black,
    fontSize: 11,
  },
});
