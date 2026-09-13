import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { QuizRunner } from '@/components/quiz/QuizRunner';
import { ResultLayout } from '@/components/quiz/ResultLayout';
import { VersusPanel } from '@/components/ranking/VersusPanel';
import { BottomSheet, SheetHeader } from '@/components/ui/BottomSheet';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { Glyph } from '@/components/ui/Glyph';
import { SubjectTag } from '@/components/ui/SubjectTag';
import { colors, fonts } from '@/constants/theme';
import { subjects } from '@/data/mock';
import { buildDuelRound, duelXpStake } from '@/lib/duel';
import { formatNumber } from '@/lib/progression';
import { useGame, type DuelResult } from '@/store/GameProvider';

const outcomeMeta = {
  won: { title: 'VITÓRIA!', color: colors.accent.success },
  lost: { title: 'DERROTA', color: colors.accent.hpPink },
  draw: { title: 'EMPATE', color: colors.accent.xpGold },
} as const;

export default function DuelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { student, avatar, challenges, getClassmate, finishDuel } = useGame();

  const challenge = challenges.find((item) => item.id === id);
  const rival = challenge ? getClassmate(challenge.rivalId) : undefined;

  const [questions] = useState(() =>
    challenge ? buildDuelRound(challenge.subjectId, challenge.questionCount) : [],
  );
  const score = useRef(0);
  const [hits, setHits] = useState(0);
  const [result, setResult] = useState<DuelResult | null>(null);
  const [confirmQuit, setConfirmQuit] = useState(false);

  const backToRanking = () => (router.canGoBack() ? router.back() : router.replace('/ranking'));

  const finish = () => {
    if (!challenge) return;
    setConfirmQuit(false);
    setResult(finishDuel(challenge.id, score.current));
  };

  if (result && challenge && rival) {
    const meta = outcomeMeta[result.outcome];
    const subjectName = subjects[challenge.subjectId].name;
    const firstName = rival.name.split(' ')[0];
    const coinsText = {
      won: `+${challenge.bet * 2} C$ — você levou o dobro da aposta`,
      lost: `−${challenge.bet} C$ — a aposta ficou com ${firstName}`,
      draw: `${challenge.bet} C$ devolvidos — ninguém levou a aposta`,
    }[result.outcome];
    const xpText = {
      won: `+${formatNumber(result.xpDelta)} XP de ${subjectName} roubados de ${firstName}`,
      lost: `−${formatNumber(Math.abs(result.xpDelta))} XP de ${subjectName} para ${firstName}`,
      draw: 'Ninguém perdeu XP desta vez',
    }[result.outcome];

    return (
      <ResultLayout
        eyebrow={`DUELO DE ${subjectName.toUpperCase()}`}
        title={meta.title}
        titleColor={meta.color}
        actionLabel="VOLTAR PARA O RANKING"
        onAction={backToRanking}>
        <VersusPanel
          me={{ name: student.name, avatar, caption: 'Você', score: result.myScore }}
          rival={{ name: rival.name, avatar: rival.avatar, caption: rival.classroom, score: result.rivalScore }}
        />
        <View style={styles.rewards}>
          <View style={styles.rewardRow}>
            <Glyph name="coin" size={18} strokeWidth={2.8} color={colors.accent.xpGold} />
            <Text style={styles.rewardText}>{coinsText}</Text>
          </View>
          <View style={styles.rewardRow}>
            <Glyph name="bolt" size={18} color={meta.color} />
            <Text style={styles.rewardText}>{xpText}</Text>
          </View>
        </View>
      </ResultLayout>
    );
  }

  if (!challenge || !rival || challenge.status !== 'accepted' || questions.length === 0) {
    return (
      <ResultLayout
        eyebrow="DUELO"
        title="DUELO INDISPONÍVEL"
        message="Este desafio não está mais em andamento. Aceite um convite no Ranking para jogar."
        actionLabel="VOLTAR PARA O RANKING"
        onAction={backToRanking}
      />
    );
  }

  return (
    <>
      <QuizRunner
        questions={questions}
        closeLabel="Desistir do duelo"
        onClose={() => setConfirmQuit(true)}
        hud={
          <View style={styles.hud}>
            <Glyph name="check" size={14} strokeWidth={3} color={colors.accent.success} />
            <Text style={styles.hudText}>{hits}</Text>
          </View>
        }
        renderBadges={() => (
          <>
            <SubjectTag subject={subjects[challenge.subjectId]} />
            <Text style={styles.versus} numberOfLines={1}>
              vs {rival.name} · vale {duelXpStake(challenge.questionCount)} XP
            </Text>
          </>
        )}
        onAnswer={(_, correct) => {
          if (correct) {
            score.current += 1;
            setHits(score.current);
          }
          return { detail: correct ? 'Mais um ponto no placar do duelo!' : 'Essa não contou ponto.' };
        }}
        onComplete={finish}
      />

      {confirmQuit && (
        <BottomSheet onClose={() => setConfirmQuit(false)}>
          <SheetHeader
            eyebrow="DUELO"
            eyebrowColor={colors.brand.magenta}
            title="Desistir agora?"
            onClose={() => setConfirmQuit(false)}
          />
          <Text style={styles.quitText}>
            O duelo termina com {hits} {hits === 1 ? 'acerto' : 'acertos'} e as perguntas restantes contam como erro.
            {' '}
            {rival.name.split(' ')[0]} fez {challenge.rivalScore ?? 0}.
          </Text>
          <View style={styles.quitActions}>
            <ChunkyButton
              variant="outline"
              label="CONTINUAR"
              height={50}
              fontSize={16}
              style={styles.quitButton}
              onPress={() => setConfirmQuit(false)}
            />
            <ChunkyButton
              label="DESISTIR"
              height={50}
              fontSize={16}
              color={colors.accent.hpPink}
              depthColor={colors.depth.pink}
              textColor={colors.bg.base}
              style={styles.quitButton}
              onPress={finish}
            />
          </View>
        </BottomSheet>
      )}
    </>
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
    color: colors.accent.success,
  },
  versus: {
    flexShrink: 1,
    fontFamily: fonts.bold,
    fontSize: 12,
    color: '#F0ABFC',
  },
  rewards: {
    gap: 10,
    padding: 14,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rewardText: {
    flex: 1,
    fontFamily: fonts.extraBold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.primary,
  },
  quitText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  quitActions: {
    flexDirection: 'row',
    gap: 10,
  },
  quitButton: {
    flex: 1,
  },
});
