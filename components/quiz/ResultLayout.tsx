import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientButton } from '@/components/ui/GradientButton';
import { homeGlows, ScreenBackground } from '@/components/ui/ScreenBackground';
import { colors, fonts } from '@/constants/theme';

type ResultLayoutProps = {
  eyebrow: string;
  title: string;
  titleColor?: string;
  message?: string;
  actionLabel: string;
  onAction: () => void;
  children?: ReactNode;
};

/** Tela de fim de rodada/duelo: título grande, blocos de resultado e um botão para sair. */
export function ResultLayout({
  eyebrow,
  title,
  titleColor = colors.text.primary,
  message,
  actionLabel,
  onAction,
  children,
}: ResultLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScreenBackground glows={homeGlows}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={ZoomIn.duration(300)} style={styles.heading}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}
        </Animated.View>
        <View style={styles.body}>{children}</View>
        <GradientButton size="md" label={actionLabel} onPress={onAction} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 20,
  },
  heading: {
    alignItems: 'center',
    gap: 6,
  },
  eyebrow: {
    fontFamily: fonts.black,
    fontSize: 11,
    letterSpacing: 1.1,
    color: colors.brand.primaryLight,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 32,
    textAlign: 'center',
  },
  message: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  body: {
    gap: 12,
  },
});
