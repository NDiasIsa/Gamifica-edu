import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActivityCard } from '@/components/home/ActivityCard';
import { StepEditorSheet } from '@/components/teacher/StepEditorSheet';
import { BottomSheet, SheetHeader } from '@/components/ui/BottomSheet';
import { DashedButton } from '@/components/ui/DashedButton';
import { Glyph } from '@/components/ui/Glyph';
import { GradientButton } from '@/components/ui/GradientButton';
import { IconButton } from '@/components/ui/IconButton';
import { detailGlows, ScreenBackground } from '@/components/ui/ScreenBackground';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SubjectPicker } from '@/components/ui/SubjectPicker';
import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/Toast';
import { colors, fonts, solidShadow } from '@/constants/theme';
import { subjects } from '@/data/mock';
import { materialFormatMeta } from '@/lib/activityMeta';
import { formatNumber } from '@/lib/progression';
import { activitySizeLabel, createId } from '@/lib/school';
import { useSchool } from '@/store/SchoolProvider';
import type { Activity, ActivityType, StudyStep, SubjectId } from '@/types/game';

const STEP_COLORS = [
  { color: colors.accent.hpPink, depth: colors.depth.pink },
  { color: colors.accent.manaCyan, depth: colors.depth.cyan },
  { color: colors.accent.success, depth: colors.depth.success },
];

