import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomSheet, SheetHeader } from '@/components/ui/BottomSheet';
import { Glyph } from '@/components/ui/Glyph';
import { colors, fonts, solidShadow } from '@/constants/theme';
import { useSchool } from '@/store/SchoolProvider';

type ClassPickerSheetProps = {
  onClose: () => void;
  onManage?: () => void;
};

export function ClassPickerSheet({ onClose, onManage }: ClassPickerSheetProps) {
  const { managedClasses, currentClassId, selectClass, roster, activities } = useSchool();

  return (
    <BottomSheet onClose={onClose}>
      <SheetHeader eyebrow="SUAS TURMAS" eyebrowColor={colors.accent.manaCyan} title="Trocar de turma" onClose={onClose} />
      {managedClasses.map((item) => {
        const selected = item.id === currentClassId;
        const students = roster.filter((student) => student.classId === item.id).length;
        const classActivities = activities.filter((activity) => activity.classId === item.id).length;
        return (
          <Pressable
            key={item.id}
            onPress={() => {
              selectClass(item.id);
              onClose();
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={({ pressed }) => [styles.row, selected && styles.rowSelected, pressed && styles.pressed]}>
            <View style={[styles.badge, { backgroundColor: item.color }, solidShadow(3, item.depthColor)]}>
              <Text style={styles.badgeText}>{item.shortName}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {students} {students === 1 ? 'aluno' : 'alunos'} · {classActivities}{' '}
                {classActivities === 1 ? 'atividade' : 'atividades'}
              </Text>
            </View>
            {selected && <Glyph name="check" size={20} strokeWidth={3} color={colors.accent.success} />}
          </Pressable>
        );
      })}
      {onManage && (
        <Pressable onPress={onManage} accessibilityRole="button" style={styles.manage}>
          <Glyph name="sliders" size={16} color={colors.brand.primaryLight} />
          <Text style={styles.manageText}>Gerenciar turmas</Text>
        </Pressable>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface2,
  },
  rowSelected: {
    borderColor: colors.accent.success,
  },
  pressed: {
    opacity: 0.8,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.bg.base,
  },
  info: {
    flex: 1,
    gap: 1,
  },
  name: {
    fontFamily: fonts.black,
    fontSize: 15,
    color: colors.text.primary,
  },
  meta: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  manage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  manageText: {
    fontFamily: fonts.black,
    fontSize: 13,
    color: colors.brand.primaryLight,
  },
});
