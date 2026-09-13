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
  /** Turma que recebe a atividade. */
  classId: string;
  subjectId: SubjectId;
  title: string;
  description: string;
  type: ActivityType;
  /** Ex.: "3 etapas", "10 questões". */
  size: string;
  steps: StudyStep[];
  /** Rascunhos só aparecem para o professor. */
  status: 'published' | 'draft';
  /** Ex.: "20/09 · 23:59". */
  dueLabel?: string;
};

/** Dados do aluno logado guardados no app (o XP fica no cadastro da escola). */
export type StudentState = {
  id: string;
  name: string;
  title: string;
  classId: string;
  coins: number;
  /** IDs das etapas já estudadas. */
  completedStepIds: string[];
  ownedCosmeticIds: string[];
  equippedCosmetics: Record<CosmeticCategory, string>;
};

/** Aluno logado com os dados que vêm da escola já resolvidos. */
export type Student = StudentState & {
  classroom: string;
  streakDays: number;
  subjectXp: Record<SubjectId, number>;
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
  /** Itens desativados pelo professor ficam ocultos na loja. */
  active: boolean;
  /** Vendas no mês (painel do professor). */
  sales: number;
};

// ---------------------------------------------------------------------------
// Escola (visão do professor)
// ---------------------------------------------------------------------------

export type Teacher = {
  name: string;
  avatar: AvatarPalette;
};

export type SchoolClass = {
  id: string;
  name: string;
  /** Ex.: "7B" (selo colorido na gestão de turmas). */
  shortName: string;
  color: string;
  depthColor: string;
  inviteCode: string;
  /** Turmas de outros professores aparecem só no ranking da instituição. */
  managed: boolean;
  /** 0..1 */
  weeklyEngagement: number;
  /** 0..1 */
  averageAccuracy: number;
  weeklyXp: number;
  /** Acertos por matéria nos últimos 7 dias (0..1). */
  accuracyBySubject: Record<SubjectId, number>;
};

export type RosterStudent = {
  id: string;
  name: string;
  classId: string;
  enrollment: string;
  guardianEmail?: string;
  avatar: AvatarPalette;
  subjectXp: Record<SubjectId, number>;
  /** null = ainda não acessou o app. */
  lastActiveDaysAgo: number | null;
  streakDays: number;
  delivered: number;
  assigned: number;
  late: number;
  /** 0..1 */
  flashcardAccuracy: number;
};

export type SubmissionStatus = 'pending' | 'approved' | 'revision';

export type Submission = {
  id: string;
  studentId: string;
  activityId: string;
  stepId: string;
  fileName: string;
  fileInfo: string;
  /** Ex.: "há 2h", "ontem". */
  sentLabel: string;
  isNew?: boolean;
  status: SubmissionStatus;
  grade?: number;
  comment?: string;
  xpAwarded?: number;
};

export type LateDelivery = {
  id: string;
  studentId: string;
  activityId: string;
  dueLabel: string;
  reminded?: boolean;
};

/** Aviso que o professor manda para o aluno (mensagem, XP bônus, correção). */
export type StudentNotice = {
  id: string;
  studentId: string;
  kind: 'message' | 'bonus' | 'grade';
  title: string;
  body: string;
  read: boolean;
};

export type RankingScope = 'turma' | 'instituicao';

export type RankingEntry = {
  id: string;
  name: string;
  classId: string;
  classroom: string;
  xp: number;
  avatar: AvatarPalette;
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
