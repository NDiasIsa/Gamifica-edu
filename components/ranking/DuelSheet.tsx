import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { VersusPanel } from '@/components/ranking/VersusPanel';
import { BottomSheet, SheetHeader } from '@/components/ui/BottomSheet';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { Glyph } from '@/components/ui/Glyph';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SubjectPicker } from '@/components/ui/SubjectPicker';
import { colors, fonts } from '@/constants/theme';
import { subjects } from '@/data/mock';
import { DUEL_BETS, DUEL_QUESTION_COUNTS, duelXpStake } from '@/lib/duel';
import { formatNumber } from '@/lib/progression';
import { useGame } from '@/store/GameProvider';
import type { RankingEntry, RankingScope, SubjectId } from '@/types/game';

type QuestionCount = (typeof DUEL_QUESTION_COUNTS)[number];
type Bet = (typeof DUEL_BETS)[number];

type DuelSheetProps = {
  rival: RankingEntry;
  scope: RankingScope;
  onClose: () => void;
};

export function DuelSheet({ rival, scope, onClose }: DuelSheetProps) {
  const { student, rankings, positions, sendChallenge } = useGame();
  const [subjectId, setSubjectId] = useState<SubjectId>('matematica');
  const [questionCount, setQuestionCount] = useState<QuestionCount>(10);
  const [bet, setBet] = useState<Bet>(() => (student.coins >= 50 ? 50 : 25));

  const me = rankings[scope].find((entry) => entry.isCurrentStudent);
  const rivalPosition = rankings[scope].findIndex((entry) => entry.id === rival.id) + 1;
  const canAfford = student.coins >= bet;
  const stake = duelXpStake(questionCount);

  const send = () => {
    if (sendChallenge({ rivalId: rival.id, subjectId, questionCount, bet })) onClose();
  };

  return (
    <BottomSheet onClose={onClose}>
      <SheetHeader eyebrow="DESAFIO" eyebrowColor={colors.brand.magenta} title="Duelo de perguntas" onClose={onClose} />

      <VersusPanel
        me={{
          name: student.name,
          avatar: me?.avatar ?? rival.avatar,
          caption: `#${positions[scope]} · ${formatNumber(me?.xp ?? 0)} XP`,
        }}
        rival={{ name: rival.name, avatar: rival.avatar, caption: `#${rivalPosition} · ${formatNumber(rival.xp)} XP` }}
      />

      <View style={styles.section}>
        <SectionLabel label="MATÉRIA" />
        <SubjectPicker selected={[subjectId]} onToggle={setSubjectId} />
      </View>

      <View style={styles.section}>
        <SectionLabel label="QUANTIDADE DE PERGUNTAS" />
        <SegmentedControl
          variant="base"
          height={40}
          font="display"
          fontSize={18}
          value={questionCount}
          onChange={setQuestionCount}
          options={DUEL_QUESTION_COUNTS.map((value) => ({ value, label: String(value) }))}
        />
      </View>

      <View style={styles.section}>
        <SectionLabel label="APOSTA DE MOEDAS" hint="Quem vencer leva o dobro" />
        <SegmentedControl
          variant="base"
          height={40}
          fontSize={14}
          value={bet}
          onChange={setBet}
          activeColor={colors.accent.xpGold}
          activeDepthColor={colors.depth.gold}
          activeTextColor={colors.bg.base}
          options={DUEL_BETS.map((value) => ({
            value,
            label: `${value} C$`,
            disabled: value > student.coins,
            renderIcon: (active) => (
              <Glyph name="coin" size={16} strokeWidth={2.8} color={active ? colors.bg.base : colors.accent.xpGold} />
            ),
          }))}
        />
      </View>

      <View style={styles.stakes}>
        <View style={styles.stakeRow}>
          <Glyph name="bolt" size={14} color={colors.accent.xpGold} />
          <Text style={styles.stakeText}>
            Quem vencer rouba <Text style={styles.stakeHighlight}>{stake} XP</Text> de {subjects[subjectId].name} do
            colega
          </Text>
        </View>
        <View style={styles.stakeRow}>
          <Glyph name="coin" size={14} strokeWidth={2.8} color={colors.accent.xpGold} />
          <Text style={styles.stakeText}>
            Seu saldo: <Text style={styles.stakeHighlight}>{formatNumber(student.coins)} C$</Text> · a aposta fica
            reservada até o duelo terminar
          </Text>
        </View>
      </View>

      <ChunkyButton icon="sword" label="ENVIAR DESAFIO" onPress={send} disabled={!canAfford} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
  stakes: {
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.bg.base,
  },
  stakeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  stakeText: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.secondary,
  },
  stakeHighlight: {
    fontFamily: fonts.black,
    color: colors.accent.xpGold,
  },
});
