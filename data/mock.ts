import { colors } from '@/constants/theme';
import { initialEquippedCosmetics, initialOwnedCosmeticIds } from '@/data/cosmetics';
import type {
  Activity,
  Challenge,
  Classmate,
  DailyFlashcardStats,
  RankingScope,
  Student,
  Subject,
  SubjectId,
} from '@/types/game';

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

export const initialStudent: Student = {
  name: 'Lydia Santos',
  title: 'Aprendiz Arcana',
  classroom: '7º Ano B',
  coins: 1250,
  streakDays: 12,
  subjectXp: {
    matematica: 2103,
    portugues: 858,
    historia: 1430,
    ciencias: 429,
  },
  completedStepIds: ['brasil-colonial-1'],
  ownedCosmeticIds: initialOwnedCosmeticIds,
  equippedCosmetics: initialEquippedCosmetics,
};

export const activities: Activity[] = [
  {
    id: 'brasil-colonial',
    subjectId: 'historia',
    title: 'Brasil Colonial',
    description:
      'Descubra como era a vida no Brasil entre 1500 e 1822: a chegada dos portugueses, os ciclos econômicos e a formação cultural do país.',
    type: 'trilha',
    size: '3 etapas',
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
    subjectId: 'matematica',
    title: 'Frações e Decimais',
    description: 'Transforme frações em números decimais e resolva problemas do dia a dia.',
    type: 'quiz',
    size: '10 questões',
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
    subjectId: 'ciencias',
    title: 'Sistema Solar',
    description: 'Revise os planetas, suas características e a posição de cada um em relação ao Sol.',
    type: 'flashcards',
    size: '24 cartas',
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
];

export const getActivity = (id: string) => activities.find((activity) => activity.id === id);

// ---------------------------------------------------------------------------
// Ranking
// ---------------------------------------------------------------------------

export const CURRENT_STUDENT_ID = 'me';

export const classmates: Record<string, Classmate> = {
  pedro: {
    id: 'pedro',
    name: 'Pedro Almeida',
    classroom: '7º Ano B',
    xp: 5310,
    avatar: {
      background: ['#3B2F66', '#0E7490'],
      border: '#22D3EE',
      hat: '#22D3EE',
      hatShade: '#0E7490',
      star: '#F472B6',
      hair: '#78350F',
      skin: '#D6A77A',
      mouth: '#7C2D12',
      robe: '#4ADE80',
      robeShade: '#15803D',
      belt: '#F5F3FF',
    },
  },
  ana: {
    id: 'ana',
    name: 'Ana Beatriz',
    classroom: '7º Ano B',
    xp: 5024,
    avatar: {
      background: ['#3B2F66', '#BE185D'],
      border: '#F472B6',
      hat: '#F472B6',
      hatShade: '#BE185D',
      star: '#22D3EE',
      hair: '#3F2A1D',
      skin: '#FDBA74',
      mouth: '#BE185D',
      robe: '#FACC15',
      robeShade: '#B45309',
      belt: '#F5F3FF',
      staff: '#FDE68A',
    },
  },
  joao: {
    id: 'joao',
    name: 'João Victor',
    classroom: '7º Ano B',
    xp: 4410,
    avatar: {
      background: ['#3B2F66', '#B45309'],
      border: '#FACC15',
      hat: '#FACC15',
      hatShade: '#B45309',
      star: '#8B5CF6',
      hair: '#1C1917',
      skin: '#8D5A3B',
      mouth: '#4A2511',
      robe: '#8B5CF6',
      robeShade: '#5B21B6',
      belt: '#FACC15',
    },
  },
  marina: {
    id: 'marina',
    name: 'Marina Costa',
    classroom: '7º Ano B',
    xp: 3980,
    avatar: {
      background: ['#3B2F66', '#15803D'],
      border: '#4ADE80',
      hat: '#4ADE80',
      hatShade: '#15803D',
      star: '#FACC15',
      hair: '#B45309',
      skin: '#F5C9A0',
      mouth: '#BE185D',
      robe: '#F472B6',
      robeShade: '#BE185D',
      belt: '#F5F3FF',
      staff: '#A78BFA',
    },
  },
  rafael: {
    id: 'rafael',
    name: 'Rafael Lima',
    classroom: '9º Ano A',
    xp: 9870,
    avatar: {
      background: ['#3B2F66', '#86198F'],
      border: '#D946EF',
      hat: '#D946EF',
      hatShade: '#86198F',
      star: '#22D3EE',
      hair: '#1C1917',
      skin: '#C68B59',
      mouth: '#7C2D12',
      robe: '#22D3EE',
      robeShade: '#0E7490',
      belt: '#FACC15',
    },
  },
  camila: {
    id: 'camila',
    name: 'Camila Rocha',
    classroom: '8º Ano C',
    xp: 9120,
    avatar: {
      background: ['#3B2F66', '#0E7490'],
      border: '#22D3EE',
      hat: '#22D3EE',
      hatShade: '#0E7490',
      star: '#FACC15',
      hair: '#78350F',
      skin: '#FDBA74',
      mouth: '#BE185D',
      robe: '#D946EF',
      robeShade: '#86198F',
      belt: '#F5F3FF',
      staff: '#FDE68A',
    },
  },
  lucas: {
    id: 'lucas',
    name: 'Lucas Ferreira',
    classroom: '9º Ano B',
    xp: 8640,
    avatar: {
      background: ['#3B2F66', '#5B21B6'],
      border: '#8B5CF6',
      hat: '#8B5CF6',
      hatShade: '#5B21B6',
      star: '#4ADE80',
      hair: '#FACC15',
      skin: '#F5C9A0',
      mouth: '#7C2D12',
      robe: '#F472B6',
      robeShade: '#BE185D',
      belt: '#FACC15',
    },
  },
  sofia: {
    id: 'sofia',
    name: 'Sofia Martins',
    classroom: '6º Ano A',
    xp: 4390,
    avatar: {
      background: ['#3B2F66', '#B45309'],
      border: '#FACC15',
      hat: '#FACC15',
      hatShade: '#B45309',
      star: '#F472B6',
      hair: '#1C1917',
      skin: '#8D5A3B',
      mouth: '#4A2511',
      robe: '#22D3EE',
      robeShade: '#0E7490',
      belt: '#F5F3FF',
      staff: '#A78BFA',
    },
  },
};

/** Quem aparece em cada ranking (a aluna atual é incluída automaticamente). */
export const rankingMembers: Record<RankingScope, string[]> = {
  turma: ['pedro', 'ana', 'joao', 'marina'],
  instituicao: ['rafael', 'camila', 'lucas', 'pedro', 'ana', 'joao', 'sofia', 'marina'],
};

export const season = {
  number: 3,
  endsAt: new Date('2026-09-30T23:59:00-03:00').getTime(),
  /** Posição da aluna no início da temporada, para mostrar quanto ela subiu. */
  startPosition: { turma: 4, instituicao: 8 } satisfies Record<RankingScope, number>,
};

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
    id: 'desafio-camila',
    rivalId: 'camila',
    direction: 'received',
    subjectId: 'ciencias',
    questionCount: 10,
    bet: 50,
    status: 'pending',
    rivalScore: 7,
  },
];

// ---------------------------------------------------------------------------
// Flashcards
// ---------------------------------------------------------------------------

export const initialFlashcardDaily = (date: string): DailyFlashcardStats => ({ date, xp: 235, cards: 10 });
