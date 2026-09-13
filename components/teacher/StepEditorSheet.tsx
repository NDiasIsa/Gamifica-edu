import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet, SheetHeader } from '@/components/ui/BottomSheet';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { Glyph } from '@/components/ui/Glyph';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Stepper } from '@/components/ui/Stepper';
import { TextField } from '@/components/ui/TextField';
import { colors } from '@/constants/theme';
import { createId } from '@/lib/school';
import type { MaterialFormat, StudyStep } from '@/types/game';

type StepEditorSheetProps = {
  /** Etapa existente para editar; sem ela, cria uma nova. */
  step?: StudyStep;
  onSave: (step: StudyStep) => void;
  onClose: () => void;
};

export function StepEditorSheet({ step, onSave, onClose }: StepEditorSheetProps) {
  const [title, setTitle] = useState(step?.title ?? '');
  const [format, setFormat] = useState<MaterialFormat>(step?.format ?? 'pdf');
  const [length, setLength] = useState(step?.length ?? '');
  const [points, setPoints] = useState(step?.points ?? 200);
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    title: !title.trim() ? 'Dê um título para a etapa.' : undefined,
    length: !length.trim() ? (format === 'pdf' ? 'Informe o número de páginas.' : 'Informe a duração.') : undefined,
  };

  return (
    <BottomSheet onClose={onClose}>
      <SheetHeader
        eyebrow="ETAPA"
        eyebrowColor={colors.accent.manaCyan}
        title={step ? 'Editar etapa' : 'Nova etapa'}
        onClose={onClose}
      />

      <TextField
        label="TÍTULO"
        value={title}
        onChangeText={setTitle}
        placeholder="Ex.: Religiões Africanas"
        error={submitted ? errors.title : undefined}
      />

      <View style={styles.section}>
        <SectionLabel label="FORMATO" />
        <SegmentedControl
          variant="base"
          height={40}
          fontSize={13}
          value={format}
          onChange={setFormat}
          options={[
            {
              value: 'pdf',
              label: 'PDF',
              renderIcon: (active) => (
                <Glyph name="fileText" size={16} strokeWidth={2.6} color={active ? colors.text.onColor : colors.text.secondary} />
              ),
            },
            {
              value: 'slides',
              label: 'Slides',
              renderIcon: (active) => (
                <Glyph name="monitor" size={16} strokeWidth={2.6} color={active ? colors.text.onColor : colors.text.secondary} />
              ),
            },
          ]}
        />
      </View>

      <TextField
        label={format === 'pdf' ? 'TAMANHO' : 'DURAÇÃO'}
        value={length}
        onChangeText={setLength}
        placeholder={format === 'pdf' ? 'Ex.: 12 páginas' : 'Ex.: 8 min'}
        error={submitted ? errors.length : undefined}
      />

      <View style={styles.section}>
        <SectionLabel label="PONTOS DA ETAPA" hint="XP que o aluno ganha" />
        <View style={styles.center}>
          <Stepper value={points} onChange={setPoints} step={50} min={50} max={1000} suffix=" XP" accessibilityLabel="pontos" />
        </View>
      </View>

      <ChunkyButton
        icon="check"
        label="SALVAR ETAPA"
        color={colors.accent.manaCyan}
        depthColor={colors.depth.cyan}
        textColor={colors.bg.base}
        onPress={() => {
          setSubmitted(true);
          if (errors.title || errors.length) return;
          onSave({
            id: step?.id ?? createId('etapa'),
            title: title.trim(),
            format,
            length: length.trim(),
            points,
            isNew: step?.isNew ?? true,
          });
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
  center: {
    alignItems: 'center',
  },
});
