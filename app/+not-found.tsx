import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Esta tela não existe.</Text>

      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Voltar para o início</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.bg.base,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.text.primary,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: colors.brand.primaryLight,
  },
});
