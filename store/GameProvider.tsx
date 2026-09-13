import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { createInitialCardProgress } from '@/data/flashcards';
import {
  classmates,
  CURRENT_STUDENT_ID,
  getActivity,
  initialChallenges,
  initialFlashcardDaily,
  initialStudent,
  rankingMembers,
} from '@/data/mock';
import { getCosmetic } from '@/data/cosmetics';
import { buildAvatar } from '@/lib/cosmetics';
import { duelOutcome, duelXpStake, type DuelOutcome } from '@/lib/duel';
import { cardState, dailyStatsFor, nextCardProgress, todayKey, xpForAnswer } from '@/lib/flashcards';
import { coinsForStep, playerLevel } from '@/lib/progression';
import type {
  AvatarPalette,
  CardProgress,
  CardState,
  Challenge,
  DailyFlashcardStats,
  RankingEntry,
  RankingScope,
  Student,
  SubjectId,
} from '@/types/game';

export type FlashcardAnswerResult = {
  xp: number;
  previousState: CardState;
  /** O limite diário impediu parte (ou todo) o XP deste acerto. */
  limitReached: boolean;
};

export type DuelResult = {
  outcome: DuelOutcome;
  myScore: number;
  rivalScore: number;
  /** Variação líquida de moedas em relação a antes do duelo. */
  coinsDelta: number;
  /** XP roubado (positivo) ou perdido (negativo) na matéria do duelo. */
  xpDelta: number;
};

export type NewChallenge = {
  rivalId: string;
  subjectId: SubjectId;
  questionCount: number;
  bet: number;
};

