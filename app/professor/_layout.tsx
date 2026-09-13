import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';

export const unstable_settings = {
  initialRouteName: '(abas)',
};

/** Área do professor: abas (Painel, Alunos, Entregas, Gestão) + criação de atividade em tela cheia. */
export default function TeacherLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg.base } }}>
      <Stack.Screen name="(abas)" />
      <Stack.Screen name="nova-atividade" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
