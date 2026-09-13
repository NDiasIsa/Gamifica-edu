import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Thumbnail } from '@/components/profile/CosmeticCard';
import { BottomSheet, SheetHeader } from '@/components/ui/BottomSheet';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { DashedButton } from '@/components/ui/DashedButton';
import { Glyph } from '@/components/ui/Glyph';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Stepper } from '@/components/ui/Stepper';
import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/Toast';
import { Toggle } from '@/components/ui/Toggle';
import { colors, fonts } from '@/constants/theme';
import { cosmeticCategories, cosmeticColorPresets, initialEquippedCosmetics } from '@/data/cosmetics';
import { buildAvatar } from '@/lib/cosmetics';
import { formatNumber } from '@/lib/progression';
import { useSchool } from '@/store/SchoolProvider';
import type { Cosmetic, CosmeticCategory } from '@/types/game';

const PRICE_PRESETS = [0, 50, 100, 200, 500];
const priceLabel = (price: number) => (price === 0 ? 'Grátis' : `C$ ${formatNumber(price)}`);
const levelLabel = (level: number) => (level <= 1 ? 'Livre' : `Nv ${level}`);

export function ShopPanel() {
  const { cosmetics, updateCosmetic } = useSchool();
  const { showToast } = useToast();
  const [category, setCategory] = useState<CosmeticCategory>('roupas');
  const [editing, setEditing] = useState<Cosmetic | null>(null);
  const [creating, setCreating] = useState(false);

  const activeCount = cosmetics.filter((item) => item.active).length;
  const monthlySales = cosmetics.reduce((sum, item) => sum + item.sales, 0);
  const items = cosmetics.filter((item) => item.category === category);
  const previewOf = (item: Pick<Cosmetic, 'category' | 'look'> & { id?: string }) =>
    buildAvatar(initialEquippedCosmetics, cosmetics, { id: item.id ?? 'preview', name: '', price: 0, active: true, sales: 0, ...item });

  return (
    <View style={styles.list}>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Glyph name="shirt" size={18} color={colors.accent.hpPink} />
          <Text style={styles.statValue}>{activeCount}</Text>
          <Text style={styles.statLabel}>itens ativos</Text>
        </View>
        <View style={styles.stat}>
          <Glyph name="coin" size={18} strokeWidth={2.6} color={colors.accent.xpGold} />
          <Text style={styles.statValue}>{monthlySales}</Text>
          <Text style={styles.statLabel}>vendas no mês</Text>
        </View>
      </View>

      <SegmentedControl
        height={40}
        fontSize={12}
        value={category}
        onChange={setCategory}
        options={cosmeticCategories.map(({ id, label }) => ({ value: id, label }))}
      />

      {items.map((item) => {
        const subtitle =
          item.price === 0 && !item.requiredLevel
            ? 'Item inicial'
            : `${levelLabel(item.requiredLevel ?? 0)} · ${item.sales} ${item.sales === 1 ? 'venda' : 'vendas'}`;
        return (
          <View key={item.id} style={styles.row}>
            <View style={[styles.thumb, !item.active && styles.inactive]}>
              <Thumbnail item={item} palette={previewOf(item)} />
            </View>
            <View style={styles.info}>
              <Text style={[styles.name, !item.active && styles.nameInactive]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
                {item.active ? '' : ' · oculto'}
              </Text>
            </View>
            <Pressable
              onPress={() => setEditing(item)}
              accessibilityRole="button"
              accessibilityLabel={`Preço de ${item.name}: ${priceLabel(item.price)}. Editar`}
              style={({ pressed }) => [styles.price, pressed && styles.pricePressed]}>
              <Glyph name="coin" size={13} strokeWidth={2.6} color={colors.accent.xpGold} />
              <Text style={styles.priceText}>{priceLabel(item.price)}</Text>
            </Pressable>
            <Toggle
              value={item.active}
              accessibilityLabel={`Mostrar ${item.name} na loja`}
              onChange={(active) => {
                updateCosmetic(item.id, { active });
                showToast(active ? `${item.name} voltou para a loja` : `${item.name} escondido da loja`);
              }}
            />
          </View>
        );
      })}

      <DashedButton label="Novo item" hint={cosmeticCategories.find((item) => item.id === category)?.label} onPress={() => setCreating(true)} />

      {editing && (
        <PriceSheet
          item={cosmetics.find((item) => item.id === editing.id) ?? editing}
          palette={previewOf(editing)}
          onClose={() => setEditing(null)}
        />
      )}
      {creating && <NewItemSheet initialCategory={category} previewOf={previewOf} onClose={() => setCreating(false)} />}
    </View>
  );
}

function PriceSheet({
  item,
  palette,
  onClose,
}: {
  item: Cosmetic;
  palette: ReturnType<typeof buildAvatar>;
  onClose: () => void;
}) {
  const { updateCosmetic } = useSchool();
  const { showToast } = useToast();
  const [price, setPrice] = useState(item.price);
  const [level, setLevel] = useState(item.requiredLevel ?? 1);

  return (
    <BottomSheet onClose={onClose}>
      <SheetHeader eyebrow="PREÇO NA LOJA" eyebrowColor={colors.accent.xpGold} title={item.name} onClose={onClose} />

      <View style={styles.previewBox}>
        <Thumbnail item={item} palette={palette} />
      </View>

      <View style={styles.section}>
        <SectionLabel label="PREÇO" hint="moedas (C$)" />
        <View style={styles.center}>
          <Stepper value={price} onChange={setPrice} step={10} min={0} max={2000} format={priceLabel} accessibilityLabel="preço" />
        </View>
        <View style={styles.presets}>
          {PRICE_PRESETS.map((preset) => (
            <Pressable
              key={preset}
              onPress={() => setPrice(preset)}
              accessibilityRole="button"
              style={[styles.preset, preset === price && styles.presetActive]}>
              <Text style={[styles.presetText, preset === price && styles.presetTextActive]}>{priceLabel(preset)}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionLabel label="NÍVEL MÍNIMO" hint="para o aluno poder comprar" />
        <View style={styles.center}>
          <Stepper value={level} onChange={setLevel} step={1} min={1} max={30} format={levelLabel} accessibilityLabel="nível mínimo" />
        </View>
      </View>

      <ChunkyButton
        icon="check"
        label="SALVAR"
        color={colors.accent.xpGold}
        depthColor={colors.depth.gold}
        textColor={colors.bg.base}
        onPress={() => {
          updateCosmetic(item.id, { price, requiredLevel: level > 1 ? level : undefined });
          showToast(`${item.name}: ${priceLabel(price)} · ${levelLabel(level)}`);
          onClose();
        }}
      />
    </BottomSheet>
  );
}

function NewItemSheet({
  initialCategory,
  previewOf,
  onClose,
}: {
  initialCategory: CosmeticCategory;
  previewOf: (item: Pick<Cosmetic, 'category' | 'look'>) => ReturnType<typeof buildAvatar>;
  onClose: () => void;
}) {
  const { createCosmetic, cosmetics } = useSchool();
  const { showToast } = useToast();
  const [category, setCategory] = useState(initialCategory);
  const [presetIndex, setPresetIndex] = useState(0);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(100);
  const [level, setLevel] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const preset = cosmeticColorPresets[category][presetIndex];
  const trimmed = name.trim();
  const error = !trimmed
    ? 'Dê um nome para o item.'
    : cosmetics.some((item) => item.name.toLowerCase() === trimmed.toLowerCase())
      ? 'Já existe um item com esse nome.'
      : undefined;

  return (
    <BottomSheet onClose={onClose}>
      <SheetHeader eyebrow="LOJA" eyebrowColor={colors.accent.hpPink} title="Novo item" onClose={onClose} />

      <SegmentedControl
        variant="base"
        height={40}
        fontSize={12}
        value={category}
        onChange={(next) => {
          setCategory(next);
          setPresetIndex(0);
        }}
        options={cosmeticCategories.map(({ id, label }) => ({ value: id, label }))}
      />

      <View style={styles.previewBox}>
        <Thumbnail item={{ category }} palette={previewOf({ category, look: preset.look })} />
      </View>

      <View style={styles.section}>
        <SectionLabel label="COR" />
        <View style={styles.swatches}>
          {cosmeticColorPresets[category].map((item, index) => (
            <Pressable
              key={item.swatch}
              onPress={() => setPresetIndex(index)}
              accessibilityRole="radio"
              accessibilityState={{ selected: index === presetIndex }}
              accessibilityLabel={`Cor ${index + 1}`}
              style={[styles.swatchRing, index === presetIndex && { borderColor: item.swatch }]}>
              <View style={[styles.swatch, { backgroundColor: item.swatch }]} />
            </Pressable>
          ))}
        </View>
      </View>

      <TextField label="NOME" value={name} onChangeText={setName} placeholder="Ex.: Capa do Dragão" error={submitted ? error : undefined} />

      <View style={styles.inlineSteppers}>
        <View style={styles.inlineStepper}>
          <SectionLabel label="PREÇO" />
          <Stepper value={price} onChange={setPrice} step={10} min={0} max={2000} format={priceLabel} accessibilityLabel="preço" />
        </View>
        <View style={styles.inlineStepper}>
          <SectionLabel label="NÍVEL" />
          <Stepper value={level} onChange={setLevel} step={1} min={1} max={30} format={levelLabel} accessibilityLabel="nível mínimo" />
        </View>
      </View>

      <ChunkyButton
        icon="plus"
        label="CRIAR ITEM"
        color={colors.accent.hpPink}
        depthColor={colors.depth.pink}
        textColor={colors.bg.base}
        onPress={() => {
          setSubmitted(true);
          if (error) return;
          createCosmetic({
            category,
            name: trimmed,
            price,
            requiredLevel: level > 1 ? level : undefined,
            look: preset.look,
            glow: preset.glow,
            active: true,
          });
          showToast(`${trimmed} já está na loja`);
          onClose();
        }}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 2,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.text.primary,
  },
  statLabel: {
    flexShrink: 1,
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  thumb: {
    width: 56,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg.base,
  },
  inactive: {
    opacity: 0.45,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  name: {
    fontFamily: fonts.black,
    fontSize: 13,
    color: colors.text.primary,
  },
  nameInactive: {
    color: colors.text.secondary,
  },
  subtitle: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  price: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.base,
  },
  pricePressed: {
    borderColor: colors.accent.xpGold,
  },
  priceText: {
    fontFamily: fonts.black,
    fontSize: 13,
    color: colors.accent.xpGold,
  },
  previewBox: {
    height: 72,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg.base,
  },
  section: {
    gap: 8,
  },
  center: {
    alignItems: 'center',
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  preset: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.base,
  },
  presetActive: {
    borderColor: colors.accent.xpGold,
  },
  presetText: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  presetTextActive: {
    fontFamily: fonts.black,
    color: colors.accent.xpGold,
  },
  swatches: {
    flexDirection: 'row',
    gap: 10,
  },
  swatchRing: {
    padding: 3,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 99,
  },
  inlineSteppers: {
    flexDirection: 'row',
    gap: 12,
  },
  inlineStepper: {
    flex: 1,
    gap: 6,
    alignItems: 'center',
  },
});