type GameContextValue = {
  student: Student;
  totalXp: number;
  level: ReturnType<typeof playerLevel>;
  rankings: Record<RankingScope, RankingEntry[]>;
  positions: Record<RankingScope, number>;
  classPosition: number;
  isStepCompleted: (stepId: string) => boolean;
  /** Marca uma etapa como estudada e credita XP na matéria + moedas. */
  completeStep: (activityId: string, stepId: string) => void;

  cardProgress: Record<string, CardProgress>;
  flashcardDaily: DailyFlashcardStats;
  /** Registra a resposta de um flashcard: atualiza o estado do card, XP e contadores do dia. */
  answerFlashcard: (cardId: string, subjectId: SubjectId, correct: boolean) => FlashcardAnswerResult;

  challenges: Challenge[];
  getClassmate: (id: string) => RankingEntry | undefined;
  /** Envia um desafio e reserva a aposta. Retorna false se faltar moeda. */
  sendChallenge: (input: NewChallenge) => boolean;
  /** Cancela um desafio enviado e devolve a aposta. */
  cancelChallenge: (challengeId: string) => void;
  declineChallenge: (challengeId: string) => void;
  /** Aceita um convite pagando a aposta. Retorna false se faltar moeda. */
  acceptChallenge: (challengeId: string) => boolean;
  /** Encerra o duelo com a pontuação do aluno e aplica moedas e XP. */
  finishDuel: (challengeId: string, myScore: number) => DuelResult | null;

  /** Personagem com os itens equipados. */
  avatar: AvatarPalette;
  /** Compra e já equipa o item. Retorna false se faltar nível ou moeda. */
  buyCosmetic: (cosmeticId: string) => boolean;
  equipCosmetic: (cosmeticId: string) => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student>(initialStudent);
  const [cardProgress, setCardProgress] = useState(() => createInitialCardProgress(Date.now()));
  const [dailyStats, setDailyStats] = useState(() => initialFlashcardDaily(todayKey(Date.now())));
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  /** XP ganho/perdido pelos colegas em duelos. */
  const [classmateXpDelta, setClassmateXpDelta] = useState<Record<string, number>>({});

  const addSubjectXp = useCallback((subjectId: SubjectId, amount: number) => {
    setStudent((prev) => ({
      ...prev,
      subjectXp: { ...prev.subjectXp, [subjectId]: Math.max(0, prev.subjectXp[subjectId] + amount) },
    }));
  }, []);

  const addCoins = useCallback((amount: number) => {
    setStudent((prev) => ({ ...prev, coins: prev.coins + amount }));
  }, []);

  const updateChallenge = useCallback((challengeId: string, patch: Partial<Challenge>) => {
    setChallenges((prev) => prev.map((item) => (item.id === challengeId ? { ...item, ...patch } : item)));
  }, []);

  const completeStep = useCallback((activityId: string, stepId: string) => {
    const activity = getActivity(activityId);
    const step = activity?.steps.find((item) => item.id === stepId);
    if (!activity || !step) return;

    setStudent((prev) => {
      if (prev.completedStepIds.includes(stepId)) return prev;
      return {
        ...prev,
        coins: prev.coins + coinsForStep(step),
        subjectXp: {
          ...prev.subjectXp,
          [activity.subjectId]: prev.subjectXp[activity.subjectId] + step.points,
        },
        completedStepIds: [...prev.completedStepIds, stepId],
      };
    });
  }, []);

  // As respostas acontecem uma por vez (toque do aluno), então o estado lido aqui está sempre atualizado.
  const answerFlashcard = useCallback(
    (cardId: string, subjectId: SubjectId, correct: boolean): FlashcardAnswerResult => {
      const now = Date.now();
      const today = dailyStatsFor(dailyStats, now);
      const previous = cardProgress[cardId];
      const previousState = cardState(previous);
      const xp = xpForAnswer(previousState, correct, today.xp);

      setCardProgress((prev) => ({ ...prev, [cardId]: nextCardProgress(previous, correct, xp, now) }));
      setDailyStats({ date: today.date, xp: today.xp + xp, cards: today.cards + 1 });
      if (xp > 0) addSubjectXp(subjectId, xp);

      return { xp, previousState, limitReached: correct && xp === 0 };
    },
    [cardProgress, dailyStats, addSubjectXp],
  );

  const sendChallenge = useCallback(
    ({ rivalId, subjectId, questionCount, bet }: NewChallenge) => {
      if (student.coins < bet) return false;
      addCoins(-bet);
      setChallenges((prev) => [
        ...prev,
        {
          id: `desafio-${rivalId}-${Date.now()}`,
          rivalId,
          direction: 'sent',
          subjectId,
          questionCount,
          bet,
          status: 'pending',
        },
      ]);
      return true;
    },
    [student.coins, addCoins],
  );

  const cancelChallenge = useCallback(
    (challengeId: string) => {
      const challenge = challenges.find((item) => item.id === challengeId);
      if (!challenge || challenge.direction !== 'sent' || challenge.status !== 'pending') return;
      addCoins(challenge.bet);
      setChallenges((prev) => prev.filter((item) => item.id !== challengeId));
    },
    [challenges, addCoins],
  );

  const declineChallenge = useCallback((challengeId: string) => {
    setChallenges((prev) =>
      prev.filter((item) => !(item.id === challengeId && item.direction === 'received' && item.status === 'pending')),
    );
  }, []);

  const acceptChallenge = useCallback(
    (challengeId: string) => {
      const challenge = challenges.find((item) => item.id === challengeId);
      if (!challenge || challenge.direction !== 'received') return false;
      if (challenge.status === 'accepted') return true;
      if (challenge.status !== 'pending' || student.coins < challenge.bet) return false;
      addCoins(-challenge.bet);
      updateChallenge(challengeId, { status: 'accepted' });
      return true;
    },
    [challenges, student.coins, addCoins, updateChallenge],
  );

  const finishDuel = useCallback(
    (challengeId: string, myScore: number): DuelResult | null => {
      const challenge = challenges.find((item) => item.id === challengeId);
      if (!challenge || challenge.status !== 'accepted') return null;

      const rivalScore = challenge.rivalScore ?? 0;
      const outcome = duelOutcome(myScore, rivalScore);
      const stake = duelXpStake(challenge.questionCount);
      const rival = classmates[challenge.rivalId];
      let coinsDelta = 0;
      let xpDelta = 0;

      if (outcome === 'won') {
        // Quem vence leva o dobro da aposta e rouba o XP em jogo (até o que o colega tiver).
        xpDelta = Math.min(stake, Math.max(0, rival.xp + (classmateXpDelta[rival.id] ?? 0)));
        coinsDelta = challenge.bet;
        addCoins(challenge.bet * 2);
      } else if (outcome === 'lost') {
        xpDelta = -Math.min(stake, student.subjectXp[challenge.subjectId]);
        coinsDelta = -challenge.bet;
      } else {
        addCoins(challenge.bet);
      }

      if (xpDelta !== 0) {
        addSubjectXp(challenge.subjectId, xpDelta);
        setClassmateXpDelta((prev) => ({ ...prev, [rival.id]: (prev[rival.id] ?? 0) - xpDelta }));
      }
      updateChallenge(challengeId, { status: outcome, myScore });

      return { outcome, myScore, rivalScore, coinsDelta, xpDelta };
    },
    [challenges, classmateXpDelta, student.subjectXp, addCoins, addSubjectXp, updateChallenge],
  );

  const equipCosmetic = useCallback((cosmeticId: string) => {
    const item = getCosmetic(cosmeticId);
    if (!item) return;
    setStudent((prev) =>
      prev.ownedCosmeticIds.includes(cosmeticId)
        ? { ...prev, equippedCosmetics: { ...prev.equippedCosmetics, [item.category]: cosmeticId } }
        : prev,
    );
  }, []);

  const buyCosmetic = useCallback(
    (cosmeticId: string) => {
      const item = getCosmetic(cosmeticId);
      if (!item || student.ownedCosmeticIds.includes(cosmeticId)) return false;
      const level = playerLevel(Object.values(student.subjectXp).reduce((sum, xp) => sum + xp, 0)).level;
      if ((item.requiredLevel && level < item.requiredLevel) || student.coins < item.price) return false;

      setStudent((prev) => ({
        ...prev,
        coins: prev.coins - item.price,
        ownedCosmeticIds: [...prev.ownedCosmeticIds, cosmeticId],
        equippedCosmetics: { ...prev.equippedCosmetics, [item.category]: cosmeticId },
      }));
      return true;
    },
    [student],
  );

  const value = useMemo<GameContextValue>(() => {
    const totalXp = Object.values(student.subjectXp).reduce((sum, xp) => sum + xp, 0);
    const avatar = buildAvatar(student.equippedCosmetics);

    const classmateEntry = (id: string): RankingEntry | undefined => {
      const classmate = classmates[id];
      if (!classmate) return undefined;
      return { ...classmate, xp: Math.max(0, classmate.xp + (classmateXpDelta[id] ?? 0)) };
    };

    const me: RankingEntry = {
      id: CURRENT_STUDENT_ID,
      name: student.name,
      classroom: student.classroom,
      xp: totalXp,
      avatar,
      isCurrentStudent: true,
    };

    const buildRanking = (scope: RankingScope) =>
      [...rankingMembers[scope].flatMap((id) => classmateEntry(id) ?? []), me].sort((a, b) => b.xp - a.xp);

    const rankings = { turma: buildRanking('turma'), instituicao: buildRanking('instituicao') };
    const positionIn = (scope: RankingScope) => rankings[scope].findIndex((entry) => entry.isCurrentStudent) + 1;
    const positions = { turma: positionIn('turma'), instituicao: positionIn('instituicao') };

    return {
      student,
      totalXp,
      level: playerLevel(totalXp),
      rankings,
      positions,
      classPosition: positions.turma,
      isStepCompleted: (stepId) => student.completedStepIds.includes(stepId),
      completeStep,
      cardProgress,
      flashcardDaily: dailyStatsFor(dailyStats, Date.now()),
      answerFlashcard,
      challenges,
      getClassmate: classmateEntry,
      sendChallenge,
      cancelChallenge,
      declineChallenge,
      acceptChallenge,
      finishDuel,
      avatar,
      buyCosmetic,
      equipCosmetic,
    };
  }, [
    student,
    classmateXpDelta,
    cardProgress,
    dailyStats,
    challenges,
    completeStep,
    answerFlashcard,
    sendChallenge,
    cancelChallenge,
    declineChallenge,
    acceptChallenge,
    finishDuel,
    buyCosmetic,
    equipCosmetic,
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame deve ser usado dentro de <GameProvider>');
  return context;
}
