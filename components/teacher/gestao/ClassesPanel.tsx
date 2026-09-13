import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomSheet, SheetHeader } from '@/components/ui/BottomSheet';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { DashedButton } from '@/components/ui/DashedButton';
import { Glyph } from '@/components/ui/Glyph';
import { IconButton } from '@/components/ui/IconButton';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/Toast';
import { colors, fonts, solidShadow, withAlpha } from '@/constants/theme';
import { classShortName } from '@/lib/school';
import { useSchool } from '@/store/SchoolProvider';

const CLASS_COLORS = [
  { color: colors.brand.primary, depth: colors.depth.primary },
  { color: colors.accent.manaCyan, depth: colors.depth.cyan },
  { color: colors.accent.hpPink, depth: colors.depth.pink },
  { color: colors.accent.xpGold, depth: colors.depth.gold },
  { color: colors.accent.success, depth: colors.depth.success },
];

export function ClassesPanel() {
  const { managedClasses, currentClassId, selectClass, roster, activities } = useSchool();
  const { showToast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <View style={styles.list}>
      {managedClasses.map((item) => {
        const current = item.id === currentClassId;
        const students = roster.filter((student) => student.classId === item.id).length;
        const classActivities = activities.filter((activity) => activity.classId === item.id).length;
        const engagementColor = item.weeklyEngagement >= 0.6 ? colors.accent.success : colors.accent.xpGold;

        return (
          <View key={item.id} style={[styles.card, current && styles.cardCurrent]}>
            {/* Só a parte de cima é tocável: o botão de copiar fica fora para não aninhar botões. */}
            <Pressable
              onPress={() => {
                if (current) return;
                selectClass(item.id);
                showToast(`Acompanhando o ${item.name}`);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: current }}
              accessibilityLabel={`${item.name}${current ? ', turma atual' : '. Tocar para acompanhar'}`}
              style={styles.cardMain}>
              <View style={styles.header}>
                <View style={[styles.badge, { backgroundColor: item.color }, solidShadow(4, item.depthColor)]}>
                  <Text style={styles.badgeText}>{item.shortName}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.meta}>
                    {students} {students === 1 ? 'aluno' : 'alunos'} · {classActivities}{' '}
                    {classActivities === 1 ? 'atividade' : 'atividades'}
                  </Text>
                </View>
                {current ? (
                  <View style={styles.currentChip}>
                    <Text style={styles.currentChipText}>ATUAL</Text>
                  </View>
                ) : (
                  <Glyph name="chevronRight" size={18} strokeWidth={3} color={colors.text.secondary} />
                )}
              </View>

              <View style={styles.engagement}>
                <View style={styles.engagementHeader}>
                  <Text style={styles.engagementLabel}>Engajamento semanal</Text>
                  <Text style={[styles.engagementValue, { color: engagementColor }]}>
                    {Math.round(item.weeklyEngagement * 100)}%
                  </Text>
                </View>
                <View style={styles.track}>
                  <View
                    style={[styles.fill, { width: `${item.weeklyEngagement * 100}%`, backgroundColor: engagementColor }]}
                  />
                </View>
              </View>
            </Pressable>

            {current && (
              <View style={styles.code}>
                <View style={styles.info}>
                  <Text style={styles.codeLabel}>CÓDIGO DE CONVITE</Text>
                  <Text style={styles.codeValue}>{item.inviteCode}</Text>
                </View>
                <IconButton
                  icon="copy"
                  size={40}
                  accessibilityLabel="Copiar código de convite"
                  onPress={async () => {
                    await Clipboard.setStringAsync(item.inviteCode);
                    showToast(`Código ${item.inviteCode} copiado`);
                  }}
                />
              </View>
            )}
          </View>
        );
      })}

      <DashedButton label="Criar nova turma" onPress={() => setCreateOpen(true)} />

      {createOpen && <NewClassSheet onClose={() => setCreateOpen(false)} />}
    </View>
  );
}

