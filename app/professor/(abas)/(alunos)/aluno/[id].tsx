import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BonusXpSheet } from '@/components/teacher/BonusXpSheet';
import { MessageSheet } from '@/components/teacher/MessageSheet';
import { Glyph } from '@/components/ui/Glyph';
import { IconButton } from '@/components/ui/IconButton';
import { PixelAvatar } from '@/components/ui/PixelAvatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ScreenBackground, teacherGlows } from '@/components/ui/ScreenBackground';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { colors, fonts, solidShadow, withAlpha } from '@/constants/theme';
import { CURRENT_STUDENT_ID, subjectOrder, subjects } from '@/data/mock';
import { activityTypeMeta, subjectGlyph } from '@/lib/activityMeta';
import { subjectLevel } from '@/lib/progression';
import { formatGrade } from '@/lib/school';
import { useGame } from '@/store/GameProvider';
import { useTeacherView } from '@/store/useTeacherView';
import type { Activity, RosterStudent } from '@/types/game';

type ActivityStatus = { label: string; color: string; detail: string };

export default function StudentPerformanceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const view = useTeacherView();
  const { isStepCompleted } = useGame();
  const [sheet, setSheet] = useState<'message' | 'bonus' | null>(null);

  const student = view.getStudent(id);
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/professor/alunos'));

  if (!student) {
    return (
      <ScreenBackground glows={teacherGlows}>
        <View style={[styles.notFound, { paddingTop: insets.top }]}>
          <Text style={styles.notFoundText}>Aluno não encontrado.</Text>
          <Pressable onPress={goBack} accessibilityRole="button">
            <Text style={styles.link}>Voltar para a lista</Text>
          </Pressable>
        </View>
      </ScreenBackground>
    );
  }

  const className = view.getClass(student.classId)?.name ?? '';
  const activities = view.activities.filter((item) => item.classId === student.classId && item.status === 'published');

  const statusOf = (activity: Activity): ActivityStatus => {
    const type = activityTypeMeta[activity.type].label;
    const late = view.lateDeliveries.find((item) => item.studentId === student.id && item.activityId === activity.id);
    if (late) return { label: 'ATRASADA', color: colors.accent.hpPink, detail: `${type} · ${late.dueLabel}` };

    const sent = view.submissions.filter((item) => item.studentId === student.id && item.activityId === activity.id);
    const approved = sent.find((item) => item.status === 'approved');
    if (approved?.grade !== undefined)
      return { label: 'ENTREGUE', color: colors.accent.success, detail: `${type} · nota ${formatGrade(approved.grade)}/10` };
    const pending = sent.find((item) => item.status === 'pending');
    if (pending) return { label: 'PARA CORRIGIR', color: colors.brand.magenta, detail: `${type} · enviado ${pending.sentLabel}` };

    // Para a aluna logada usamos o progresso real das etapas; para os demais, a taxa de entregas do cadastro.
    const total = activity.steps.length;
    const done =
      student.id === CURRENT_STUDENT_ID
        ? activity.steps.filter((step) => isStepCompleted(step.id)).length
        : student.assigned > 0 && student.delivered / student.assigned >= 0.8
          ? total
          : Math.floor(total / 2);
    if (done >= total && total > 0)
      return { label: 'CONCLUÍDA', color: colors.accent.success, detail: `${type} · ${total} de ${total} etapas` };
    if (done > 0) return { label: 'EM ANDAMENTO', color: colors.accent.manaCyan, detail: `${type} · ${done} de ${total} etapas` };
    return { label: 'NÃO INICIADA', color: colors.text.secondary, detail: `${type} · prazo ${activity.dueLabel ?? 'livre'}` };
  };

  return (
    <ScreenBackground glows={teacherGlows}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 4 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.appBar}>
          <IconButton icon="chevronLeft" accessibilityLabel="Voltar" onPress={goBack} />
          <Text style={styles.appBarTitle}>DESEMPENHO</Text>
          <IconButton icon="mail" accessibilityLabel={`Mandar mensagem para ${student.name}`} onPress={() => setSheet('message')} />
        </View>

        <HeroCard
          student={student}
          avatar={view.avatarOf(student)}
          className={className}
          level={view.levelOf(student)}
          position={view.classPositionOf(student)}
          onMessage={() => setSheet('message')}
          onBonus={() => setSheet('bonus')}
        />

        <View style={styles.stats}>
          <Stat value={`${student.delivered}/${student.assigned}`} label="Entregues" color={colors.accent.success} />
          <Stat value={String(student.late)} label={student.late === 1 ? 'Atrasada' : 'Atrasadas'} color={colors.accent.hpPink} />
          <Stat
            value={`${Math.round(student.flashcardAccuracy * 100)}%`}
            label="Flashcards"
            color={colors.accent.manaCyan}
          />
        </View>

        <View style={styles.card}>
          <SectionLabel label="EXP POR MATÉRIA" />
          <View style={styles.xpGrid}>
            {[subjectOrder.slice(0, 2), subjectOrder.slice(2)].map((pair, rowIndex) => (
              <View key={rowIndex} style={styles.xpRow}>
                {pair.map((subjectId) => {
                  const progress = subjectLevel(student.subjectXp[subjectId]);
                  const subject = subjects[subjectId];
                  return (
                    <View key={subjectId} style={styles.xpItem}>
                      <View style={styles.xpHeader}>
                        <View style={styles.xpName}>
                          <View style={[styles.diamond, { backgroundColor: subject.color }]} />
                          <Text style={styles.xpNameText}>{subject.name}</Text>
                        </View>
                        <Text style={[styles.xpLevel, { color: subject.color }]}>Nv {progress.level}</Text>
                      </View>
                      <ProgressBar ratio={progress.ratio} color={subject.color} size="xs" />
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.recent}>
          <SectionLabel label="ATIVIDADES RECENTES" />
          {activities.length === 0 && <Text style={styles.empty}>Nenhuma atividade publicada para a turma.</Text>}
          {activities.map((activity) => {
            const subject = subjects[activity.subjectId];
            const status = statusOf(activity);
            return (
              <View key={activity.id} style={styles.activityRow}>
                <View style={[styles.activityIcon, { backgroundColor: subject.color }, solidShadow(3, subject.depthColor)]}>
                  <Glyph name={subjectGlyph[activity.subjectId]} size={20} strokeWidth={2.8} color={colors.bg.base} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle} numberOfLines={1}>
                    {activity.title}
                  </Text>
                  <Text style={styles.activityDetail} numberOfLines={1}>
                    {status.detail}
                  </Text>
                </View>
                <View style={[styles.statusChip, { backgroundColor: withAlpha(status.color, 0.15) }]}>
                  <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {sheet === 'message' && <MessageSheet student={student} onClose={() => setSheet(null)} />}
      {sheet === 'bonus' && <BonusXpSheet student={student} onClose={() => setSheet(null)} />}
    </ScreenBackground>
  );
}

function HeroCard({
  student,
  avatar,
  className,
  level,
  position,
  onMessage,
  onBonus,
}: {
  student: RosterStudent;
  avatar: RosterStudent['avatar'];
  className: string;
  level: number;
  position: number;
  onMessage: () => void;
  onBonus: () => void;
}) {
  return (
    <LinearGradient
      colors={[colors.depth.deep, colors.bg.surface2]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.hero}>
      <View style={styles.heroTop}>
        <PixelAvatar palette={avatar} size={72} />
        <View style={styles.heroInfo}>
          <Text style={styles.heroName} numberOfLines={1}>
            {student.name}
          </Text>
          <Text style={styles.heroMeta} numberOfLines={1}>
            {className} · Matrícula {student.enrollment}
          </Text>
          <View style={styles.heroChips}>
            <View style={[styles.chip, { backgroundColor: colors.accent.xpGold }, solidShadow(2, colors.depth.gold)]}>
              <Text style={styles.chipText}>NV {level}</Text>
            </View>
            <View style={[styles.chip, { backgroundColor: colors.accent.manaCyan }, solidShadow(2, colors.depth.cyan)]}>
              <Text style={styles.chipText}>#{position}</Text>
            </View>
            <View style={[styles.chip, styles.streakChip]}>
              <Glyph name="flame" size={12} color={colors.accent.streak} />
              <Text style={styles.streakText}>
                {student.streakDays} {student.streakDays === 1 ? 'dia' : 'dias'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.heroActions}>
        <Pressable
          onPress={onMessage}
          accessibilityRole="button"
          style={({ pressed }) => [styles.heroButton, styles.messageButton, pressed && styles.pressedOpacity]}>
          <Glyph name="mail" size={18} strokeWidth={2.6} color={colors.text.primary} />
          <Text style={styles.messageText}>Mensagem</Text>
        </Pressable>
        <Pressable
          onPress={onBonus}
          accessibilityRole="button"
          style={({ pressed }) => [styles.heroButton, styles.bonusButton, pressed && styles.pressedDown]}>
          <Glyph name="bolt" size={16} color={colors.bg.base} />
          <Text style={styles.bonusText}>Dar XP bônus</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 56,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appBarTitle: {
    fontFamily: fonts.display,
    fontSize: 19,
    letterSpacing: 0.76,
    color: colors.text.primary,
  },
  hero: {
    gap: 12,
    padding: 14,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.brand.primary,
    ...solidShadow(5, colors.depth.header),
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroInfo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  heroName: {
    fontFamily: fonts.display,
    fontSize: 21,
    color: colors.text.primary,
  },
  heroMeta: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  heroChips: {
    flexDirection: 'row',
    gap: 6,
    paddingTop: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  chipText: {
    fontFamily: fonts.display,
    fontSize: 13,
    color: colors.bg.base,
  },
  streakChip: {
    backgroundColor: withAlpha(colors.accent.streak, 0.18),
  },
  streakText: {
    fontFamily: fonts.black,
    fontSize: 11,
    color: colors.text.primary,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 8,
  },
  heroButton: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
  },
  messageButton: {
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface2,
  },
  bonusButton: {
    backgroundColor: colors.accent.xpGold,
    ...solidShadow(4, colors.depth.gold),
  },
  pressedOpacity: {
    opacity: 0.7,
  },
  pressedDown: {
    transform: [{ translateY: 2 }],
  },
  messageText: {
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.text.primary,
  },
  bonusText: {
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.bg.base,
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: 22,
  },
  statLabel: {
    fontFamily: fonts.extraBold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  card: {
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  xpGrid: {
    gap: 8,
  },
  xpRow: {
    flexDirection: 'row',
    gap: 14,
  },
  xpItem: {
    flex: 1,
    gap: 3,
  },
  xpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  xpName: {
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
  xpNameText: {
    fontFamily: fonts.extraBold,
    fontSize: 10,
    color: colors.text.primary,
  },
  xpLevel: {
    fontFamily: fonts.black,
    fontSize: 10,
  },
  recent: {
    gap: 8,
  },
  empty: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.text.secondary,
  },
  activityRow: {
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
  activityIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  activityTitle: {
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.text.primary,
  },
  activityDetail: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: fonts.black,
    fontSize: 10,
    letterSpacing: 0.4,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFoundText: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.text.primary,
  },
  link: {
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.brand.primaryLight,
  },
});
