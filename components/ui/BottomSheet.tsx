import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glyph } from '@/components/ui/Glyph';
import { colors, fonts } from '@/constants/theme';

type BottomSheetProps = {
  onClose: () => void;
  children: ReactNode;
};

/** Painel que sobe da parte de baixo da tela. Renderize-o só enquanto estiver aberto. */
export function BottomSheet({ onClose, children }: BottomSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View entering={FadeIn.duration(180)} style={StyleSheet.absoluteFill}>
          <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Fechar" />
        </Animated.View>

        <Animated.View
          entering={SlideInDown.duration(260)}
          style={[styles.sheet, { paddingBottom: 20 + insets.bottom }]}
          accessibilityViewIsModal>
          <View style={styles.handle} />
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={false}>
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

type SheetHeaderProps = {
  eyebrow: string;
  eyebrowColor: string;
  title: string;
  onClose: () => void;
};

export function SheetHeader({ eyebrow, eyebrowColor, title, onClose }: SheetHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <Text style={[styles.eyebrow, { color: eyebrowColor }]}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Pressable
        onPress={onClose}
        style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Fechar"
        hitSlop={6}>
        <Glyph name="close" size={20} color={colors.text.primary} strokeWidth={2.8} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(8,5,18,0.74)',
  },
  sheet: {
    maxHeight: '92%',
    paddingTop: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 2,
    borderTopColor: colors.brand.primary,
    backgroundColor: colors.bg.surface,
    boxShadow: '0px -24px 60px rgba(0,0,0,0.5)',
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 99,
    marginBottom: 14,
    backgroundColor: colors.bg.border,
  },
  scroll: {
    flexGrow: 0,
  },
  content: {
    gap: 14,
    // Espaço para a sombra 3D do último botão não ser cortada.
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 1,
  },
  eyebrow: {
    fontFamily: fonts.black,
    fontSize: 11,
    letterSpacing: 1.1,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.text.primary,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
