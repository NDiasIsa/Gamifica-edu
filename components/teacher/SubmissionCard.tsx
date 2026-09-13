import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { Glyph } from '@/components/ui/Glyph';
import { IconButton } from '@/components/ui/IconButton';
import { PixelAvatar } from '@/components/ui/PixelAvatar';
import { Stepper } from '@/components/ui/Stepper';
import { TextField } from '@/components/ui/TextField';
import { colors, fonts, solidShadow } from '@/constants/theme';
import { formatGrade, xpForGrade } from '@/lib/school';
import type { AvatarPalette, StudyStep, Submission } from '@/types/game';

type SubmissionCardProps = {
  submission: Submission;
  studentName: string;
  avatar: AvatarPalette;
  step: StudyStep;
  expanded: boolean;
  onExpand: () => void;
  onPreview: () => void;
  onGrade: (grade: number, comment: string, decision: 'approved' | 'revision') => void;
};

export function SubmissionCard({
  submission,
  studentName,
  avatar,
  step,
  expanded,
  onExpand,
  onPreview,
  onGrade,
}: SubmissionCardProps) {
  const [grade, setGrade] = useState(8);
  const [comment, setComment] = useState('');

  if (!expanded) {
    return (
      <View style={styles.row}>
        <PixelAvatar palette={avatar} size={40} />
        <View style={styles.info}>
          <Text style={styles.nameSmall} numberOfLines={1}>
            {studentName}
          </Text>
          <Text style={styles.sent}>Enviado {submission.sentLabel}</Text>
        </View>
        <Pressable
          onPress={onExpand}
          accessibilityRole="button"
          accessibilityLabel={`Corrigir entrega de ${studentName}`}
          style={({ pressed }) => [styles.correctButton, pressed && styles.pressedDown]}>
          <Text style={styles.correctText}>Corrigir</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <PixelAvatar palette={avatar} size={40} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {studentName}
          </Text>
          <Text style={styles.sent}>Enviado {submission.sentLabel}</Text>
        </View>
        {submission.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NOVO</Text>
          </View>
        )}
      </View>

      <View style={styles.file}>
        <View style={styles.fileIcon}>
          <Glyph name="fileText" size={18} strokeWidth={2.8} color={colors.bg.base} />
        </View>
        <View style={styles.info}>
          <Text style={styles.fileName} numberOfLines={1}>
            {submission.fileName}
          </Text>
          <Text style={styles.fileInfo}>{submission.fileInfo}</Text>
        </View>
        <IconButton icon="eye" size={40} accessibilityLabel="Ver arquivo" onPress={onPreview} />
      </View>

      <View style={styles.gradeRow}>
        <View style={styles.gradeBlock}>
          <Text style={styles.label}>NOTA</Text>
          <Stepper
            value={grade}
            onChange={setGrade}
            step={0.5}
            min={0}
            max={10}
            format={formatGrade}
            suffix="/10"
            accessibilityLabel="nota"
          />
        </View>
        <View style={styles.xpBlock}>
          <Text style={styles.xpLabel}>XP LIBERADO</Text>
          <View style={styles.xpValueRow}>
            <Glyph name="bolt" size={16} color={colors.accent.xpGold} />
            <Text style={styles.xpValue}>+{xpForGrade(grade, step.points)}</Text>
          </View>
          <Text style={styles.xpHint}>de {step.points} XP da etapa</Text>
        </View>
      </View>

      <TextField value={comment} onChangeText={setComment} placeholder="Comentário para o aluno (opcional)" maxLength={200} />

      <View style={styles.actions}>
        <ChunkyButton
          variant="outline"
          label="PEDIR REVISÃO"
          height={48}
          fontSize={14}
          style={styles.action}
          onPress={() => onGrade(grade, comment, 'revision')}
        />
        <ChunkyButton
          icon="check"
          label="APROVAR"
          height={48}
          fontSize={16}
          color={colors.accent.success}
          depthColor={colors.depth.success}
          textColor={colors.bg.base}
          style={styles.action}
          onPress={() => onGrade(grade, comment, 'approved')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  card: {
    gap: 10,
    padding: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.brand.primary,
    backgroundColor: colors.bg.surface2,
    ...solidShadow(4, colors.depth.primary),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  name: {
    fontFamily: fonts.black,
    fontSize: 15,
    color: colors.text.primary,
  },
  nameSmall: {
    fontFamily: fonts.black,
    fontSize: 14,
    color: colors.text.primary,
  },
  sent: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  correctButton: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.brand.magenta,
    ...solidShadow(3, colors.depth.magenta),
  },
  pressedDown: {
    transform: [{ translateY: 2 }],
  },
  correctText: {
    fontFamily: fonts.black,
    fontSize: 13,
    color: colors.text.onColor,
  },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: colors.brand.magenta,
    ...solidShadow(2, colors.depth.magenta),
  },
  newBadgeText: {
    fontFamily: fonts.display,
    fontSize: 11,
    color: colors.text.onColor,
  },
  file: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 8,
    borderRadius: 14,
    backgroundColor: colors.bg.base,
  },
  fileIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.hpPink,
  },
  fileName: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: colors.text.primary,
  },
  fileInfo: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  gradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gradeBlock: {
    gap: 4,
  },
  label: {
    fontFamily: fonts.black,
    fontSize: 11,
    letterSpacing: 1.1,
    color: colors.brand.primaryLight,
  },
  xpBlock: {
    alignItems: 'flex-end',
    gap: 2,
  },
  xpLabel: {
    fontFamily: fonts.black,
    fontSize: 9,
    letterSpacing: 0.72,
    color: colors.text.secondary,
  },
  xpValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpValue: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.accent.xpGold,
  },
  xpHint: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  action: {
    flex: 1,
  },
});
