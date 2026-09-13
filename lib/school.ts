import { colors } from '@/constants/theme';
import type { ActivityType, RosterStudent, SubjectId } from '@/types/game';

export const totalXp = (subjectXp: Record<SubjectId, number>) =>
  Object.values(subjectXp).reduce((sum, xp) => sum + xp, 0);

/** Nota de 0 a 10 → parte proporcional dos pontos da etapa (8,5 em 200 → 170 XP). */
export const xpForGrade = (grade: number, stepPoints: number) => Math.round((grade / 10) * stepPoints);

/** "8,5" */
export const formatGrade = (grade: number) => grade.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

/** Aluno ativo = acessou o app hoje ou ontem. */
export const isActiveStudent = (student: RosterStudent) =>
  student.lastActiveDaysAgo !== null && student.lastActiveDaysAgo <= 1;

export function lastActiveInfo(daysAgo: number | null) {
  if (daysAgo === null) return { label: 'Nunca acessou', color: colors.text.secondary };
  if (daysAgo === 0) return { label: 'Hoje', color: colors.accent.success };
  if (daysAgo === 1) return { label: 'Ontem', color: colors.accent.success };
  if (daysAgo < 5) return { label: `${daysAgo} dias`, color: colors.accent.xpGold };
  return { label: `${daysAgo} dias`, color: colors.accent.hpPink };
}

/** Rótulo curto do tamanho da atividade exibido no app do aluno. */
export function activitySizeLabel(type: ActivityType, stepCount: number) {
  const plural = stepCount === 1 ? '' : 's';
  if (type === 'trilha') return `${stepCount} etapa${plural}`;
  return `${stepCount} material${stepCount === 1 ? '' : 'is'}`;
}

/** "8º Ano A" → "8A". */
export function classShortName(name: string) {
  const digits = name.match(/\d+/)?.[0] ?? '';
  const letter = name.trim().slice(-1).toUpperCase();
  return `${digits}${/[A-Z]/.test(letter) ? letter : ''}` || name.slice(0, 2).toUpperCase();
}

export const inviteCodeFor = (shortName: string) =>
  `EQ-${shortName}${String(Math.floor(Math.random() * 90) + 10)}`;

export const createId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
