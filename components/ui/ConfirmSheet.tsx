import { StyleSheet, Text, View } from 'react-native';

import { BottomSheet, SheetHeader } from '@/components/ui/BottomSheet';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { colors, fonts } from '@/constants/theme';

type ConfirmSheetProps = {
  eyebrow: string;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
};

/** Confirmação para ações que não dá para desfazer (excluir, desistir…). */
export function ConfirmSheet({ eyebrow, title, message, confirmLabel, onConfirm, onClose }: ConfirmSheetProps) {
  return (
    <BottomSheet onClose={onClose}>
      <SheetHeader eyebrow={eyebrow} eyebrowColor={colors.accent.hpPink} title={title} onClose={onClose} />
      <Text style={styles.message}>{message}</Text>
      <View style={styles.actions}>
        <ChunkyButton variant="outline" label="CANCELAR" height={50} fontSize={16} style={styles.button} onPress={onClose} />
        <ChunkyButton
          label={confirmLabel}
          height={50}
          fontSize={16}
          color={colors.accent.hpPink}
          depthColor={colors.depth.pink}
          textColor={colors.bg.base}
          style={styles.button}
          onPress={() => {
            onConfirm();
            onClose();
          }}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  message: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
  },
});
