import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClassPickerSheet } from '@/components/teacher/ClassPickerSheet';
import { FilePreviewSheet } from '@/components/teacher/FilePreviewSheet';
import { SubmissionCard } from '@/components/teacher/SubmissionCard';
import { Glyph } from '@/components/ui/Glyph';
import { IconButton } from '@/components/ui/IconButton';
import { PixelAvatar } from '@/components/ui/PixelAvatar';
import { ScreenBackground, teacherGlows } from '@/components/ui/ScreenBackground';
import { ScreenTitle } from '@/components/ui/ScreenTitle';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useToast } from '@/components/ui/Toast';
import { colors, fonts, withAlpha } from '@/constants/theme';
import { subjects } from '@/data/mock';
import { materialFormatMeta } from '@/lib/activityMeta';
import { formatGrade, xpForGrade } from '@/lib/school';
import { useTeacherView } from '@/store/useTeacherView';
import type { Submission } from '@/types/game';

type Tab = 'pendentes' | 'corrigidas' | 'atrasadas';

export default function SubmissionsScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const view = useTeacherView();
  const [tab, setTab] = useState<Tab>('pendentes');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const inClass = (studentId: string) => view.classStudents.some((student) => student.id === studentId);
  const studentOf = (id: string) => view.getStudent(id);
  const stepOf = (submission: Submission) =>
    view.getActivity(submission.activityId)?.steps.find((step) => step.id === submission.stepId);

  const pending = view.pendingSubmissions;
  const corrected = view.submissions.filter((item) => item.status !== 'pending' && inClass(item.studentId));
  const late = view.lateDeliveries.filter((item) => inClass(item.studentId));

  // Agrupa as pendentes por etapa ("RELIGIÕES AFRICANAS · PDF").
  const groups = pending.reduce<{ key: string; items: Submission[] }[]>((acc, item) => {
    const key = `${item.activityId}:${item.stepId}`;
    const group = acc.find((entry) => entry.key === key);
    if (group) group.items.push(item);
    else acc.push({ key, items: [item] });
    return acc;
  }, []);

  const currentExpanded = pending.some((item) => item.id === expandedId) ? expandedId : pending[0]?.id;
  const previewSubmission = view.submissions.find((item) => item.id === previewId);

  const grade = (submission: Submission, value: number, comment: string, decision: 'approved' | 'revision') => {
    const step = stepOf(submission);
    const name = studentOf(submission.studentId)?.name.split(' ')[0];
    view.gradeSubmission(submission.id, { grade: value, comment, decision });
    showToast(
      decision === 'approved'
        ? `Entrega de ${name} aprovada · +${xpForGrade(value, step?.points ?? 0)} XP`
        : `Revisão pedida para ${name}`,
    );
    // Abre a próxima entrega pendente automaticamente.
    setExpandedId(pending.find((item) => item.id !== submission.id)?.id ?? null);
  };

  return (
    <ScreenBackground glows={teacherGlows}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 4 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <ScreenTitle
          title="ENTREGAS"
          subtitle={`${view.currentClass?.name} · ${pending.length} aguardando correção`}
          action={<IconButton icon="filter" accessibilityLabel="Filtrar por turma" onPress={() => setPickerOpen(true)} />}
        />

        <SegmentedControl
          height={40}
          fontSize={13}
          value={tab}
          onChange={setTab}
          options={[
            { value: 'pendentes', label: `Pendentes · ${pending.length}` },
            { value: 'corrigidas', label: 'Corrigidas' },
            { value: 'atrasadas', label: `Atrasadas · ${late.length}` },
          ]}
        />

        {tab === 'pendentes' && (
          <>
            {pending.length === 0 && <EmptyState text="Nenhuma entrega esperando correção. Bom trabalho!" />}
            {groups.map((group) => {
              const first = group.items[0];
              const activity = view.getActivity(first.activityId);
              const step = stepOf(first);
              if (!activity || !step) return null;
              return (
                <View key={group.key} style={styles.group}>
                  <View style={styles.groupHeader}>
                    <View style={styles.groupTitle}>
                      <Glyph name="book" size={14} strokeWidth={2.8} color={subjects[activity.subjectId].color} />
                      <Text style={styles.groupTitleText} numberOfLines={1}>
                        {step.title.toUpperCase()} · {materialFormatMeta[step.format].label.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.groupCount}>
                      {group.items.length} {group.items.length === 1 ? 'pendente' : 'pendentes'}
                    </Text>
                  </View>
                  {group.items.map((submission) => {
                    const student = studentOf(submission.studentId);
                    if (!student) return null;
                    return (
                      <SubmissionCard
                        key={submission.id}
                        submission={submission}
                        studentName={student.name}
                        avatar={view.avatarOf(student)}
                        step={step}
                        expanded={submission.id === currentExpanded}
                        onExpand={() => setExpandedId(submission.id)}
                        onPreview={() => setPreviewId(submission.id)}
                        onGrade={(value, comment, decision) => grade(submission, value, comment, decision)}
                      />
                    );
                  })}
                </View>
              );
            })}
          </>
        )}

        {tab === 'corrigidas' && (
          <View style={styles.list}>
            {corrected.length === 0 && <EmptyState text="As entregas corrigidas aparecem aqui." />}
            {corrected.map((submission) => {
              const student = studentOf(submission.studentId);
              const step = stepOf(submission);
              if (!student || !step) return null;
              const approved = submission.status === 'approved';
              return (
                <View key={submission.id} style={styles.row}>
                  <PixelAvatar palette={view.avatarOf(student)} size={40} />
                  <View style={styles.rowInfo}>
                    <Text style={styles.rowName} numberOfLines={1}>
                      {student.name}
                    </Text>
                    <Text style={styles.rowDetail} numberOfLines={1}>
                      {step.title} · nota {formatGrade(submission.grade ?? 0)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.chip,
                      { backgroundColor: withAlpha(approved ? colors.accent.success : colors.accent.hpPink, 0.15) },
                    ]}>
                    <Text style={[styles.chipText, { color: approved ? colors.accent.success : colors.accent.hpPink }]}>
                      {approved ? `+${submission.xpAwarded} XP` : 'REVISÃO'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {tab === 'atrasadas' && (
          <View style={styles.list}>
            {late.length === 0 && <EmptyState text="Ninguém com atividade atrasada nesta turma." />}
            {late.map((item) => {
              const student = studentOf(item.studentId);
              const activity = view.getActivity(item.activityId);
              if (!student || !activity) return null;
              return (
                <View key={item.id} style={styles.row}>
                  <PixelAvatar palette={view.avatarOf(student)} size={40} />
                  <View style={styles.rowInfo}>
                    <Text style={styles.rowName} numberOfLines={1}>
                      {student.name}
                    </Text>
                    <Text style={[styles.rowDetail, { color: colors.accent.hpPink }]} numberOfLines={1}>
                      {activity.title} · {item.dueLabel}
                    </Text>
                  </View>
                  {item.reminded ? (
                    <View style={[styles.chip, { backgroundColor: colors.bg.surface2 }]}>
                      <Text style={[styles.chipText, { color: colors.text.secondary }]}>LEMBRADO</Text>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => {
                        view.remindLateDelivery(item.id);
                        showToast(`Lembrete enviado para ${student.name.split(' ')[0]}`);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Lembrar ${student.name} da atividade atrasada`}
                      style={({ pressed }) => [styles.remind, pressed && styles.pressed]}>
                      <Glyph name="bell" size={16} strokeWidth={2.6} color={colors.text.onColor} />
                      <Text style={styles.remindText}>Lembrar</Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <LinearGradient
        colors={['rgba(18,12,34,0)', 'rgba(18,12,34,0.92)', colors.bg.base]}
        locations={[0, 0.45, 1]}
        style={styles.bottomFade}
      />

      {previewSubmission && (
        <FilePreviewSheet
          submission={previewSubmission}
          studentName={studentOf(previewSubmission.studentId)?.name ?? ''}
          onClose={() => setPreviewId(null)}
        />
      )}
      {pickerOpen && <ClassPickerSheet onClose={() => setPickerOpen(false)} />}
    </ScreenBackground>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.empty}>
      <Glyph name="inbox" size={28} color={colors.text.secondary} />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 56,
  },
  group: {
    gap: 8,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  groupTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  groupTitleText: {
    flexShrink: 1,
    fontFamily: fonts.black,
    fontSize: 11,
    letterSpacing: 1.1,
    color: colors.brand.primaryLight,
  },
  groupCount: {
    fontFamily: fonts.extraBold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  rowInfo: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  rowName: {
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.text.primary,
  },
  rowDetail: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chipText: {
    fontFamily: fonts.black,
    fontSize: 11,
  },
  remind: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.brand.magenta,
  },
  pressed: {
    transform: [{ translateY: 2 }],
  },
  remindText: {
    fontFamily: fonts.black,
    fontSize: 13,
    color: colors.text.onColor,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 32,
  },
  emptyText: {
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.text.secondary,
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
    pointerEvents: 'none',
  },
});
