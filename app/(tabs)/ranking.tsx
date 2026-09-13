import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChallengeBanner } from '@/components/ranking/ChallengeBanner';
import { ChallengesSheet } from '@/components/ranking/ChallengesSheet';
import { DuelSheet } from '@/components/ranking/DuelSheet';
import { RankingRow, type RowChallengeState } from '@/components/ranking/RankingRow';
import { Glyph } from '@/components/ui/Glyph';
import { rankingGlows, ScreenBackground } from '@/components/ui/ScreenBackground';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { colors, fonts } from '@/constants/theme';
import { season } from '@/data/mock';
import { formatSeasonRemaining } from '@/lib/duel';
import { useGame } from '@/store/GameProvider';
import type { RankingScope } from '@/types/game';

export default function RankingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { student, rankings, positions, challenges, getClassmate, canChallenge } = useGame();
  const [scope, setScope] = useState<RankingScope>('turma');
  const [duelRivalId, setDuelRivalId] = useState<string | null>(null);
  const [challengesOpen, setChallengesOpen] = useState(false);

  const pendingInvites = challenges.filter((item) => item.direction === 'received' && item.status === 'pending');
  const pendingSent = challenges.filter((item) => item.direction === 'sent' && item.status === 'pending');

  const challengeStateFor = (classmateId: string): RowChallengeState => {
    if (pendingSent.some((item) => item.rivalId === classmateId)) return 'sent';
    const hasInvite = challenges.some(
      (item) =>
        item.rivalId === classmateId &&
        item.direction === 'received' &&
        (item.status === 'pending' || item.status === 'accepted'),
    );
    return hasInvite ? 'received' : 'none';
  };

  const duelRival = duelRivalId ? getClassmate(duelRivalId) : undefined;

  return (
    <ScreenBackground glows={rankingGlows}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 4 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>RANKING</Text>
          <View style={styles.seasonRow}>
            <Glyph name="clock" size={13} strokeWidth={2.6} color={colors.text.secondary} />
            <Text style={styles.season}>
              Temporada {season.number} · {formatSeasonRemaining(season.endsAt, Date.now())}
            </Text>
          </View>
        </View>

        <SegmentedControl
          value={scope}
          onChange={setScope}
          options={[
            { value: 'turma', label: `Turma · ${student.classroom}` },
            { value: 'instituicao', label: 'Instituição' },
          ]}
        />

        <ChallengeBanner
          invites={pendingInvites.length}
          sent={pendingSent.length}
          onPress={() => setChallengesOpen(true)}
        />

        <View style={styles.list}>
          {rankings[scope].map((entry, index) => (
            <RankingRow
              key={entry.id}
              entry={entry}
              position={index + 1}
              movement={entry.isCurrentStudent ? season.startPosition[scope] - positions[scope] : 0}
              challengeState={entry.isCurrentStudent ? 'none' : challengeStateFor(entry.id)}
              canChallenge={canChallenge(entry.id)}
              onChallenge={() => setDuelRivalId(entry.id)}
              onOpenChallenges={() => setChallengesOpen(true)}
            />
          ))}
        </View>
      </ScrollView>

      <LinearGradient
        colors={['rgba(18,12,34,0)', 'rgba(18,12,34,0.92)', colors.bg.base]}
        locations={[0, 0.45, 1]}
        style={styles.bottomFade}
      />

      {duelRival && <DuelSheet rival={duelRival} scope={scope} onClose={() => setDuelRivalId(null)} />}

      {challengesOpen && (
        <ChallengesSheet
          onClose={() => setChallengesOpen(false)}
          onPlay={(challengeId) => {
            setChallengesOpen(false);
            router.push({ pathname: '/duelo/[id]', params: { id: challengeId } });
          }}
        />
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
    paddingHorizontal: 20,
    // Espaço para o botão central da BottomNav, que invade a tela.
    paddingBottom: 56,
  },
  header: {
    gap: 2,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 32,
    color: colors.text.primary,
  },
  seasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  season: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  list: {
    gap: 10,
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
    pointerEvents: 'none',
  },
});
