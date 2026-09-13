import { LinearGradient } from 'expo-linear-gradient';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glyph } from '@/components/ui/Glyph';
import { GradientButton } from '@/components/ui/GradientButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { detailGlows, ScreenBackground } from '@/components/ui/ScreenBackground';
import { colors, fonts, solidShadow, withAlpha } from '@/constants/theme';
import type { RoundQuestion } from '@/lib/flashcards';

export type AnswerFeedback = {
  /** Linha de apoio abaixo de "ACERTOU!" / "ERROU!" (ex.: "+20 XP"). */
  detail: string;
};

type QuizRunnerProps = {
  questions: RoundQuestion[];
  /** Conteúdo à direita da barra de progresso (placar, XP da rodada…). */
  hud: ReactNode;
  closeLabel: string;
  onClose: () => void;
  /** Tags exibidas acima do enunciado. */
  renderBadges: (question: RoundQuestion) => ReactNode;
  onAnswer: (question: RoundQuestion, correct: boolean) => AnswerFeedback;
  onComplete: () => void;
};

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export function QuizRunner({ questions, hud, closeLabel, onClose, renderBadges, onAnswer, onComplete }: QuizRunnerProps) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);

  const question = questions[index];
  const answered = selected !== null;
  const isLast = index === questions.length - 1;
  const correct = answered && selected === question.correctIndex;

  const choose = (optionIndex: number) => {
    if (answered) return;
    setSelected(optionIndex);
    setFeedback(onAnswer(question, optionIndex === question.correctIndex));
  };

  const next = () => {
    if (isLast) {
      onComplete();
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
    setFeedback(null);
  };

  return (
    <ScreenBackground glows={detailGlows}>
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={closeLabel}>
          <Glyph name="close" size={20} strokeWidth={2.8} color={colors.text.primary} />
        </Pressable>
        <View style={styles.progress}>
          <Text style={styles.progressLabel}>
            PERGUNTA {index + 1} DE {questions.length}
          </Text>
          <ProgressBar
            ratio={(index + (answered ? 1 : 0)) / questions.length}
            color={colors.brand.primary}
            size="lg"
          />
        </View>
        {hud}
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 200 + insets.bottom }]}
        showsVerticalScrollIndicator={false}>
        <Animated.View key={question.card.id} entering={FadeInDown.duration(220)} style={styles.questionWrap}>
          <LinearGradient
            colors={[colors.depth.deep, colors.bg.surface2]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.questionCard}>
            <View style={styles.badges}>{renderBadges(question)}</View>
            <Text style={styles.questionText}>{question.card.question}</Text>
          </LinearGradient>

          <View style={styles.options}>
            {question.options.map((option, optionIndex) => {
              const isCorrect = optionIndex === question.correctIndex;
              const isSelected = optionIndex === selected;
              const tone = !answered
                ? null
                : isCorrect
                  ? colors.accent.success
                  : isSelected
                    ? colors.accent.hpPink
                    : null;

              return (
                <Pressable
                  key={option}
                  onPress={() => choose(optionIndex)}
                  disabled={answered}
                  accessibilityRole="button"
                  accessibilityLabel={`Alternativa ${LETTERS[optionIndex]}: ${option}`}
                  style={({ pressed }) => [
                    styles.option,
                    tone && { borderColor: tone, backgroundColor: withAlpha(tone, 0.14) },
                    answered && !tone && styles.optionDimmed,
                    pressed && styles.optionPressed,
                  ]}>
                  <View style={[styles.letter, tone && { backgroundColor: tone }]}>
                    <Text style={[styles.letterText, tone && { color: colors.bg.base }]}>{LETTERS[optionIndex]}</Text>
                  </View>
                  <Text style={styles.optionText}>{option}</Text>
                  {tone && (
                    <Glyph name={isCorrect ? 'check' : 'close'} size={20} strokeWidth={3} color={tone} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      {answered && feedback && (
        <Animated.View
          entering={SlideInDown.duration(220)}
          style={[
            styles.feedback,
            { paddingBottom: 20 + insets.bottom, borderTopColor: correct ? colors.accent.success : colors.accent.hpPink },
          ]}>
          <View style={styles.feedbackRow}>
            <View
              style={[
                styles.feedbackIcon,
                { backgroundColor: correct ? colors.accent.success : colors.accent.hpPink },
              ]}>
              <Glyph name={correct ? 'check' : 'close'} size={22} strokeWidth={3.2} color={colors.bg.base} />
            </View>
            <View style={styles.feedbackText}>
              <Text style={[styles.feedbackTitle, { color: correct ? colors.accent.success : colors.accent.hpPink }]}>
                {correct ? 'ACERTOU!' : 'NÃO FOI DESSA VEZ'}
              </Text>
              {!correct && (
                <Text style={styles.feedbackDetail}>Resposta certa: {question.options[question.correctIndex]}</Text>
              )}
              <Text style={styles.feedbackDetail}>{feedback.detail}</Text>
            </View>
          </View>
          <GradientButton size="md" label={isLast ? 'VER RESULTADO' : 'CONTINUAR'} onPress={next} />
        </Animated.View>
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  closeButton: {
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
  progress: {
    flex: 1,
    gap: 6,
  },
  progressLabel: {
    fontFamily: fonts.black,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.brand.primaryLight,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  questionWrap: {
    gap: 16,
  },
  questionCard: {
    gap: 12,
    padding: 18,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.brand.primary,
    ...solidShadow(5, colors.depth.header),
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  questionText: {
    fontFamily: fonts.black,
    fontSize: 20,
    lineHeight: 27,
    color: colors.text.primary,
  },
  options: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
    ...solidShadow(4, colors.depth.card),
  },
  optionDimmed: {
    opacity: 0.45,
  },
  optionPressed: {
    transform: [{ translateY: 2 }],
  },
  letter: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg.base,
  },
  letterText: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.brand.primaryLight,
  },
  optionText: {
    flex: 1,
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: colors.text.primary,
  },
  feedback: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: 14,
    paddingTop: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 2,
    backgroundColor: colors.bg.surface,
    boxShadow: '0px -16px 40px rgba(0,0,0,0.45)',
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  feedbackIcon: {
    width: 44,
    height: 44,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackText: {
    flex: 1,
    gap: 2,
  },
  feedbackTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
  },
  feedbackDetail: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.text.secondary,
  },
});