function NewClassSheet({ onClose }: { onClose: () => void }) {
  const { createClass, selectClass, managedClasses } = useSchool();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [colorIndex, setColorIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const trimmed = name.trim();
  const error = !trimmed
    ? 'Dê um nome para a turma.'
    : managedClasses.some((item) => item.name.toLowerCase() === trimmed.toLowerCase())
      ? 'Você já tem uma turma com esse nome.'
      : undefined;
  const choice = CLASS_COLORS[colorIndex];

  return (
    <BottomSheet onClose={onClose}>
      <SheetHeader eyebrow="NOVA TURMA" eyebrowColor={colors.accent.success} title="Criar turma" onClose={onClose} />

      <View style={styles.preview}>
        <View style={[styles.badge, { backgroundColor: choice.color }, solidShadow(4, choice.depth)]}>
          <Text style={styles.badgeText}>{trimmed ? classShortName(trimmed) : '?'}</Text>
        </View>
        <Text style={styles.previewName}>{trimmed || 'Nome da turma'}</Text>
      </View>

      <TextField
        label="NOME DA TURMA"
        value={name}
        onChangeText={setName}
        placeholder="Ex.: 8º Ano A"
        error={submitted ? error : undefined}
      />

      <View style={styles.section}>
        <SectionLabel label="COR" />
        <View style={styles.colors}>
          {CLASS_COLORS.map((item, index) => (
            <Pressable
              key={item.color}
              onPress={() => setColorIndex(index)}
              accessibilityRole="radio"
              accessibilityState={{ selected: index === colorIndex }}
              accessibilityLabel={`Cor ${index + 1}`}
              style={[styles.swatchRing, index === colorIndex && { borderColor: item.color }]}>
              <View style={[styles.swatch, { backgroundColor: item.color }]} />
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={styles.hint}>Um código de convite é gerado automaticamente para os alunos entrarem na turma.</Text>

      <ChunkyButton
        icon="plus"
        label="CRIAR TURMA"
        color={colors.accent.success}
        depthColor={colors.depth.success}
        textColor={colors.bg.base}
        onPress={() => {
          setSubmitted(true);
          if (error) return;
          const created = createClass({ name: trimmed, color: choice.color, depthColor: choice.depth });
          selectClass(created.id);
          showToast(`${created.name} criada · código ${created.inviteCode}`);
          onClose();
        }}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  card: {
    gap: 12,
    padding: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  cardCurrent: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.bg.surface2,
    ...solidShadow(4, colors.depth.primary),
  },
  cardMain: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.bg.base,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  name: {
    fontFamily: fonts.black,
    fontSize: 16,
    color: colors.text.primary,
  },
  meta: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  currentChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: withAlpha(colors.accent.success, 0.15),
  },
  currentChipText: {
    fontFamily: fonts.black,
    fontSize: 10,
    letterSpacing: 0.4,
    color: colors.accent.success,
  },
  engagement: {
    gap: 5,
  },
  engagementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  engagementLabel: {
    fontFamily: fonts.extraBold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  engagementValue: {
    fontFamily: fonts.black,
    fontSize: 11,
  },
  track: {
    height: 8,
    borderRadius: 99,
    overflow: 'hidden',
    backgroundColor: colors.bg.base,
  },
  fill: {
    height: 8,
    borderRadius: 99,
  },
  code: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 14,
    backgroundColor: colors.bg.base,
  },
  codeLabel: {
    fontFamily: fonts.black,
    fontSize: 9,
    letterSpacing: 0.72,
    color: colors.text.secondary,
  },
  codeValue: {
    fontFamily: fonts.display,
    fontSize: 18,
    letterSpacing: 1.1,
    color: colors.accent.xpGold,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.bg.base,
  },
  previewName: {
    fontFamily: fonts.black,
    fontSize: 16,
    color: colors.text.primary,
  },
  section: {
    gap: 8,
  },
  colors: {
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
  hint: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 17,
    color: colors.text.secondary,
  },
});
