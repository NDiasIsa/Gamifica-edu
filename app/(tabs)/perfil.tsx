import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AvatarPreview } from '@/components/profile/AvatarPreview';
import { CosmeticCard } from '@/components/profile/CosmeticCard';
import { PlayerSummary } from '@/components/profile/PlayerSummary';
import { Glyph } from '@/components/ui/Glyph';
import { profileGlows, ScreenBackground } from '@/components/ui/ScreenBackground';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { colors, fonts } from '@/constants/theme';
import { cosmeticCategories } from '@/data/cosmetics';
import { avatarGlow, buildAvatar, cosmeticStatus } from '@/lib/cosmetics';
import { formatNumber } from '@/lib/progression';
import { useGame } from '@/store/GameProvider';
import { useSchool } from '@/store/SchoolProvider';
import type { Cosmetic, CosmeticCategory } from '@/types/game';

const GRID_COLUMNS = 4;

export default function PerfilScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { student, totalXp, level, classPosition, buyCosmetic, equipCosmetic } = useGame();
  const { cosmetics } = useSchool();
  const [category, setCategory] = useState<CosmeticCategory>('roupas');
  /** Item que o aluno está experimentando; null = mostra o que está equipado. */
  const [tryingId, setTryingId] = useState<string | null>(null);

  const { equippedCosmetics: equipped, ownedCosmeticIds: owned } = student;
  const findItem = (id: string | null) => cosmetics.find((item) => item.id === id);
  const tryingItem = findItem(tryingId);
  const selectedItem = tryingItem ?? findItem(equipped[category]);
  const statusOf = (item: Cosmetic) => cosmeticStatus(item, owned, equipped, level.level);

  const changeCategory = (next: CosmeticCategory) => {
    setCategory(next);
    setTryingId(null);
  };

  // Itens ocultos pelo professor saem da loja, mas quem já comprou continua vendo.
  const items = cosmetics.filter((item) => item.category === category && (item.active || owned.includes(item.id)));
  const rows = Array.from({ length: Math.ceil(items.length / GRID_COLUMNS) }, (_, index) =>
    items.slice(index * GRID_COLUMNS, (index + 1) * GRID_COLUMNS),
  );

  return (
    <ScreenBackground glows={profileGlows}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 4 }]}
        showsVerticalScrollIndicator={false}>
        <PlayerSummary student={student} totalXp={totalXp} level={level.level} classPosition={classPosition} />

        {selectedItem && (
          <AvatarPreview
            palette={buildAvatar(equipped, cosmetics, tryingItem)}
            glow={avatarGlow(equipped, cosmetics, tryingItem)}
            item={selectedItem}
            status={statusOf(selectedItem)}
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

        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.grid}>
            {row.map((item) => (
              <CosmeticCard
                key={item.id}
                item={item}
                palette={buildAvatar(equipped, cosmetics, item)}
                status={statusOf(item)}
                selected={selectedItem?.id === item.id}
                // Tocar no item equipado volta a mostrar o visual atual.
                onPress={() => setTryingId(equipped[category] === item.id ? null : item.id)}
              />
            ))}
            {/* Completa a última linha para os cards manterem a mesma largura. */}
            {Array.from({ length: GRID_COLUMNS - row.length }, (_, index) => (
              <View key={`vazio-${index}`} style={styles.gridFiller} />
            ))}
          </View>
        ))}

        <Pressable
          onPress={() => router.replace('/professor')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.teacherMode, pressed && styles.pressed]}>
          <Glyph name="cap" size={18} strokeWidth={2.4} color={colors.accent.manaCyan} />
          <Text style={styles.teacherModeText}>Entrar no modo professor</Text>
          <Text style={styles.teacherModeHint}>demonstração</Text>
        </Pressable>
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
  gridFiller: {
    flex: 1,
  },
  teacherMode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.bg.border,
  },
  pressed: {
    opacity: 0.7,
  },
  teacherModeText: {
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.accent.manaCyan,
  },
  teacherModeHint: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
});
