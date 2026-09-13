import { Stack } from 'expo-router';

import { colors } from '@/constants/theme';

export const unstable_settings = {
  initialRouteName: 'alunos',
};

// Stack dentro da aba "Alunos" para o desempenho do aluno manter a barra do professor visível.
export default function StudentsStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg.base } }}>
      <Stack.Screen name="alunos" />
      <Stack.Screen name="aluno/[id]" />
    </Stack>
  );
}
