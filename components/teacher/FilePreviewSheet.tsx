import { StyleSheet, Text, View } from 'react-native';

import { BottomSheet, SheetHeader } from '@/components/ui/BottomSheet';
import { colors, fonts } from '@/constants/theme';
import type { Submission } from '@/types/game';

// Tamanhos das "linhas de texto" da página simulada.
const LINES = [0.92, 0.78, 0.86, 0.6, 0.95, 0.82, 0.7, 0.88, 0.5];

/** Pré-visualização simulada do arquivo enviado (sem servidor de arquivos no protótipo). */
export function FilePreviewSheet({
  submission,
  studentName,
  onClose,
}: {
  submission: Submission;
  studentName: string;
  onClose: () => void;
}) {
  return (
    <BottomSheet onClose={onClose}>
      <SheetHeader eyebrow="ARQUIVO" eyebrowColor={colors.accent.hpPink} title={submission.fileName} onClose={onClose} />
      <Text style={styles.meta}>
        Enviado por {studentName} {submission.sentLabel} · {submission.fileInfo}
      </Text>
      <View style={styles.page} accessibilityLabel="Página do documento">
        <View style={[styles.line, styles.heading]} />
        {LINES.map((width, index) => (
          <View key={index} style={[styles.line, { width: `${width * 100}%` }]} />
        ))}
        <View style={styles.spacer} />
        {LINES.slice(0, 5).map((width, index) => (
          <View key={`b-${index}`} style={[styles.line, { width: `${width * 90}%` }]} />
        ))}
      </View>
      <Text style={styles.note}>A visualização completa do PDF fica disponível quando o app estiver ligado ao servidor da escola.</Text>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  meta: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  page: {
    gap: 8,
    padding: 18,
    borderRadius: 14,
    backgroundColor: '#F5F3FF',
  },
  heading: {
    width: '55%',
    height: 12,
    marginBottom: 6,
    backgroundColor: '#5B21B6',
  },
  line: {
    height: 7,
    borderRadius: 4,
    backgroundColor: '#C4B5FD',
  },
  spacer: {
    height: 8,
  },
  note: {
    fontFamily: fonts.bold,
    fontSize: 12,
    lineHeight: 17,
    color: colors.text.secondary,
  },
});
