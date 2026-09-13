import type { GlyphName } from '@/components/ui/Glyph';
import type { IconName } from '@/components/ui/Icon';
import type { ActivityType, MaterialFormat, SubjectId } from '@/types/game';

export const activityTypeMeta: Record<ActivityType, { label: string; detailLabel: string; icon: IconName }> = {
  trilha: { label: 'Trilha', detailLabel: 'Trilha de estudos', icon: 'map' },
  quiz: { label: 'Quiz', detailLabel: 'Quiz', icon: 'quiz' },
  flashcards: { label: 'Flashcards', detailLabel: 'Flashcards', icon: 'cards' },
};

/** Símbolo exibido no bloco colorido de cada matéria. */
export const subjectSymbol: Record<SubjectId, { icon: IconName; largeIcon: IconName }> = {
  historia: { icon: 'book', largeIcon: 'book-lg' },
  // Português ainda não tem símbolo próprio no Figma.
  portugues: { icon: 'book', largeIcon: 'book-lg' },
  matematica: { icon: 'sigma', largeIcon: 'sigma' },
  ciencias: { icon: 'flask', largeIcon: 'flask' },
};

/** Ícone vetorial de cada matéria (baralhos de flashcards e duelos). */
export const subjectGlyph: Record<SubjectId, GlyphName> = {
  matematica: 'sigma',
  portugues: 'pen',
  historia: 'book',
  ciencias: 'flask',
};

export const materialFormatMeta: Record<MaterialFormat, { label: string; icon: IconName }> = {
  slides: { label: 'Slides', icon: 'slides' },
  pdf: { label: 'PDF', icon: 'pdf' },
};
