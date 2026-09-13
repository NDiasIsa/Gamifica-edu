import type { Activity, StudyStep } from '@/types/game';

/**
 * Curva de níveis: subir do nível N para o N+1 custa `base * N` de XP.
 * Portanto o XP acumulado para alcançar o nível N é `base * N * (N - 1) / 2`.
 */
const SUBJECT_LEVEL_BASE = 110;
const PLAYER_LEVEL_BASE = 70;

export type LevelProgress = {
  level: number;
  /** XP obtido dentro do nível atual. */
  current: number;
  /** XP necessário para concluir o nível atual. */
  required: number;
  /** 0..1 */
  ratio: number;
};

function xpToReach(level: number, base: number) {
  return (base * level * (level - 1)) / 2;
}

function levelFromXp(xp: number, base: number): LevelProgress {
  let level = 1;
  while (xpToReach(level + 1, base) <= xp) level++;
  const current = xp - xpToReach(level, base);
  const required = base * level;
  return { level, current, required, ratio: current / required };
}

export const subjectLevel = (xp: number) => levelFromXp(xp, SUBJECT_LEVEL_BASE);
export const playerLevel = (xp: number) => levelFromXp(xp, PLAYER_LEVEL_BASE);

/** Moedas recebidas ao estudar uma etapa. */
export const coinsForStep = (step: StudyStep) => Math.round(step.points / 10);

export function activityPoints(activity: Activity) {
  return activity.steps.reduce((sum, step) => sum + step.points, 0);
}

export function activityProgress(activity: Activity, completedStepIds: string[]) {
  const done = activity.steps.filter((step) => completedStepIds.includes(step.id));
  return {
    completedSteps: done.length,
    totalSteps: activity.steps.length,
    earnedPoints: done.reduce((sum, step) => sum + step.points, 0),
    totalPoints: activityPoints(activity),
  };
}

/** Formata números no padrão pt-BR (1250 → "1.250"). */
export function formatNumber(value: number) {
  return value.toLocaleString('pt-BR');
}
