import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { Glyph } from '@/components/ui/Glyph';
import { PixelSprite } from '@/components/ui/PixelAvatar';
import { colors, fonts, solidShadow, withAlpha } from '@/constants/theme';
import type { CosmeticStatus } from '@/lib/cosmetics';
import { formatNumber } from '@/lib/progression';
import type { AvatarPalette, Cosmetic } from '@/types/game';

type AvatarPreviewProps = {
  palette: AvatarPalette;
  glow: string;
  item: Cosmetic;
  status: CosmeticStatus;
  coins: number;
  onBuy: () => void;
  onEquip: () => void;
};

const MAGENTA_LIGHT = '#F0ABFC';

const sparkles = [
  { left: '11%', top: 58, size: 6, color: colors.accent.xpGold },
  { left: '86%', top: 40, size: 5, color: colors.accent.manaCyan },
  { left: '80%', top: 120, size: 4, color: MAGENTA_LIGHT },
  { left: '20%', top: 132, size: 4, color: colors.brand.primaryLight },
] as const;

export function AvatarPreview({ palette, glow, item, status, coins, onBuy, onEquip }: AvatarPreviewProps) {
  const missingCoins = Math.max(0, item.price - coins);

  const eyebrow = {
    equipped: { text: 'EQUIPADO', color: colors.accent.success },
    owned: { text: 'EXPERIMENTANDO', color: MAGENTA_LIGHT },
    forSale: { text: 'EXPERIMENTANDO', color: MAGENTA_LIGHT },
    locked: { text: 'BLOQUEADO', color: colors.text.secondary },
  }[status];

  return (
    <View style={styles.card}>
      {/* Brilho radial na cor do fundo equipado/experimentado. */}
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <RadialGradient id="preview-glow" cx="50%" cy="42%" r="62%">
            <Stop offset="0" stopColor={glow} stopOpacity={0.45} />
            <Stop offset="1" stopColor={colors.bg.surface2} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#preview-glow)" />
      </Svg>

      <View style={styles.tag}>
        <Text style={styles.tagText}>PRÉ-VISUALIZAÇÃO</Text>
      </View>

      {sparkles.map((sparkle) => (
        <View
          key={sparkle.left}
          style={[
            styles.sparkle,
            {
              left: sparkle.left,
              top: sparkle.top,
              width: sparkle.size,
              height: sparkle.size,
              backgroundColor: sparkle.color,
            },
          ]}
        />
      ))}

      <View style={styles.ground} />
      <View style={styles.sprite} accessibilityLabel={`Personagem usando ${item.name}`}>
        <PixelSprite palette={palette} size={144} />
      </View>

      <View style={styles.bar}>
        <View style={styles.barText}>
          <Text style={[styles.eyebrow, { color: eyebrow.color }]}>{eyebrow.text}</Text>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          {status === 'forSale' && missingCoins > 0 && (
            <Text style={styles.missing}>Faltam C$ {formatNumber(missingCoins)}</Text>
          )}
        </View>

        {status === 'equipped' && (
          <View style={[styles.chip, { backgroundColor: withAlpha(colors.accent.success, 0.16) }]}>
            <Glyph name="check" size={14} strokeWidth={3.4} color={colors.accent.success} />
            <Text style={[styles.chipText, { color: colors.accent.success }]}>EM USO</Text>
          </View>
        )}

        {status === 'locked' && (
          <View style={[styles.chip, { backgroundColor: colors.bg.surface2 }]}>
            <Glyph name="lock" size={14} strokeWidth={2.8} color={colors.text.secondary} />
            <Text style={[styles.chipText, { color: colors.text.secondary }]}>NV {item.requiredLevel}</Text>
          </View>
        )}

        {status === 'owned' && (
          <Pressable
            onPress={onEquip}
            accessibilityRole="button"
            accessibilityLabel={`Equipar ${item.name}`}
            style={({ pressed }) => [styles.action, styles.equip, pressed && styles.pressed]}>
            <Text style={[styles.actionText, { color: colors.text.onColor }]}>EQUIPAR</Text>
          </Pressable>
        )}

        {status === 'forSale' && (
          <Pressable
            onPress={onBuy}
            disabled={missingCoins > 0}
            accessibilityRole="button"
            accessibilityLabel={`Comprar ${item.name} por ${item.price} moedas`}
            accessibilityState={{ disabled: missingCoins > 0 }}
            style={({ pressed }) => [
              styles.action,
              styles.buy,
              pressed && styles.pressed,
              missingCoins > 0 && styles.disabled,
            ]}>
            <Text style={styles.actionText}>COMPRAR</Text>
            <View style={styles.divider} />
            <Glyph name="coin" size={16} strokeWidth={2.6} color={colors.bg.base} />
            <Text style={styles.price}>C$ {formatNumber(item.price)}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 248,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.brand.primary,
    backgroundColor: colors.bg.surface2,
    overflow: 'hidden',
    ...solidShadow(5, colors.depth.header),
  },
  tag: {
    position: 'absolute',
    left: 12,
    top: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(18,12,34,0.6)',
  },
  tagText: {
    fontFamily: fonts.black,
    fontSize: 9,
    letterSpacing: 0.9,
    color: colors.brand.primaryLight,
  },
  sparkle: {
    position: 'absolute',
  },
  ground: {
    position: 'absolute',
    top: 146,
    alignSelf: 'center',
    width: 170,
    height: 30,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(196,181,253,0.35)',
    backgroundColor: 'rgba(10,6,22,0.55)',
  },
  sprite: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
  },
  bar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(18,12,34,0.78)',
  },
  barText: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  eyebrow: {
    fontFamily: fonts.black,
    fontSize: 9,
    letterSpacing: 0.9,
  },
  itemName: {
    fontFamily: fonts.black,
    fontSize: 15,
    color: colors.text.primary,
  },
  missing: {
    fontFamily: fonts.extraBold,
    fontSize: 11,
    color: colors.accent.hpPink,
  },
  chip: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  chipText: {
    fontFamily: fonts.black,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  action: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  buy: {
    backgroundColor: colors.accent.xpGold,
    ...solidShadow(4, colors.depth.gold),
  },
  equip: {
    backgroundColor: colors.brand.primary,
    ...solidShadow(4, colors.depth.primary),
  },
  pressed: {
    transform: [{ translateY: 2 }],
  },
  disabled: {
    opacity: 0.5,
  },
  actionText: {
    fontFamily: fonts.black,
    fontSize: 13,
    letterSpacing: 0.5,
    color: colors.bg.base,
  },
  divider: {
    width: 2,
    height: 18,
    backgroundColor: 'rgba(18,12,34,0.25)',
  },
  price: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.bg.base,
  },
});