/** Opções de prazo a partir de hoje ("20/09 · 23:59"). */
function dueOptions(now: number) {
  return [
    ['Hoje', 0],
    ['Amanhã', 1],
    ['Em 3 dias', 3],
    ['Em 1 semana', 7],
    ['Em 2 semanas', 14],
  ].map(([label, days]) => {
    const date = new Date(now + Number(days) * 86_400_000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return { label: String(label), value: `${day}/${month} · 23:59` };
  });
}

export default function ActivityEditorScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { getActivity, saveActivity, currentClassId, getClass } = useSchool();

  const existing = id ? getActivity(id) : undefined;
  const [title, setTitle] = useState(existing?.title ?? '');
  const [subjectId, setSubjectId] = useState<SubjectId>(existing?.subjectId ?? 'historia');
  const [type, setType] = useState<ActivityType>(existing?.type ?? 'trilha');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [dueLabel, setDueLabel] = useState(() => existing?.dueLabel ?? dueOptions(Date.now())[3].value);
  const [steps, setSteps] = useState<StudyStep[]>(existing?.steps ?? []);
  const [editingStep, setEditingStep] = useState<StudyStep | 'new' | null>(null);
  const [sheet, setSheet] = useState<'due' | 'preview' | null>(null);
  const [triedPublish, setTriedPublish] = useState(false);

  const classId = existing?.classId ?? currentClassId;
  const className = getClass(classId)?.name ?? '';
  const totalPoints = steps.reduce((sum, step) => sum + step.points, 0);

  const errors = {
    title: !title.trim() ? 'Dê um nome para a atividade.' : undefined,
    steps: steps.length === 0 ? 'Adicione pelo menos uma etapa para publicar.' : undefined,
  };

  const buildActivity = (status: Activity['status']): Activity => ({
    id: existing?.id ?? createId('atividade'),
    classId,
    subjectId,
    title: title.trim(),
    description: description.trim() || `Atividade de ${subjects[subjectId].name} preparada pelo seu professor.`,
    type,
    size: activitySizeLabel(type, steps.length),
    steps,
    status,
    dueLabel,
  });

  const close = () => (router.canGoBack() ? router.back() : router.replace('/professor'));

  const save = (status: Activity['status']) => {
    if (status === 'published') setTriedPublish(true);
    if (errors.title || (status === 'published' && errors.steps)) {
      if (status === 'draft') setTriedPublish(true);
      return;
    }
    saveActivity(buildActivity(status));
    showToast(status === 'published' ? `"${title.trim()}" publicada para o ${className}` : 'Rascunho salvo');
    close();
  };

  const upsertStep = (step: StudyStep) =>
    setSteps((prev) => (prev.some((item) => item.id === step.id) ? prev.map((item) => (item.id === step.id ? step : item)) : [...prev, step]));

  return (
    <ScreenBackground glows={detailGlows}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 4, paddingBottom: 150 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.appBar}>
          <IconButton icon="chevronLeft" accessibilityLabel="Voltar" onPress={close} />
          <View style={styles.appBarText}>
            <Text style={styles.appBarTitle}>{existing ? 'EDITAR ATIVIDADE' : 'NOVA ATIVIDADE'}</Text>
            <Text style={styles.appBarSubtitle}>para {className}</Text>
          </View>
          <IconButton icon="eye" accessibilityLabel="Pré-visualizar como aluno" onPress={() => setSheet('preview')} />
        </View>

        <TextField
          label="NOME DA ATIVIDADE"
          value={title}
          onChangeText={setTitle}
          placeholder="Ex.: Brasil Colonial"
          error={triedPublish ? errors.title : undefined}
        />

        <View style={styles.section}>
          <SectionLabel label="MATÉRIA" />
          <SubjectPicker selected={[subjectId]} onToggle={setSubjectId} />
        </View>

        <View style={styles.section}>
          <SectionLabel label="TIPO DE ATIVIDADE" />
          <SegmentedControl
            height={40}
            fontSize={13}
            value={type}
            onChange={setType}
            options={(
              [
                ['trilha', 'Trilha', 'map'],
                ['quiz', 'Quiz', 'quiz'],
                ['flashcards', 'Flashcards', 'cards'],
              ] as const
            ).map(([value, label, icon]) => ({
              value,
              label,
              renderIcon: (active) => (
                <Glyph name={icon} size={16} strokeWidth={2.8} color={active ? colors.text.onColor : colors.text.secondary} />
              ),
            }))}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={styles.label}>PONTOS</Text>
            <View style={styles.readonlyBox} accessibilityLabel={`Pontos: ${totalPoints} XP, soma das etapas`}>
              <Glyph name="bolt" size={18} color={colors.accent.xpGold} />
              <Text style={styles.boxText}>{formatNumber(totalPoints)} XP</Text>
            </View>
            <Text style={styles.boxHint}>soma das etapas</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.label}>PRAZO</Text>
            <Pressable
              onPress={() => setSheet('due')}
              accessibilityRole="button"
              accessibilityLabel={`Prazo ${dueLabel}. Alterar`}
              style={({ pressed }) => [styles.readonlyBox, pressed && styles.boxPressed]}>
              <Glyph name="calendar" size={18} color={colors.brand.primaryLight} />
              <Text style={styles.boxText} numberOfLines={1}>
                {dueLabel}
              </Text>
            </Pressable>
          </View>
        </View>

        <TextField
          label="DESCRIÇÃO"
          value={description}
          onChangeText={setDescription}
          placeholder="O que o aluno vai aprender nesta atividade?"
          multiline
          minHeight={80}
          maxLength={280}
        />

        <View style={styles.section}>
          <SectionLabel
            label={type === 'trilha' ? 'ETAPAS DA TRILHA' : 'MATERIAIS DE ESTUDO'}
            hint={`${steps.length} ${steps.length === 1 ? 'etapa' : 'etapas'}`}
          />
          {steps.map((step, index) => {
            const tone = STEP_COLORS[index % STEP_COLORS.length];
            const format = materialFormatMeta[step.format];
            return (
              <View key={step.id} style={styles.step}>
                <Pressable
                  onPress={() => setEditingStep(step)}
                  accessibilityRole="button"
                  accessibilityLabel={`Editar etapa ${step.title}`}
                  style={({ pressed }) => [styles.stepMain, pressed && styles.stepPressed]}>
                  <Glyph name="grip" size={20} strokeWidth={3.4} color={colors.text.secondary} />
                  <View style={[styles.stepIcon, { backgroundColor: tone.color }, solidShadow(3, tone.depth)]}>
                    <Glyph
                      name={step.format === 'pdf' ? 'fileText' : 'monitor'}
                      size={18}
                      strokeWidth={2.8}
                      color={colors.bg.base}
                    />
                  </View>
                  <View style={styles.flex}>
                    <Text style={styles.stepTitle} numberOfLines={1}>
                      {step.title}
                    </Text>
                    <Text style={styles.stepMeta} numberOfLines={1}>
                      {format.label} · {step.length} · +{step.points} XP
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => setSteps((prev) => prev.filter((item) => item.id !== step.id))}
                  accessibilityRole="button"
                  accessibilityLabel={`Remover etapa ${step.title}`}
                  hitSlop={6}
                  style={styles.stepTrash}>
                  <Glyph name="trash" size={17} color={colors.text.secondary} />
                </Pressable>
              </View>
            );
          })}
          <DashedButton label="Adicionar etapa" hint="PDF ou slides" onPress={() => setEditingStep('new')} />
          {triedPublish && errors.steps && <Text style={styles.error}>{errors.steps}</Text>}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 20 + insets.bottom }]}>
        <LinearGradient
          colors={['rgba(18,12,34,0)', 'rgba(18,12,34,0.92)', colors.bg.base]}
          locations={[0, 0.45, 1]}
          style={styles.fade}
        />
        <Pressable
          onPress={() => save('draft')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.draftButton, pressed && styles.boxPressed]}>
          <Text style={styles.draftText}>Rascunho</Text>
        </Pressable>
        <View style={styles.flex}>
          <GradientButton size="md" height={56} leadingIcon="send" label="PUBLICAR" onPress={() => save('published')} />
        </View>
      </View>

      {editingStep && (
        <StepEditorSheet
          step={editingStep === 'new' ? undefined : editingStep}
          onSave={upsertStep}
          onClose={() => setEditingStep(null)}
        />
      )}

      {sheet === 'due' && (
        <BottomSheet onClose={() => setSheet(null)}>
          <SheetHeader eyebrow="PRAZO" eyebrowColor={colors.brand.primaryLight} title="Até quando?" onClose={() => setSheet(null)} />
          {dueOptions(Date.now()).map((option) => {
            const selected = option.value === dueLabel;
            return (
              <Pressable
                key={option.label}
                onPress={() => {
                  setDueLabel(option.value);
                  setSheet(null);
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                style={[styles.dueOption, selected && styles.dueOptionSelected]}>
                <Text style={styles.dueLabel}>{option.label}</Text>
                <Text style={styles.dueValue}>{option.value}</Text>
                {selected && <Glyph name="check" size={18} strokeWidth={3} color={colors.accent.success} />}
              </Pressable>
            );
          })}
        </BottomSheet>
      )}

      {sheet === 'preview' && (
        <BottomSheet onClose={() => setSheet(null)}>
          <SheetHeader
            eyebrow="PRÉ-VISUALIZAÇÃO"
            eyebrowColor={colors.accent.manaCyan}
            title="Como o aluno vê"
            onClose={() => setSheet(null)}
          />
          <ActivityCard
            activity={{ ...buildActivity('draft'), title: title.trim() || 'Nome da atividade' }}
            onPress={() => undefined}
          />
          <Text style={styles.previewText}>
            {description.trim() || `Atividade de ${subjects[subjectId].name} preparada pelo seu professor.`}
          </Text>
          {steps.map((step, index) => (
            <View key={step.id} style={styles.previewStep}>
              <Text style={styles.previewStepIndex}>{index + 1}</Text>
              <Text style={styles.previewStepTitle}>{step.title}</Text>
              <Text style={styles.previewStepPoints}>+{step.points} XP</Text>
            </View>
          ))}
        </BottomSheet>
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingHorizontal: 20,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  appBarText: {
    flex: 1,
    alignItems: 'center',
  },
  appBarTitle: {
    fontFamily: fonts.display,
    fontSize: 19,
    letterSpacing: 0.76,
    color: colors.text.primary,
  },
  appBarSubtitle: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  section: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    marginBottom: 6,
    fontFamily: fonts.black,
    fontSize: 11,
    letterSpacing: 1.1,
    color: colors.brand.primaryLight,
  },
  readonlyBox: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  boxPressed: {
    borderColor: colors.brand.primary,
  },
  boxText: {
    flexShrink: 1,
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.text.primary,
  },
  boxHint: {
    marginTop: 4,
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingLeft: 6,
    paddingRight: 8,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  stepMain: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
  },
  stepPressed: {
    opacity: 0.7,
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.text.primary,
  },
  stepMeta: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  stepTrash: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: colors.accent.hpPink,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  fade: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
  draftButton: {
    width: 120,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface2,
  },
  draftText: {
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.text.primary,
  },
  dueOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface2,
  },
  dueOptionSelected: {
    borderColor: colors.accent.success,
  },
  dueLabel: {
    flex: 1,
    fontFamily: fonts.black,
    fontSize: 15,
    color: colors.text.primary,
  },
  dueValue: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
    color: colors.text.secondary,
  },
  previewText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 19,
    color: colors.text.secondary,
  },
  previewStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.bg.base,
  },
  previewStepIndex: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.brand.primaryLight,
  },
  previewStepTitle: {
    flex: 1,
    fontFamily: fonts.extraBold,
    fontSize: 13,
    color: colors.text.primary,
  },
  previewStepPoints: {
    fontFamily: fonts.black,
    fontSize: 12,
    color: colors.accent.success,
  },
});
