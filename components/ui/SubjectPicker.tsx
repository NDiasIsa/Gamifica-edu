import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Glyph } from '@/components/ui/Glyph';
import { colors, fonts, solidShadow } from '@/constants/theme';
import { subjectOrder, subjects } from '@/data/mock';
import { subjectGlyph } from '@/lib/activityMeta';
import type { SubjectId } from '@/types/game';

type SubjectPickerProps = {
  selected: SubjectId[];
  onToggle: (subjectId: SubjectId) => void;
};

/** Grade com as matérias; as selecionadas ganham a cor da matéria e a sombra 3D. */
export function SubjectPicker({ selected, onToggle }: SubjectPickerProps) {
  return (
    <View style={styles.grid}>
      {subjectOrder.map((id) => {
        const subject = subjects[id];
        const active = selected.includes(id);
        return (
          <Pressable
            key={id}
            onPress={() => onToggle(id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: active }}
            accessibilityLabel={subject.name}
            style={({ pressed }) => [
              styles.tile,
              active
                ? { backgroundColor: subject.color, ...solidShadow(4, subject.depthColor) }
                : styles.tileIdle,
              pressed && styles.pressed,
            ]}>
            <Glyph
              name={subjectGlyph[id]}
              size={22}
              strokeWidth={2.8}
              color={active ? subject.onColor : subject.color}
            />
            <Text style={[styles.label, { color: active ? subject.onColor : colors.text.secondary }]} numberOfLines={1}>
              {subject.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 8,
  },
  tile: {
    flex: 1,
    height: 68,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  tileIdle: {
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface2,
  },
  pressed: {
    transform: [{ translateY: 2 }],
  },
  label: {
    fontFamily: fonts.black,
    fontSize: 11,
  },
});
