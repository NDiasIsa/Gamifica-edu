import { colors } from '@/constants/theme';
import { initialEquippedCosmetics, initialOwnedCosmeticIds } from '@/data/cosmetics';
import type { Activity, Challenge, DailyFlashcardStats, RankingScope, StudentState, Subject, SubjectId } from '@/types/game';

// Dados de exemplo enquanto não há backend da instituição.

export const subjects: Record<SubjectId, Subject> = {
  matematica: {
    id: 'matematica',
    name: 'Matemática',
    color: colors.brand.primary,
    depthColor: colors.depth.primary,
    onColor: colors.text.onColor,
  },
  portugues: {
    id: 'portugues',
    name: 'Português',
    color: colors.accent.hpPink,
    depthColor: colors.depth.pink,
    onColor: colors.bg.base,
  },
  historia: {
    id: 'historia',
    name: 'História',
    color: colors.accent.xpGold,
    depthColor: colors.depth.gold,
    onColor: colors.bg.base,
  },
  ciencias: {
    id: 'ciencias',
    name: 'Ciências',
    color: colors.accent.manaCyan,
    depthColor: colors.depth.cyan,
    onColor: colors.bg.base,
  },
};

export const subjectOrder: SubjectId[] = ['matematica', 'portugues', 'historia', 'ciencias'];

/** Aluna logada no app de exemplo. */
export const CURRENT_STUDENT_ID = 'lydia';

export const initialStudent: StudentState = {
  id: CURRENT_STUDENT_ID,
  name: 'Lydia Santos',
  title: 'Aprendiz Arcana',
  classId: '7B',
  coins: 1250,
  completedStepIds: ['brasil-colonial-1'],
  ownedCosmeticIds: initialOwnedCosmeticIds,
  equippedCosmetics: initialEquippedCosmetics,
};

export const initialActivities: Activity[] = [
  {
    id: 'brasil-colonial',
    classId: '7B',
    subjectId: 'historia',
    title: 'Brasil Colonial',
    description:
      'Descubra como era a vida no Brasil entre 1500 e 1822: a chegada dos portugueses, os ciclos econômicos e a formação cultural do país.',
    type: 'trilha',
    size: '3 etapas',
    status: 'published',
    dueLabel: '20/09 · 23:59',
    steps: [
      {
        id: 'brasil-colonial-1',
        title: 'História do Brasil',
        format: 'slides',
        length: '8 min',
        points: 200,
      },
      {
        id: 'brasil-colonial-2',
        title: 'Colonialismo',
        format: 'pdf',
        length: '12 páginas',
        points: 200,
        isNew: true,
      },
      {
        id: 'brasil-colonial-3',
        title: 'Religiões Africanas',
        format: 'pdf',
        length: '9 páginas',
        points: 200,
      },
    ],
  },
  {
    id: 'fracoes-decimais',
    classId: '7B',
    subjectId: 'matematica',
    title: 'Frações e Decimais',
    description: 'Transforme frações em números decimais e resolva problemas do dia a dia.',
    type: 'quiz',
    size: '10 questões',
    status: 'published',
    dueLabel: '08/09 · 23:59',
    steps: [
      {
        id: 'fracoes-decimais-1',
        title: 'O que são frações',
        format: 'slides',
        length: '6 min',
        points: 90,
      },
      {
        id: 'fracoes-decimais-2',
        title: 'Frações para decimais',
        format: 'pdf',
        length: '5 páginas',
        points: 90,
        isNew: true,
      },
    ],
  },
  {
    id: 'sistema-solar',
    classId: '7B',
    subjectId: 'ciencias',
    title: 'Sistema Solar',
    description: 'Revise os planetas, suas características e a posição de cada um em relação ao Sol.',
    type: 'flashcards',
    size: '24 cartas',
    status: 'published',
    dueLabel: '10/09 · 23:59',
    steps: [
      {
        id: 'sistema-solar-1',
        title: 'Planetas rochosos',
        format: 'slides',
        length: '7 min',
        points: 150,
      },
      {
        id: 'sistema-solar-2',
        title: 'Gigantes gasosos',
        format: 'pdf',
        length: '8 páginas',
        points: 150,
      },
    ],
  },
  {
    id: 'equacoes-7a',
    classId: '7A',
    subjectId: 'matematica',
    title: 'Equações do 1º grau',
    description: 'Aprenda a isolar a incógnita e resolver equações simples.',
    type: 'trilha',
    size: '2 etapas',
    status: 'published',
    dueLabel: '22/09 · 23:59',
    steps: [
      {
        id: 'equacoes-7a-1',
        title: 'O que é uma equação',
        format: 'slides',
        length: '10 min',
        points: 150,
      },
      {
        id: 'equacoes-7a-2',
        title: 'Resolvendo passo a passo',
        format: 'pdf',
        length: '6 páginas',
        points: 150,
      },
    ],
  },
];

export const season = {
  number: 3,
  endsAt: new Date('2026-09-30T23:59:00-03:00').getTime(),
  /** Posição da aluna no início da temporada, para mostrar quanto ela subiu. */
  startPosition: { turma: 4, instituicao: 8 } satisfies Record<RankingScope, number>,
};

// Desafios só acontecem entre colegas da mesma turma.
// A aposta do desafio enviado já foi descontada das moedas iniciais.
export const initialChallenges: Challenge[] = [
  {
    id: 'desafio-ana',
    rivalId: 'ana',
    direction: 'sent',
    subjectId: 'historia',
    questionCount: 10,
    bet: 50,
    status: 'pending',
  },
  {
    id: 'desafio-joao',
    rivalId: 'joao',
    direction: 'received',
    subjectId: 'matematica',
    questionCount: 5,
    bet: 25,
    status: 'pending',
    rivalScore: 3,
  },
  {
    id: 'desafio-clara',
    rivalId: 'clara',
    direction: 'received',
    subjectId: 'ciencias',
    questionCount: 10,
    bet: 50,
    status: 'pending',
    rivalScore: 7,
  },
];

export const initialFlashcardDaily = (date: string): DailyFlashcardStats => ({ date, xp: 235, cards: 10 });
