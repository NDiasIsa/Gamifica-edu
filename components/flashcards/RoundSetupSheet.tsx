import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomSheet, SheetHeader } from '@/components/ui/BottomSheet';
import { GradientButton } from '@/components/ui/GradientButton';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SubjectPicker } from '@/components/ui/SubjectPicker';
import { colors, fonts, withAlpha } from '@/constants/theme';
import { flashcards, topics } from '@/data/flashcards';
import { subjectOrder, subjects } from '@/data/mock';
import {
  availableCards,
  cardState,
  cardStateMeta,
  cardStateOrder,
  DAILY_FLASHCARD_XP_LIMIT,
  ROUND_SIZES,
} from '@/lib/flashcards';
import { useGame } from '@/store/GameProvider';
import type { CardState, SubjectId } from '@/types/game';

type RoundSize = (typeof ROUND_SIZES)[number];

type RoundSetupSheetProps = {
  /** Matérias que já começam marcadas (todos os tópicos delas). */
  initialSubjectIds: SubjectId[];
  onClose: () => void;
  onStart: (topicIds: string[], size: number) => void;
};

const topicsOf = (subjectId: SubjectId) => topics.filter((topic) => topic.subjectId === subjectId);

export function RoundSetupSheet({ initialSubjectIds, onClose, onStart }: RoundSetupSheetProps) {
  const { cardProgress, flashcardDaily } = useGame();
  const [selectedTopicIds, setSelectedTopicIds] = useState(() =>
    initialSubjectIds.flatMap((id) => topicsOf(id).map((topic) => topic.id)),
  );
  const [size, setSize] = useState<RoundSize>(10);
  // Congela o "agora" enquanto o painel está aberto, para as contagens não mudarem sozinhas.
  const [now] = useState(() => Date.now());

  const selectedSubjectIds = subjectOrder.filter((id) =>
    topicsOf(id).some((topic) => selectedTopicIds.includes(topic.id)),
  );

  const toggleSubject = (subjectId: SubjectId) => {
    const ids = topicsOf(subjectId).map((topic) => topic.id);
    setSelectedTopicIds((prev) =>
      selectedSubjectIds.includes(subjectId) ? prev.filter((id) => !ids.includes(id)) : [...prev, ...ids],
    );
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopicIds((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId],
    );
  };

  const pool = availableCards(flashcards, cardProgress, selectedTopicIds, now);
  const poolByState: Record<CardState, number> = { novo: 0, aprendendo: 0, revisar: 0 };
  for (const card of pool) poolByState[cardState(cardProgress[card.id])] += 1;

  const roundLength = Math.min(size, pool.length);
  const limitReached = flashcardDaily.xp >= DAILY_FLASHCARD_XP_LIMIT;

  return (
    <BottomSheet onClose={onClose}>
      <SheetHeader
        eyebrow="RODADA DE PERGUNTAS"
        eyebrowColor={colors.accent.manaCyan}
        title="Monte sua rodada"
        onClose={onClose}
      />

      <View style={styles.section}>
        <SectionLabel label="MATÉRIAS" hint="Toque para incluir ou tirar" />
        <SubjectPicker selected={selectedSubjectIds} onToggle={toggleSubject} />
      </View>

      <View style={styles.section}>
        <SectionLabel label="TÓPICOS" hint="Cards disponíveis em cada um" />
        {selectedSubjectIds.length === 0 ? (
          <Text style={styles.empty}>Escolha pelo menos uma matéria para ver os tópicos.</Text>
        ) : (
          selectedSubjectIds.map((subjectId) => {
            const subject = subjects[subjectId];
            return (
              <View key={subjectId} style={styles.topicGroup}>
                <View style={styles.groupHeader}>
                  <View style={[styles.diamond, { backgroundColor: subject.color }]} />
                  <Text style={[styles.groupName, { color: subject.color }]}>{subject.name}</Text>
                </View>
                <View style={styles.chips}>
                  {topicsOf(subjectId).map((topic) => {
                    const active = selectedTopicIds.includes(topic.id);
                    const count = availableCards(flashcards, cardProgress, [topic.id], now).length;
                    return (
                      <Pressable
                        key={topic.id}
                        onPress={() => toggleTopic(topic.id)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: active }}
                        accessibilityLabel={`${topic.name}, ${count} cards disponíveis`}
                        style={[
                          styles.chip,
                          active
                            ? { borderColor: subject.color, backgroundColor: withAlpha(subject.color, 0.16) }
                            : styles.chipIdle,
                        ]}>
                        <Text style={[styles.chipLabel, { color: active ? colors.text.primary : colors.text.secondary }]}>
                          {topic.name}
                        </Text>
                        <View style={[styles.chipCount, active && { backgroundColor: subject.color }]}>
                          <Text style={[styles.chipCountText, active && { color: subject.onColor }]}>{count}</Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}
      </View>

      <View style={styles.section}>
        <SectionLabel label="QUANTIDADE DE PERGUNTAS" />
        <SegmentedControl
          variant="base"
          height={40}
          font="display"
          fontSize={18}
          value={size}
          onChange={setSize}
          options={ROUND_SIZES.map((value) => ({ value, label: String(value) }))}
        />
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryStates}>
          {cardStateOrder.map((state) => (
            <View key={state} style={styles.summaryState}>
              <View style={[styles.diamond, { backgroundColor: cardStateMeta[state].color }]} />
              <Text style={[styles.summaryCount, { color: cardStateMeta[state].color }]}>{poolByState[state]}</Text>
              <Text style={styles.summaryLabel}>{cardStateMeta[state].plural}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.summaryText}>
          {pool.length === 0
            ? 'Nenhum card disponível agora nesses tópicos. Os cards já estudados voltam para revisão nos próximos dias.'
            : `Sua rodada terá ${roundLength} ${roundLength === 1 ? 'pergunta' : 'perguntas'} de ${pool.length} ${pool.length === 1 ? 'card disponível' : 'cards disponíveis'}.`}
        </Text>
        {limitReached && (
          <Text style={styles.limitText}>Você já bateu o limite de XP de hoje: esta rodada vale só para praticar.</Text>
        )}
      </View>

      <GradientButton
        size="md"
        label="COMEÇAR RODADA"
        disabled={pool.length === 0}
        onPress={() => onStart(selectedTopicIds, size)}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
  empty: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.text.secondary,
  },
  topicGroup: {
    gap: 6,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  diamond: {
    width: 8,
    height: 8,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  groupName: {
    fontFamily: fonts.black,
    fontSize: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 10,
    paddingRight: 5,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 2,
  },
  chipIdle: {
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.base,
  },
  chipLabel: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
  },
  chipCount: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg.surface2,
  },
  chipCountText: {
    fontFamily: fonts.black,
    fontSize: 11,
    color: colors.text.secondary,
  },
  summary: {
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.bg.base,
  },
  summaryStates: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  summaryCount: {
    fontFamily: fonts.black,
    fontSize: 13,
  },
  summaryLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  summaryText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 17,
    color: colors.text.primary,
  },
  limitText: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    lineHeight: 17,
    color: colors.accent.streak,
  },
});
