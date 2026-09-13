import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MissionHeader } from '@/components/activity/MissionHeader';
import { StepCard, type StepStatus } from '@/components/activity/StepCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Icon } from '@/components/ui/Icon';
import { detailGlows, ScreenBackground } from '@/components/ui/ScreenBackground';
import { STICKY_FOOTER_SPACE, StickyFooter } from '@/components/ui/StickyFooter';
import { colors, fonts } from '@/constants/theme';
import { useGame } from '@/store/GameProvider';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { student, activities, completeStep } = useGame();

  const activity = activities.find((item) => item.id === id);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  if (!activity) {
    return (
      <ScreenBackground glows={detailGlows}>
        <View style={[styles.notFound, { paddingTop: insets.top }]}>
          <Text style={styles.notFoundText}>Missão não encontrada.</Text>
          <GradientButton label="VOLTAR" onPress={goBack} />
        </View>
      </ScreenBackground>
    );
  }

  const nextStep = activity.steps.find((step) => !student.completedStepIds.includes(step.id));

  const statusOf = (stepId: string): StepStatus => {
    if (student.completedStepIds.includes(stepId)) return 'completed';
    return stepId === nextStep?.id ? 'next' : 'pending';
  };

  return (
    <ScreenBackground glows={detailGlows}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 4 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.appBar}>
          <Pressable
            onPress={goBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Voltar">
            <Icon name="back" size={22} />
          </Pressable>
          <Text style={styles.appBarTitle}>MISSÃO</Text>
        </View>

        <MissionHeader activity={activity} completedStepIds={student.completedStepIds} />

        <Text style={styles.description}>{activity.description}</Text>

        <Text style={styles.sectionLabel}>
          {activity.type === 'trilha' ? 'ETAPAS DA TRILHA' : 'MATERIAIS DE ESTUDO'}
        </Text>

        <View style={styles.steps}>
          {activity.steps.map((step, index) => (
            <StepCard
              key={step.id}
              step={step}
              index={index}
              status={statusOf(step.id)}
              onPress={() => completeStep(activity.id, step.id)}
            />
          ))}
        </View>
      </ScrollView>

      <StickyFooter>
        <GradientButton
          label={nextStep ? 'INICIAR ATIVIDADE' : 'MISSÃO CONCLUÍDA'}
          disabled={!nextStep}
          onPress={() => nextStep && completeStep(activity.id, nextStep.id)}
        />
      </StickyFooter>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingHorizontal: 20,
    // Mantém a última etapa acima do botão fixo "Iniciar atividade".
    paddingBottom: STICKY_FOOTER_SPACE,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  appBarTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    letterSpacing: 1.08,
    color: colors.text.primary,
  },
  description: {
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 19,
    color: colors.text.secondary,
  },
  sectionLabel: {
    fontFamily: fonts.black,
    fontSize: 11,
    letterSpacing: 1.1,
    color: colors.brand.primaryLight,
  },
  steps: {
    gap: 12,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
  notFoundText: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.text.primary,
    textAlign: 'center',
  },
});
