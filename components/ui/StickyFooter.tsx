import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

/** Área fixa acima da BottomNav com degradê, para o CTA principal da tela. */
export function StickyFooter({ children }: { children: ReactNode }) {
  return (
    <View style={styles.footer}>
      <LinearGradient
        colors={['rgba(18,12,34,0)', 'rgba(18,12,34,0.92)', colors.bg.base]}
        locations={[0, 0.45, 1]}
        style={styles.fade}
      />
      {children}
    </View>
  );
}

/** Espaço que o conteúdo rolável precisa reservar para não ficar escondido atrás do rodapé. */
export const STICKY_FOOTER_SPACE = 150;

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: STICKY_FOOTER_SPACE,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    // Deixa o botão acima do botão central da BottomNav, que invade a tela.
    paddingBottom: 54,
    pointerEvents: 'box-none',
  },
  fade: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
});
