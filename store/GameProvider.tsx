import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { createInitialCardProgress } from '@/data/flashcards';
import { CURRENT_STUDENT_ID, initialChallenges, initialFlashcardDaily, initialStudent } from '@/data/mock';
import { buildAvatar } from '@/lib/cosmetics';
import { duelOutcome, duelXpStake, type DuelOutcome } from '@/lib/duel';
import { cardState, dailyStatsFor, nextCardProgress, todayKey, xpForAnswer } from '@/lib/flashcards';
import { coinsForStep, playerLevel } from '@/lib/progression';
import { totalXp as sumXp } from '@/lib/school';
import { useSchool } from '@/store/SchoolProvider';
import type {
  Activity,
  AvatarPalette,
  CardProgress,
  CardState,
  Challenge,
  DailyFlashcardStats,
  RankingEntry,
  RankingScope,
  Student,
  StudentState,
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
  /** Atividades publicadas pelo professor para a turma do aluno. */
  activities: Activity[];
  /** Marca uma etapa como estudada e credita XP na matéria + moedas. */
  completeStep: (activityId: string, stepId: string) => void;

  cardProgress: Record<string, CardProgress>;
  flashcardDaily: DailyFlashcardStats;
  /** Registra a resposta de um flashcard: atualiza o estado do card, XP e contadores do dia. */
  answerFlashcard: (cardId: string, subjectId: SubjectId, correct: boolean) => FlashcardAnswerResult;

  challenges: Challenge[];
  getClassmate: (id: string) => RankingEntry | undefined;
  /** Colegas só podem ser desafiados se forem da mesma turma. */
  canChallenge: (classmateId: string) => boolean;
  /** Envia um desafio e reserva a aposta. Retorna false se faltar moeda ou o colega for de outra turma. */
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

const emptyXp: Record<SubjectId, number> = { matematica: 0, portugues: 0, historia: 0, ciencias: 0 };

export function GameProvider({ children }: { children: ReactNode }) {
  const school = useSchool();
  const { roster, getStudent, getClass, addXp, activities, cosmetics, recordSale } = school;

  const [studentState, setStudentState] = useState<StudentState>(initialStudent);
  const [cardProgress, setCardProgress] = useState(() => createInitialCardProgress(Date.now()));
  const [dailyStats, setDailyStats] = useState(() => initialFlashcardDaily(todayKey(Date.now())));
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);

  // O XP da aluna fica no cadastro da escola, para o professor enxergar (e dar bônus) na hora.
  const record = getStudent(CURRENT_STUDENT_ID);
  const subjectXp = record?.subjectXp ?? emptyXp;

  const addCoins = useCallback((amount: number) => {
    setStudentState((prev) => ({ ...prev, coins: prev.coins + amount }));
  }, []);

  const updateChallenge = useCallback((challengeId: string, patch: Partial<Challenge>) => {
    setChallenges((prev) => prev.map((item) => (item.id === challengeId ? { ...item, ...patch } : item)));
  }, []);

  const completeStep = useCallback(
    (activityId: string, stepId: string) => {
      const activity = activities.find((item) => item.id === activityId);
      const step = activity?.steps.find((item) => item.id === stepId);
      if (!activity || !step || studentState.completedStepIds.includes(stepId)) return;

      setStudentState((prev) => ({
        ...prev,
        coins: prev.coins + coinsForStep(step),
        completedStepIds: [...prev.completedStepIds, stepId],
      }));
      addXp(CURRENT_STUDENT_ID, activity.subjectId, step.points);
    },
    [activities, studentState.completedStepIds, addXp],
  );

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
      if (xp > 0) addXp(CURRENT_STUDENT_ID, subjectId, xp);

      return { xp, previousState, limitReached: correct && xp === 0 };
    },
    [cardProgress, dailyStats, addXp],
  );

  const canChallenge = useCallback(
    (classmateId: string) =>
      classmateId !== CURRENT_STUDENT_ID && getStudent(classmateId)?.classId === studentState.classId,
    [getStudent, studentState.classId],
  );

  const sendChallenge = useCallback(
    ({ rivalId, subjectId, questionCount, bet }: NewChallenge) => {
      if (studentState.coins < bet || !canChallenge(rivalId)) return false;
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
    [studentState.coins, canChallenge, addCoins],
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
      if (challenge.status !== 'pending' || studentState.coins < challenge.bet) return false;
      addCoins(-challenge.bet);
      updateChallenge(challengeId, { status: 'accepted' });
      return true;
    },
    [challenges, studentState.coins, addCoins, updateChallenge],
  );

  const finishDuel = useCallback(
    (challengeId: string, myScore: number): DuelResult | null => {
      const challenge = challenges.find((item) => item.id === challengeId);
      if (!challenge || challenge.status !== 'accepted') return null;

      const rivalScore = challenge.rivalScore ?? 0;
      const outcome = duelOutcome(myScore, rivalScore);
      const stake = duelXpStake(challenge.questionCount);
      let coinsDelta = 0;
      let xpDelta = 0;

      if (outcome === 'won') {
        // Quem vence leva o dobro da aposta e rouba o XP em jogo (até o que o colega tiver na matéria).
        xpDelta = -addXp(challenge.rivalId, challenge.subjectId, -stake);
        addXp(CURRENT_STUDENT_ID, challenge.subjectId, xpDelta);
        coinsDelta = challenge.bet;
        addCoins(challenge.bet * 2);
      } else if (outcome === 'lost') {
        xpDelta = addXp(CURRENT_STUDENT_ID, challenge.subjectId, -stake);
        addXp(challenge.rivalId, challenge.subjectId, -xpDelta);
        coinsDelta = -challenge.bet;
      } else {
        addCoins(challenge.bet);
      }

      updateChallenge(challengeId, { status: outcome, myScore });
      return { outcome, myScore, rivalScore, coinsDelta, xpDelta };
    },
    [challenges, addXp, addCoins, updateChallenge],
  );

  const equipCosmetic = useCallback(
    (cosmeticId: string) => {
      const item = cosmetics.find((cosmetic) => cosmetic.id === cosmeticId);
      if (!item) return;
      setStudentState((prev) =>
        prev.ownedCosmeticIds.includes(cosmeticId)
          ? { ...prev, equippedCosmetics: { ...prev.equippedCosmetics, [item.category]: cosmeticId } }
          : prev,
      );
    },
    [cosmetics],
  );

  const buyCosmetic = useCallback(
    (cosmeticId: string) => {
      const item = cosmetics.find((cosmetic) => cosmetic.id === cosmeticId);
      if (!item || !item.active || studentState.ownedCosmeticIds.includes(cosmeticId)) return false;
      const level = playerLevel(sumXp(subjectXp)).level;
      if ((item.requiredLevel && level < item.requiredLevel) || studentState.coins < item.price) return false;

      setStudentState((prev) => ({
        ...prev,
        coins: prev.coins - item.price,
        ownedCosmeticIds: [...prev.ownedCosmeticIds, cosmeticId],
        equippedCosmetics: { ...prev.equippedCosmetics, [item.category]: cosmeticId },
      }));
      recordSale(cosmeticId);
      return true;
    },
    [cosmetics, studentState, subjectXp, recordSale],
  );

  const value = useMemo<GameContextValue>(() => {
    const xp = sumXp(subjectXp);
    const avatar = buildAvatar(studentState.equippedCosmetics, cosmetics);

    const toEntry = (id: string): RankingEntry | undefined => {
      const person = roster.find((item) => item.id === id);
      if (!person) return undefined;
      const isCurrentStudent = person.id === CURRENT_STUDENT_ID;
      return {
        id: person.id,
        name: person.name,
        classId: person.classId,
        classroom: getClass(person.classId)?.name ?? '',
        xp: sumXp(person.subjectXp),
        avatar: isCurrentStudent ? avatar : person.avatar,
        isCurrentStudent,
      };
    };

    const sortByXp = (ids: string[]) =>
      ids.flatMap((id) => toEntry(id) ?? []).sort((a, b) => b.xp - a.xp);

    const rankings = {
      turma: sortByXp(roster.filter((person) => person.classId === studentState.classId).map((person) => person.id)),
      instituicao: sortByXp(roster.map((person) => person.id)),
    };
    const positionIn = (scope: RankingScope) => rankings[scope].findIndex((entry) => entry.isCurrentStudent) + 1;
    const positions = { turma: positionIn('turma'), instituicao: positionIn('instituicao') };

    return {
      student: {
        ...studentState,
        classroom: getClass(studentState.classId)?.name ?? '',
        streakDays: record?.streakDays ?? 0,
        subjectXp,
      },
      totalXp: xp,
      level: playerLevel(xp),
      rankings,
      positions,
      classPosition: positions.turma,
      isStepCompleted: (stepId) => studentState.completedStepIds.includes(stepId),
      activities: activities.filter((item) => item.status === 'published' && item.classId === studentState.classId),
      completeStep,
      cardProgress,
      flashcardDaily: dailyStatsFor(dailyStats, Date.now()),
      answerFlashcard,
      challenges,
      getClassmate: toEntry,
      canChallenge,
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
    studentState,
    subjectXp,
    record?.streakDays,
    roster,
    activities,
    cosmetics,
    getClass,
    cardProgress,
    dailyStats,
    challenges,
    completeStep,
    answerFlashcard,
    canChallenge,
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
