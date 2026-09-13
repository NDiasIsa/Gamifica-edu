import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Glyph } from '@/components/ui/Glyph';
import { PixelSprite } from '@/components/ui/PixelAvatar';
import { colors, fonts, solidShadow, withAlpha } from '@/constants/theme';
import type { CosmeticStatus } from '@/lib/cosmetics';
import { formatNumber } from '@/lib/progression';
import type { AvatarPalette, Cosmetic } from '@/types/game';

type CosmeticCardProps = {
  item: Cosmetic;
  /** Paleta do personagem vestindo este item, usada na miniatura. */
  palette: AvatarPalette;
  status: CosmeticStatus;
  selected: boolean;
  onPress: () => void;
};

/** Miniatura do item (parte do personagem ou amostra do fundo). Também usada na gestão da loja. */
export function Thumbnail({ item, palette }: { item: Pick<Cosmetic, 'category'>; palette: AvatarPalette }) {
  switch (item.category) {
    case 'chapeus':
      return <PixelSprite palette={palette} part="hat" size={25} />;
    case 'roupas':
      return <PixelSprite palette={palette} part="outfit" size={30} />;
    case 'acessorios':
      return palette.staff ? (
        <PixelSprite palette={palette} part="staff" size={38} />
      ) : (
        <Glyph name="close" size={20} strokeWidth={2.8} color={colors.text.secondary} />
      );
    case 'fundos':
      return (
        <LinearGradient colors={palette.background} style={[styles.swatch, { borderColor: palette.border }]}>
          <View style={[styles.swatchSparkle, { left: 8, top: 6, backgroundColor: colors.accent.xpGold }]} />
          <View style={[styles.swatchSparkle, { right: 10, top: 14, backgroundColor: colors.accent.manaCyan }]} />
        </LinearGradient>
      );
  }
}

export function CosmeticCard({ item, palette, status, selected, onPress }: CosmeticCardProps) {
  const equipped = status === 'equipped';
  const locked = status === 'locked';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${item.name}, ${statusLabel(item, status)}`}
      style={({ pressed }) => [
        styles.card,
        equipped && styles.cardEquipped,
        selected && !equipped && styles.cardSelected,
        selected && equipped && solidShadow(4, colors.depth.success),
        pressed && styles.pressed,
      ]}>
      <View style={styles.thumb}>
        <View style={locked && styles.lockedThumb}>
          <Thumbnail item={item} palette={palette} />
        </View>
        {locked && (
          <View style={styles.lockOverlay}>
            <Glyph name="lock" size={18} strokeWidth={2.6} color={colors.text.primary} />
          </View>
        )}
      </View>

      <View style={styles.nameBox}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
      </View>

      <StatusPill item={item} status={status} />
    </Pressable>
  );
}

function statusLabel(item: Cosmetic, status: CosmeticStatus) {
  switch (status) {
    case 'equipped':
      return 'equipado';
    case 'owned':
      return 'comprado';
    case 'locked':
      return `desbloqueia no nível ${item.requiredLevel}`;
    case 'forSale':
      return `custa ${item.price} moedas`;
  }
}

function StatusPill({ item, status }: { item: Cosmetic; status: CosmeticStatus }) {
  switch (status) {
    case 'equipped':
      return (
        <View style={[styles.pill, { backgroundColor: withAlpha(colors.accent.success, 0.16) }]}>
          <Glyph name="check" size={11} strokeWidth={3.4} color={colors.accent.success} />
          <Text style={[styles.pillSmall, { color: colors.accent.success }]}>EQUIPADO</Text>
        </View>
      );
    case 'owned':
      return (
        <View style={[styles.pill, { backgroundColor: colors.bg.surface2 }]}>
          <Text style={[styles.pillSmall, { color: colors.brand.primaryLight }]}>COMPRADO</Text>
        </View>
      );
    case 'locked':
      return (
        <View style={[styles.pill, { backgroundColor: colors.bg.surface2 }]}>
          <Glyph name="lock" size={11} strokeWidth={2.8} color={colors.text.secondary} />
          <Text style={[styles.pillText, { color: colors.text.secondary }]}>NV {item.requiredLevel}</Text>
        </View>
      );
    case 'forSale':
      return (
        <View style={[styles.pill, { backgroundColor: withAlpha(colors.accent.xpGold, 0.16) }]}>
          <Glyph name="coin" size={12} strokeWidth={2.6} color={colors.accent.xpGold} />
          <Text style={[styles.pillText, { color: colors.accent.xpGold }]}>C$ {formatNumber(item.price)}</Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  cardEquipped: {
    borderColor: colors.accent.success,
  },
  cardSelected: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.bg.surface2,
    ...solidShadow(4, colors.depth.primary),
  },
  pressed: {
    transform: [{ translateY: 2 }],
  },
  thumb: {
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg.base,
  },
  lockedThumb: {
    opacity: 0.35,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: {
    width: 56,
    height: 30,
    borderRadius: 8,
    borderWidth: 2,
  },
  swatchSparkle: {
    position: 'absolute',
    width: 3,
    height: 3,
  },
  nameBox: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: fonts.black,
    fontSize: 11,
    lineHeight: 13,
    textAlign: 'center',
    color: colors.text.primary,
  },
  pill: {
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    borderRadius: 7,
  },
  pillSmall: {
    fontFamily: fonts.black,
    fontSize: 9,
    letterSpacing: 0.36,
  },
  pillText: {
    fontFamily: fonts.black,
    fontSize: 11,
  },
});
