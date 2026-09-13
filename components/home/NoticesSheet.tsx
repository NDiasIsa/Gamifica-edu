import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BottomSheet, SheetHeader } from '@/components/ui/BottomSheet';
import { Glyph, type GlyphName } from '@/components/ui/Glyph';
import { colors, fonts, withAlpha } from '@/constants/theme';
import { useSchool } from '@/store/SchoolProvider';
import type { StudentNotice } from '@/types/game';

const kindMeta: Record<StudentNotice['kind'], { icon: GlyphName; color: string }> = {
  message: { icon: 'mail', color: colors.brand.primaryLight },
  bonus: { icon: 'bolt', color: colors.accent.xpGold },
  grade: { icon: 'check', color: colors.accent.success },
};

/** Avisos do professor para o aluno: mensagens, XP bônus e correções. */
export function NoticesSheet({ studentId, onClose }: { studentId: string; onClose: () => void }) {
  const { notices, markNoticesRead } = useSchool();
  // Guarda quais estavam sem ler ao abrir, para destacar mesmo depois de marcar como lidos.
  const [unreadIds] = useState(() =>
    notices.filter((notice) => notice.studentId === studentId && !notice.read).map((notice) => notice.id),
  );

  useEffect(() => {
    markNoticesRead(studentId);
  }, [markNoticesRead, studentId]);

  const mine = notices.filter((notice) => notice.studentId === studentId);

  return (
    <BottomSheet onClose={onClose}>
      <SheetHeader eyebrow="AVISOS" eyebrowColor={colors.accent.manaCyan} title="Recados do professor" onClose={onClose} />
      {mine.length === 0 && <Text style={styles.empty}>Nenhum aviso por enquanto.</Text>}
      {mine.map((notice) => {
        const meta = kindMeta[notice.kind];
        const isNew = unreadIds.includes(notice.id);
        return (
          <View key={notice.id} style={[styles.card, isNew && styles.cardNew]}>
            <View style={[styles.icon, { backgroundColor: withAlpha(meta.color, 0.16) }]}>
              <Glyph name={meta.icon} size={18} strokeWidth={2.6} color={meta.color} />
            </View>
            <View style={styles.text}>
              <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={2}>
                  {notice.title}
                </Text>
                {isNew && <Text style={styles.newTag}>NOVO</Text>}
              </View>
              <Text style={styles.body}>{notice.body}</Text>
            </View>
          </View>
        );
      })}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  empty: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.text.secondary,
  },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface2,
  },
  cardNew: {
    borderColor: colors.brand.primary,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.text.primary,
  },
  newTag: {
    fontFamily: fonts.display,
    fontSize: 11,
    color: colors.brand.magenta,
  },
  body: {
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
  },
});
