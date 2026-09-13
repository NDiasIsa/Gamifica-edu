import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AvatarPreview } from '@/components/profile/AvatarPreview';
import { CosmeticCard } from '@/components/profile/CosmeticCard';
import { PlayerSummary } from '@/components/profile/PlayerSummary';
import { Glyph } from '@/components/ui/Glyph';
import { profileGlows, ScreenBackground } from '@/components/ui/ScreenBackground';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { colors, fonts } from '@/constants/theme';
import { cosmeticCategories, cosmetics, getCosmetic } from '@/data/cosmetics';
import { avatarGlow, buildAvatar, cosmeticStatus } from '@/lib/cosmetics';
import { formatNumber } from '@/lib/progression';
import { useGame } from '@/store/GameProvider';
import type { CosmeticCategory } from '@/types/game';

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const { student, totalXp, level, classPosition, buyCosmetic, equipCosmetic } = useGame();
  const [category, setCategory] = useState<CosmeticCategory>('roupas');
  /** Item que o aluno está experimentando; null = mostra o que está equipado. */
  const [tryingId, setTryingId] = useState<string | null>(null);

  const { equippedCosmetics: equipped, ownedCosmeticIds: owned } = student;
  const tryingItem = tryingId ? getCosmetic(tryingId) : undefined;
  const selectedItem = tryingItem ?? getCosmetic(equipped[category]);
  const statusOf = (id: string) => cosmeticStatus(getCosmetic(id)!, owned, equipped, level.level);

  const changeCategory = (next: CosmeticCategory) => {
    setCategory(next);
    setTryingId(null);
  };

  const items = cosmetics.filter((item) => item.category === category);

  return (
    <ScreenBackground glows={profileGlows}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 4 }]}
        showsVerticalScrollIndicator={false}>
        <PlayerSummary student={student} totalXp={totalXp} level={level.level} classPosition={classPosition} />

        {selectedItem && (
          <AvatarPreview
            palette={buildAvatar(equipped, tryingItem)}
            glow={avatarGlow(equipped, tryingItem)}
            item={selectedItem}
            status={statusOf(selectedItem.id)}
            coins={student.coins}
            onBuy={() => buyCosmetic(selectedItem.id) && setTryingId(null)}
            onEquip={() => {
              equipCosmetic(selectedItem.id);
              setTryingId(null);
            }}
          />
        )}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitle}>
            <Glyph name="shirt" size={20} color={colors.accent.hpPink} />
            <Text style={styles.sectionTitleText}>PERSONALIZAÇÃO</Text>
          </View>
          <View style={styles.coins} accessibilityLabel={`${student.coins} moedas`}>
            <Glyph name="coin" size={16} strokeWidth={2.6} color={colors.accent.xpGold} />
            <Text style={styles.coinsText}>C$ {formatNumber(student.coins)}</Text>
          </View>
        </View>

        <SegmentedControl
          height={40}
          fontSize={12}
          value={category}
          onChange={changeCategory}
          options={cosmeticCategories.map(({ id, label }) => ({ value: id, label }))}
        />

        <View style={styles.grid}>
          {items.map((item) => (
            <CosmeticCard
              key={item.id}
              item={item}
              palette={buildAvatar(equipped, item)}
              status={statusOf(item.id)}
              selected={selectedItem?.id === item.id}
              // Tocar no item equipado volta a mostrar o visual atual.
              onPress={() => setTryingId(equipped[category] === item.id ? null : item.id)}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 10,
    paddingHorizontal: 20,
    // Espaço para o botão central da BottomNav, que invade a tela.
    paddingBottom: 56,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitleText: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.text.primary,
  },
  coins: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
    paddingLeft: 8,
    paddingRight: 11,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  coinsText: {
    fontFamily: fonts.black,
    fontSize: 13,
    color: colors.accent.xpGold,
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
  },
});
