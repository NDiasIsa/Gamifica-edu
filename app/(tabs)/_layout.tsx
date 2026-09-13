import { Tabs } from 'expo-router/tabs';

import { BottomNav, HOME_ROUTE } from '@/components/navigation/BottomNav';
import { colors } from '@/constants/theme';

export const unstable_settings = {
  initialRouteName: HOME_ROUTE,
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomNav {...props} />}
      backBehavior="initialRoute"
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg.base },
      }}>
      {/* Início vem primeiro para ser a aba padrão ao abrir o app.
          A ordem visual dos itens é definida pela própria BottomNav. */}
      <Tabs.Screen name={HOME_ROUTE} options={{ title: 'Início' }} />
      <Tabs.Screen name="trilha" options={{ title: 'Trilha' }} />
      <Tabs.Screen name="ranking" options={{ title: 'Ranking' }} />
      <Tabs.Screen name="flashcards" options={{ title: 'Flashcards' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
