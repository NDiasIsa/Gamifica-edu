import { colors } from '@/constants/theme';
import { shuffle } from '@/lib/random';
import type { CardProgress, CardState, DailyFlashcardStats, Flashcard, SubjectId, Topic } from '@/types/game';

const DAY = 86_400_000;

/** XP por acerto em cada estado: quanto mais o aluno já domina o card, menos ele vale. */
export const CARD_XP: Record<CardState, number> = {
  novo: 20,
  aprendendo: 10,
  revisar: 5,
};

/** Limite diário de XP vindo dos flashcards, para incentivar o uso equilibrado do app. */
export const DAILY_FLASHCARD_XP_LIMIT = 500;

export const ROUND_SIZES = [5, 10, 15] as const;

export const cardStateMeta: Record<CardState, { label: string; plural: string; color: string }> = {
  novo: { label: 'Novo', plural: 'novos', color: colors.accent.manaCyan },
  aprendendo: { label: 'Aprendendo', plural: 'aprendendo', color: colors.accent.hpPink },
  revisar: { label: 'Revisar', plural: 'revisar', color: colors.accent.success },
};

export const cardStateOrder: CardState[] = ['novo', 'aprendendo', 'revisar'];

export function cardState(progress: CardProgress | undefined): CardState {
  return progress?.state ?? 'novo';
}

/** Cards novos sempre entram; os demais só quando chega a hora de revisar. */
export function isCardAvailable(progress: CardProgress | undefined, now: number) {
  return !progress || progress.dueAt <= now;
}

/** Dia local no formato YYYY-MM-DD. */
export function todayKey(now: number) {
  const date = new Date(now);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function dailyStatsFor(stats: DailyFlashcardStats, now: number): DailyFlashcardStats {
  const date = todayKey(now);
  return stats.date === date ? stats : { date, xp: 0, cards: 0 };
}

/** XP que um acerto rende agora, respeitando o limite diário. */
export function xpForAnswer(state: CardState, correct: boolean, xpToday: number) {
  if (!correct) return 0;
  return Math.max(0, Math.min(CARD_XP[state], DAILY_FLASHCARD_XP_LIMIT - xpToday));
}

/**
 * Repetição espaçada simplificada:
 * - novo → aprendendo (volta amanhã)
 * - aprendendo → revisar (volta em 3 dias)
 * - revisar → revisar com intervalo dobrando (6, 12, 24… até 30 dias)
 * Errou? O card volta para "aprendendo" e já pode aparecer na próxima rodada.
 */
export function nextCardProgress(
  previous: CardProgress | undefined,
  correct: boolean,
  xpGained: number,
  now: number,
): CardProgress {
  const xpEarned = (previous?.xpEarned ?? 0) + xpGained;

  if (!correct) {
    return { state: 'aprendendo', reviews: 0, dueAt: now, xpEarned };
  }

  const state = cardState(previous);
  if (state === 'novo') {
    return { state: 'aprendendo', reviews: 0, dueAt: now + DAY, xpEarned };
  }
  if (state === 'aprendendo') {
    return { state: 'revisar', reviews: 1, dueAt: now + 3 * DAY, xpEarned };
  }

  const reviews = (previous?.reviews ?? 0) + 1;
  const intervalDays = Math.min(3 * 2 ** (reviews - 1), 30);
  return { state: 'revisar', reviews, dueAt: now + intervalDays * DAY, xpEarned };
}

export type DeckStats = {
  topicCount: number;
  cardCount: number;
  xpEarned: number;
  byState: Record<CardState, number>;
};

export function deckStats(
  subjectId: SubjectId,
  allTopics: Topic[],
  cards: Flashcard[],
  progress: Record<string, CardProgress>,
): DeckStats {
  const subjectCards = cards.filter((card) => card.subjectId === subjectId);
  const byState: Record<CardState, number> = { novo: 0, aprendendo: 0, revisar: 0 };
  let xpEarned = 0;

  for (const card of subjectCards) {
    const cardProgress = progress[card.id];
    byState[cardState(cardProgress)] += 1;
    xpEarned += cardProgress?.xpEarned ?? 0;
  }

  return {
    topicCount: allTopics.filter((topic) => topic.subjectId === subjectId).length,
    cardCount: subjectCards.length,
    xpEarned,
    byState,
  };
}

export type RoundQuestion = {
  card: Flashcard;
  options: string[];
  correctIndex: number;
};

export function toQuestion(card: Flashcard): RoundQuestion {
  const options = shuffle([card.answer, ...card.distractors]);
  return { card, options, correctIndex: options.indexOf(card.answer) };
}

export function availableCards(
  cards: Flashcard[],
  progress: Record<string, CardProgress>,
  topicIds: string[],
  now: number,
) {
  return cards.filter((card) => topicIds.includes(card.topicId) && isCardAvailable(progress[card.id], now));
}

/** Monta a rodada com cards disponíveis dos tópicos escolhidos, em ordem aleatória. */
export function buildRound(
  cards: Flashcard[],
  progress: Record<string, CardProgress>,
  topicIds: string[],
  size: number,
  now: number,
) {
  return shuffle(availableCards(cards, progress, topicIds, now)).slice(0, size).map(toQuestion);
}
