import { toQuestion } from '@/lib/flashcards';
import { shuffle } from '@/lib/random';
import type { Flashcard, SubjectId } from '@/types/game';

export const DUEL_QUESTION_COUNTS = [5, 10, 15] as const;
export const DUEL_BETS = [25, 50, 100] as const;

/** Quem vence o duelo "rouba" do colega 10 XP por pergunta da matéria disputada. */
const XP_PER_DUEL_QUESTION = 10;

export const duelXpStake = (questionCount: number) => questionCount * XP_PER_DUEL_QUESTION;

export type DuelOutcome = 'won' | 'lost' | 'draw';

export function duelOutcome(myScore: number, rivalScore: number): DuelOutcome {
  if (myScore === rivalScore) return 'draw';
  return myScore > rivalScore ? 'won' : 'lost';
}

/** Perguntas do duelo: qualquer card da matéria, sem alterar o progresso dos flashcards. */
export function buildDuelRound(cards: Flashcard[], subjectId: SubjectId, questionCount: number) {
  const pool = cards.filter((card) => card.subjectId === subjectId);
  return shuffle(pool).slice(0, questionCount).map(toQuestion);
}

/** "termina em 2d 14h" a partir do fim da temporada. */
export function formatSeasonRemaining(endsAt: number, now: number) {
  const minutes = Math.floor((endsAt - now) / 60_000);
  if (minutes <= 0) return 'encerrada';
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  if (days > 0) return `termina em ${days}d ${hours}h`;
  return `termina em ${hours}h ${minutes % 60}min`;
}
