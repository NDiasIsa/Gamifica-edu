export type SubjectId = 'matematica' | 'portugues' | 'historia' | 'ciencias';

export type Subject = {
  id: SubjectId;
  name: string;
  /** Cor de acento da matéria (tag, faixa lateral, barra de XP). */
  color: string;
  /** Cor da sombra sólida usada no símbolo da matéria. */
  depthColor: string;
  /** Cor de texto/ícone legível sobre `color`. */
  onColor: string;
};

export type ActivityType = 'trilha' | 'quiz' | 'flashcards';

export type MaterialFormat = 'slides' | 'pdf';

/** Etapa / material de estudo de uma atividade. Estudar rende pontos extras. */
export type StudyStep = {
  id: string;
  title: string;
  format: MaterialFormat;
  /** Ex.: "8 min", "12 páginas". */
  length: string;
  points: number;
  isNew?: boolean;
};

export type Activity = {
  id: string;
  subjectId: SubjectId;
  title: string;
  description: string;
  type: ActivityType;
  /** Ex.: "3 etapas", "10 questões". */
  size: string;
  steps: StudyStep[];
};

export type Student = {
  name: string;
  title: string;
  classroom: string;
  coins: number;
  streakDays: number;
  subjectXp: Record<SubjectId, number>;
  /** IDs das etapas já estudadas. */
  completedStepIds: string[];
  ownedCosmeticIds: string[];
  equippedCosmetics: Record<CosmeticCategory, string>;
};

// ---------------------------------------------------------------------------
// Flashcards
// ---------------------------------------------------------------------------

/** Parte de uma matéria (ex.: "Equações do 1º grau" em Matemática). */
export type Topic = {
  id: string;
  subjectId: SubjectId;
  name: string;
};

/** Pergunta cadastrada pelo professor. */
export type Flashcard = {
  id: string;
  subjectId: SubjectId;
  topicId: string;
  question: string;
  answer: string;
  /** Alternativas erradas exibidas junto com a resposta. */
  distractors: string[];
};

/**
 * novo: nunca respondido · aprendendo: já visto, ainda fixando ·
 * revisar: aprendido, volta de tempos em tempos valendo menos XP.
 */
export type CardState = 'novo' | 'aprendendo' | 'revisar';

export type CardProgress = {
  state: Exclude<CardState, 'novo'>;
  /** Quantas revisões seguidas foram acertadas (define o intervalo). */
  reviews: number;
  /** Momento (ms) a partir do qual o card volta a aparecer nas rodadas. */
  dueAt: number;
  /** XP acumulado com este card. */
  xpEarned: number;
};

export type DailyFlashcardStats = {
  /** Dia no formato YYYY-MM-DD. */
  date: string;
  xp: number;
  cards: number;
};

// ---------------------------------------------------------------------------
// Ranking e desafios
// ---------------------------------------------------------------------------

export type AvatarPalette = {
  background: [string, string];
  border: string;
  hat: string;
  hatShade: string;
  star: string;
  hair: string;
  skin: string;
  mouth: string;
  robe: string;
  robeShade: string;
  belt: string;
  /** Cajado mágico (opcional). */
  staff?: string;
  /** Ponta brilhante do cajado. */
  staffTip?: string;
  boots?: string;
};

// ---------------------------------------------------------------------------
// Personalização
// ---------------------------------------------------------------------------

export type CosmeticCategory = 'chapeus' | 'roupas' | 'acessorios' | 'fundos';

export type Cosmetic = {
  id: string;
  category: CosmeticCategory;
  name: string;
  /** Preço em moedas (C$). 0 = gratuito. */
  price: number;
  /** Nível mínimo do aluno para comprar. */
  requiredLevel?: number;
  /** Cores que o item aplica ao personagem. */
  look: Partial<AvatarPalette>;
  /** Cor do brilho atrás do personagem na pré-visualização (fundos). */
  glow?: string;
};

export type Classmate = {
  id: string;
  name: string;
  classroom: string;
  xp: number;
  avatar: AvatarPalette;
};

export type RankingScope = 'turma' | 'instituicao';

export type RankingEntry = Classmate & {
  isCurrentStudent?: boolean;
};

export type ChallengeStatus = 'pending' | 'accepted' | 'won' | 'lost' | 'draw';

export type Challenge = {
  id: string;
  rivalId: string;
  /** sent: você desafiou · received: o colega te desafiou. */
  direction: 'sent' | 'received';
  subjectId: SubjectId;
  questionCount: number;
  /** Moedas (C$) apostadas por cada jogador. */
  bet: number;
  status: ChallengeStatus;
  /** Acertos do colega (convites recebidos já vêm respondidos). */
  rivalScore?: number;
  myScore?: number;
};
