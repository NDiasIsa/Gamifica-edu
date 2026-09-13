import { StyleSheet, Text, View } from 'react-native';

import { PixelAvatar } from '@/components/ui/PixelAvatar';
import { colors, fonts } from '@/constants/theme';
import type { AvatarPalette } from '@/types/game';

export type VersusPlayer = {
  name: string;
  avatar: AvatarPalette;
  /** Linha abaixo do nome (ex.: "#6 · 4.910 XP"). */
  caption: string;
  /** Placar grande exibido no lugar do avatar-legenda, no resultado do duelo. */
  score?: number;
};

export function VersusPanel({ me, rival }: { me: VersusPlayer; rival: VersusPlayer }) {
  return (
    <View style={styles.panel}>
      <Player player={me} />
      <Text style={styles.vs}>VS</Text>
      <Player player={rival} />
    </View>
  );
}

function Player({ player }: { player: VersusPlayer }) {
  return (
    <View style={styles.player}>
      <PixelAvatar palette={player.avatar} />
      <Text style={styles.name} numberOfLines={1}>
        {player.name}
      </Text>
      <Text style={styles.caption} numberOfLines={1}>
        {player.caption}
      </Text>
      {player.score !== undefined && <Text style={styles.score}>{player.score}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 18,
    backgroundColor: colors.bg.base,
  },
  player: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.text.primary,
  },
  caption: {
    fontFamily: fonts.extraBold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  score: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.text.primary,
  },
  vs: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.brand.magenta,
    textShadowColor: colors.depth.magenta,
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 0,
  },
});
