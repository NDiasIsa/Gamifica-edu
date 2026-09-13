import { StyleSheet, Text, View } from 'react-native';

import { fonts, withAlpha } from '@/constants/theme';
import type { Subject } from '@/types/game';

export function SubjectTag({ subject }: { subject: Subject }) {
  return (
    <View style={[styles.tag, { backgroundColor: withAlpha(subject.color, 0.18) }]}>
      <Text style={[styles.label, { color: subject.color }]}>{subject.name.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  label: {
    fontFamily: fonts.black,
    fontSize: 10,
    letterSpacing: 0.8,
  },
});
