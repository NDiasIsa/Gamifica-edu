import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ConfirmSheet } from '@/components/ui/ConfirmSheet';
import { DashedButton } from '@/components/ui/DashedButton';
import { Glyph } from '@/components/ui/Glyph';
import { useToast } from '@/components/ui/Toast';
import { Toggle } from '@/components/ui/Toggle';
import { colors, fonts, solidShadow, withAlpha } from '@/constants/theme';
import { subjects } from '@/data/mock';
import { activityTypeMeta, subjectGlyph } from '@/lib/activityMeta';
import { activityPoints, formatNumber } from '@/lib/progression';
import { useTeacherView } from '@/store/useTeacherView';
import type { Activity } from '@/types/game';

export function ActivitiesPanel() {
  const router = useRouter();
  const { showToast } = useToast();
  const { classActivities, currentClass, setActivityStatus, deleteActivity } = useTeacherView();
  const [toDelete, setToDelete] = useState<Activity | null>(null);

  const published = classActivities.filter((item) => item.status === 'published').length;

  const edit = (activity: Activity) =>
    router.push({ pathname: '/professor/nova-atividade', params: { id: activity.id } });

  return (
    <View style={styles.list}>
      <Text style={styles.summary}>
        {currentClass?.name} · {published} {published === 1 ? 'publicada' : 'publicadas'} ·{' '}
        {classActivities.length - published} {classActivities.length - published === 1 ? 'rascunho' : 'rascunhos'}
      </Text>

      {classActivities.map((activity) => {
        const subject = subjects[activity.subjectId];
        const isPublished = activity.status === 'published';
        return (
          <View key={activity.id} style={styles.card}>
            <Pressable
              onPress={() => edit(activity)}
              accessibilityRole="button"
              accessibilityLabel={`Editar ${activity.title}`}
              style={styles.main}>
              <View style={[styles.symbol, { backgroundColor: subject.color }, solidShadow(3, subject.depthColor)]}>
                <Glyph name={subjectGlyph[activity.subjectId]} size={20} strokeWidth={2.8} color={colors.bg.base} />
              </View>
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                  {activity.title}
                </Text>
                <Text style={styles.meta} numberOfLines={1}>
                  {activityTypeMeta[activity.type].label} · {activity.steps.length}{' '}
                  {activity.steps.length === 1 ? 'etapa' : 'etapas'} · {formatNumber(activityPoints(activity))} XP
                </Text>
              </View>
            </Pressable>

            <View style={styles.footer}>
              <View
                style={[
                  styles.status,
                  { backgroundColor: withAlpha(isPublished ? colors.accent.success : colors.text.secondary, 0.15) },
                ]}>
                <Text style={[styles.statusText, { color: isPublished ? colors.accent.success : colors.text.secondary }]}>
                  {isPublished ? 'PUBLICADA' : 'RASCUNHO'}
                </Text>
              </View>
              {activity.dueLabel && (
                <View style={styles.due}>
                  <Glyph name="calendar" size={13} color={colors.text.secondary} />
                  <Text style={styles.dueText}>{activity.dueLabel}</Text>
                </View>
              )}
              <View style={styles.flex} />
              <Pressable
                onPress={() => setToDelete(activity)}
                accessibilityRole="button"
                accessibilityLabel={`Excluir ${activity.title}`}
                hitSlop={6}
                style={styles.trash}>
                <Glyph name="trash" size={18} color={colors.text.secondary} />
              </Pressable>
              <Toggle
                value={isPublished}
                accessibilityLabel={`Publicar ${activity.title}`}
                onChange={(next) => {
                  setActivityStatus(activity.id, next ? 'published' : 'draft');
                  showToast(next ? `"${activity.title}" publicada para os alunos` : `"${activity.title}" voltou para rascunho`);
                }}
              />
            </View>
          </View>
        );
      })}

      {classActivities.length === 0 && <Text style={styles.empty}>Nenhuma atividade nesta turma ainda.</Text>}

      <DashedButton
        label="Nova atividade"
        hint="trilha, quiz ou flashcards"
        onPress={() => router.push('/professor/nova-atividade')}
      />

      {toDelete && (
        <ConfirmSheet
          eyebrow="EXCLUIR ATIVIDADE"
          title={toDelete.title}
          message="A atividade some para os alunos e não dá para desfazer. O XP que eles já ganharam continua."
          confirmLabel="EXCLUIR"
          onConfirm={() => {
            deleteActivity(toDelete.id);
            showToast(`"${toDelete.title}" excluída`);
          }}
          onClose={() => setToDelete(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  summary: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  card: {
    gap: 10,
    padding: 12,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  symbol: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  title: {
    fontFamily: fonts.black,
    fontSize: 15,
    color: colors.text.primary,
  },
  meta: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: fonts.black,
    fontSize: 10,
    letterSpacing: 0.4,
  },
  due: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  flex: {
    flex: 1,
  },
  trash: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    paddingVertical: 16,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.text.secondary,
  },
});
