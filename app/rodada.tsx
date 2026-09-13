import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { QuizRunner } from '@/components/quiz/QuizRunner';
import { ResultLayout } from '@/components/quiz/ResultLayout';
import { StatTile } from '@/components/quiz/StatTile';
import { Glyph } from '@/components/ui/Glyph';
import { SubjectTag } from '@/components/ui/SubjectTag';
import { colors, fonts, withAlpha } from '@/constants/theme';
import { flashcards, topics } from '@/data/flashcards';
import { subjects } from '@/data/mock';
import { buildRound, CARD_XP, cardState, cardStateMeta } from '@/lib/flashcards';
import { formatNumber } from '@/lib/progression';
import { useGame } from '@/store/GameProvider';
import type { CardState } from '@/types/game';

type AnswerLog = { previousState: CardState; correct: boolean; xp: number; limitReached: boolean };

export default function FlashcardRoundScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ topicos?: string; quantidade?: string }>();
  const { cardProgress, answerFlashcard } = useGame();

  // A rodada é sorteada uma única vez, ao abrir a tela.
  const [questions] = useState(() =>
    buildRound(
      flashcards,
      cardProgress,
      (params.topicos ?? '').split(',').filter(Boolean),
      Number(params.quantidade) || 10,
      Date.now(),
    ),
  );
  // Estado de cada card no início da rodada: a etiqueta não deve mudar logo após a resposta.
  const [startStates] = useState(() =>
    Object.fromEntries(questions.map(({ card }) => [card.id, cardState(cardProgress[card.id])])),
  );
  const [log, setLog] = useState<AnswerLog[]>([]);
  const [finished, setFinished] = useState(false);

  const exit = () => (router.canGoBack() ? router.back() : router.replace('/flashcards'));

  if (questions.length === 0) {
    return (
      <ResultLayout
        eyebrow="FLASHCARDS"
        title="NADA PARA REVISAR"
        message="Não há cards disponíveis nesses tópicos agora. Volte mais tarde ou escolha outros tópicos."
        actionLabel="VOLTAR PARA FLASHCARDS"
        onAction={exit}
      />
    );
  }

  const roundXp = log.reduce((sum, item) => sum + item.xp, 0);

  if (finished) {
    const hits = log.filter((item) => item.correct).length;
    const learned = log.filter((item) => item.correct && item.previousState === 'novo').length;
    const promoted = log.filter((item) => item.correct && item.previousState === 'aprendendo').length;
    const reviewed = log.filter((item) => item.correct && item.previousState === 'revisar').length;
    const toRetry = log.length - hits;
    const hitLimit = log.some((item) => item.limitReached);

    const rows = [
      { color: cardStateMeta.novo.color, text: `${learned} ${learned === 1 ? 'card novo passou' : 'cards novos passaram'} para "aprendendo"` },
      { color: cardStateMeta.aprendendo.color, text: `${promoted} ${promoted === 1 ? 'card foi' : 'cards foram'} para "revisar"` },
      { color: cardStateMeta.revisar.color, text: `${reviewed} ${reviewed === 1 ? 'revisão concluída' : 'revisões concluídas'}` },
      { color: colors.text.secondary, text: `${toRetry} ${toRetry === 1 ? 'card volta' : 'cards voltam'} para a próxima rodada` },
    ];

    return (
      <ResultLayout
        eyebrow="RODADA CONCLUÍDA"
        title={hits === log.length ? 'PERFEITO!' : hits >= log.length / 2 ? 'MANDOU BEM!' : 'CONTINUE TREINANDO'}
        titleColor={hits >= log.length / 2 ? colors.accent.success : colors.accent.hpPink}
        message="Os cards acertados voltam para revisão nos próximos dias, valendo menos XP."
        actionLabel="VOLTAR PARA FLASHCARDS"
        onAction={exit}>
        <View style={styles.tiles}>
          <StatTile icon="check" color={colors.accent.success} value={`${hits}/${log.length}`} label="Acertos" />
          <StatTile icon="bolt" color={colors.accent.xpGold} value={`+${formatNumber(roundXp)}`} label="XP ganho" />
        </View>
        <View style={styles.panel}>
          {rows.map((row) => (
            <View key={row.text} style={styles.panelRow}>
              <View style={[styles.diamond, { backgroundColor: row.color }]} />
              <Text style={styles.panelText}>{row.text}</Text>
            </View>
          ))}
        </View>
        {hitLimit && (
          <Text style={styles.limitText}>
            Você bateu o limite de XP de hoje. Descanse um pouco: amanhã tem mais!
          </Text>
        )}
      </ResultLayout>
    );
  }

  return (
    <QuizRunner
      questions={questions}
      closeLabel="Sair da rodada"
      onClose={exit}
      hud={
        <View style={styles.hud}>
          <Glyph name="bolt" size={14} color={colors.accent.xpGold} />
          <Text style={styles.hudText}>+{formatNumber(roundXp)}</Text>
        </View>
      }
      renderBadges={({ card }) => {
        const state = startStates[card.id];
        const meta = cardStateMeta[state];
        return (
          <>
            <SubjectTag subject={subjects[card.subjectId]} />
            <Text style={styles.topic} numberOfLines={1}>
              {topics.find((topic) => topic.id === card.topicId)?.name}
            </Text>
            <View style={[styles.statePill, { backgroundColor: withAlpha(meta.color, 0.18) }]}>
              <Text style={[styles.statePillText, { color: meta.color }]}>
                {meta.label.toUpperCase()} · +{CARD_XP[state]} XP
              </Text>
            </View>
          </>
        );
      }}
      onAnswer={({ card }, correct) => {
        const result = answerFlashcard(card.id, card.subjectId, correct);
        setLog((prev) => [...prev, { ...result, correct }]);
        if (!correct) return { detail: 'O card volta como "aprendendo" para você tentar de novo.' };
        if (result.limitReached) return { detail: 'Limite de XP de hoje atingido: este acerto não rendeu XP.' };
        return { detail: `+${result.xp} XP em ${subjects[card.subjectId].name}` };
      }}
      onComplete={() => setFinished(true)}
    />
  );
}

const styles = StyleSheet.create({
  hud: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  hudText: {
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.accent.xpGold,
  },
  topic: {
    flexShrink: 1,
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.brand.primaryLight,
  },
  statePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statePillText: {
    fontFamily: fonts.black,
    fontSize: 10,
    letterSpacing: 0.6,
  },
  tiles: {
    flexDirection: 'row',
    gap: 12,
  },
  panel: {
    gap: 10,
    padding: 14,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  panelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  diamond: {
    width: 8,
    height: 8,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  panelText: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.text.primary,
  },
  limitText: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
    lineHeight: 19,
    color: colors.accent.streak,
    textAlign: 'center',
  },
});
