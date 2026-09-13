import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomSheet, SheetHeader } from '@/components/ui/BottomSheet';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/Toast';
import { colors, fonts } from '@/constants/theme';
import { useSchool } from '@/store/SchoolProvider';
import type { RosterStudent } from '@/types/game';

const TEMPLATES = [
  'Parabéns pelo esforço desta semana!',
  'Não esqueça das atividades atrasadas.',
  'Senti sua falta no app. Tudo bem por aí?',
];

export function MessageSheet({ student, onClose }: { student: RosterStudent; onClose: () => void }) {
  const { sendMessage } = useSchool();
  const { showToast } = useToast();
  const [text, setText] = useState('');
  const firstName = student.name.split(' ')[0];

  return (
    <BottomSheet onClose={onClose}>
      <SheetHeader eyebrow="MENSAGEM" eyebrowColor={colors.accent.manaCyan} title={`Para ${firstName}`} onClose={onClose} />

      <View style={styles.section}>
        <SectionLabel label="SUGESTÕES" />
        <View style={styles.templates}>
          {TEMPLATES.map((template) => (
            <Pressable
              key={template}
              onPress={() => setText(template)}
              accessibilityRole="button"
              style={({ pressed }) => [styles.template, pressed && styles.pressed]}>
              <Text style={styles.templateText}>{template}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <TextField
        label="TEXTO"
        value={text}
        onChangeText={setText}
        placeholder={`Escreva um recado para ${firstName}`}
        multiline
        maxLength={280}
      />

      <ChunkyButton
        icon="send"
        label="ENVIAR"
        color={colors.brand.primary}
        depthColor={colors.depth.primary}
        disabled={!text.trim()}
        onPress={() => {
          sendMessage(student.id, text);
          showToast(`Mensagem enviada para ${firstName}`);
          onClose();
        }}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
  templates: {
    gap: 8,
  },
  template: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface2,
  },
  pressed: {
    borderColor: colors.brand.primary,
  },
  templateText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.text.primary,
  },
});
