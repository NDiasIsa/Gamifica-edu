import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';

// Ao abrir o detalhe por link direto, mantém a Home por baixo para o "voltar".
export const unstable_settings = {
  initialRouteName: 'index',
};

// Stack dentro da aba "Início" para que o detalhe da atividade mantenha a BottomNav visível.
export default function HomeStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg.base } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="atividade/[id]" />
    </Stack>
  );
}
