import { StyleSheet, Text, View } from 'react-native';

import { BottomSheet, SheetHeader } from '@/components/ui/BottomSheet';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { Glyph } from '@/components/ui/Glyph';
import { PixelAvatar } from '@/components/ui/PixelAvatar';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { colors, fonts } from '@/constants/theme';
import { subjects } from '@/data/mock';
import { duelXpStake } from '@/lib/duel';
import { formatNumber } from '@/lib/progression';
import { useGame } from '@/store/GameProvider';
import type { AvatarPalette, Challenge } from '@/types/game';

type ChallengesSheetProps = {
  onClose: () => void;
  /** Chamado depois que o convite foi aceito (aposta paga). */
  onPlay: (challengeId: string) => void;
};

const resultMeta = {
  won: { label: 'Vitória', color: colors.accent.success },
  lost: { label: 'Derrota', color: colors.accent.hpPink },
  draw: { label: 'Empate', color: colors.accent.xpGold },
} as const;

export function ChallengesSheet({ onClose, onPlay }: ChallengesSheetProps) {
  const { student, challenges, getClassmate, acceptChallenge, declineChallenge, cancelChallenge } = useGame();

  const received = challenges.filter(
    (item) => item.direction === 'received' && (item.status === 'pending' || item.status === 'accepted'),
  );
  const sent = challenges.filter((item) => item.direction === 'sent' && item.status === 'pending');
  const history = challenges.filter((item) => item.status === 'won' || item.status === 'lost' || item.status === 'draw');

  const accept = (challenge: Challenge) => {
    if (acceptChallenge(challenge.id)) onPlay(challenge.id);
  };

  return (
    <BottomSheet onClose={onClose}>
      <SheetHeader eyebrow="DESAFIOS" eyebrowColor={colors.brand.magenta} title="Seus duelos" onClose={onClose} />

      <View style={styles.section}>
        <SectionLabel label="CONVITES RECEBIDOS" hint={`Saldo: ${formatNumber(student.coins)} C$`} />
        {received.length === 0 && <Text style={styles.empty}>Nenhum convite no momento.</Text>}
        {received.map((challenge) => {
          const rival = getClassmate(challenge.rivalId);
          if (!rival) return null;
          const accepted = challenge.status === 'accepted';
          const canAfford = accepted || student.coins >= challenge.bet;
          return (
            <View key={challenge.id} style={styles.card}>
              <ChallengeSummary challenge={challenge} rivalName={rival.name} avatar={rival.avatar} />
              <Text style={styles.note}>
                {accepted
                  ? 'Duelo em andamento — termine suas respostas!'
                  : `${rival.name.split(' ')[0]} já respondeu. Agora é a sua vez!`}
              </Text>
              {accepted ? (
                <ChunkyButton icon="play" label="CONTINUAR DUELO" height={46} fontSize={15} onPress={() => onPlay(challenge.id)} />
              ) : (
                <View style={styles.actions}>
                  <ChunkyButton
                    variant="outline"
                    label="RECUSAR"
                    height={46}
                    fontSize={15}
                    style={styles.actionButton}
                    onPress={() => declineChallenge(challenge.id)}
                  />
                  <ChunkyButton
                    icon="sword"
                    label={canAfford ? 'ACEITAR' : 'SEM MOEDAS'}
                    height={46}
                    fontSize={15}
                    style={styles.actionButton}
                    disabled={!canAfford}
                    onPress={() => accept(challenge)}
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.section}>
        <SectionLabel label="DESAFIOS ENVIADOS" />
        {sent.length === 0 && <Text style={styles.empty}>Toque na espada ao lado de um colega da sua turma para desafiá-lo.</Text>}
        {sent.map((challenge) => {
          const rival = getClassmate(challenge.rivalId);
          if (!rival) return null;
          return (
            <View key={challenge.id} style={styles.card}>
              <ChallengeSummary challenge={challenge} rivalName={rival.name} avatar={rival.avatar} />
              <View style={styles.waitingRow}>
                <View style={styles.waiting}>
                  <Glyph name="clock" size={14} color={colors.text.secondary} />
                  <Text style={styles.note}>Aguardando {rival.name.split(' ')[0]} responder</Text>
                </View>
                <ChunkyButton
                  variant="outline"
                  label="CANCELAR"
                  height={38}
                  fontSize={13}
                  onPress={() => cancelChallenge(challenge.id)}
                />
              </View>
            </View>
          );
        })}
      </View>

      {history.length > 0 && (
        <View style={styles.section}>
          <SectionLabel label="HISTÓRICO" />
          {history.map((challenge) => {
            const rival = getClassmate(challenge.rivalId);
            const meta = resultMeta[challenge.status as keyof typeof resultMeta];
            return (
              <View key={challenge.id} style={styles.historyRow}>
                <Text style={styles.historyName} numberOfLines={1}>
                  {rival?.name} · {subjects[challenge.subjectId].name}
                </Text>
                <Text style={styles.historyScore}>
                  {challenge.myScore} × {challenge.rivalScore}
                </Text>
                <Text style={[styles.historyResult, { color: meta.color }]}>{meta.label}</Text>
              </View>
            );
          })}
        </View>
      )}
    </BottomSheet>
  );
}

function ChallengeSummary({
  challenge,
  rivalName,
  avatar,
}: {
  challenge: Challenge;
  rivalName: string;
  avatar: AvatarPalette;
}) {
  const subject = subjects[challenge.subjectId];
  return (
    <View style={styles.summary}>
      <PixelAvatar palette={avatar} size={44} />
      <View style={styles.summaryText}>
        <Text style={styles.summaryName} numberOfLines={1}>
          {rivalName}
        </Text>
        <Text style={styles.summaryMeta} numberOfLines={1}>
          <Text style={{ color: subject.color }}>{subject.name}</Text> · {challenge.questionCount} perguntas
        </Text>
      </View>
      <View style={styles.summaryStakes}>
        <View style={styles.stakeRow}>
          <Glyph name="coin" size={14} strokeWidth={2.8} color={colors.accent.xpGold} />
          <Text style={styles.stakeCoins}>{challenge.bet} C$</Text>
        </View>
        <Text style={styles.stakeXp}>vale {duelXpStake(challenge.questionCount)} XP</Text>
      </View>
    </View>
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
  card: {
    gap: 10,
    padding: 12,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface2,
  },
  note: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: '#F0ABFC',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  waitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  waiting: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryText: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  summaryName: {
    fontFamily: fonts.black,
    fontSize: 15,
    color: colors.text.primary,
  },
  summaryMeta: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  summaryStakes: {
    alignItems: 'flex-end',
    gap: 1,
  },
  stakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stakeCoins: {
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.accent.xpGold,
  },
  stakeXp: {
    fontFamily: fonts.extraBold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.bg.base,
  },
  historyName: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.text.primary,
  },
  historyScore: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.text.primary,
  },
  historyResult: {
    fontFamily: fonts.black,
    fontSize: 12,
  },
});
