import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';

type ScreenTitleProps = {
  title: string;
  subtitle?: string;
  /** Botão à direita (ex.: "+" ou filtro). */
  action?: ReactNode;
};

/** Cabeçalho grande das abas ("ALUNOS", "ENTREGAS", "GESTÃO"…). */
export function ScreenTitle({ title, subtitle, action }: ScreenTitleProps) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  text: {
    flexShrink: 1,
    gap: 1,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 32,
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
});
