import type { BottomTabBarProps } from 'expo-router/tabs';

import { GameTabBar } from '@/components/navigation/GameTabBar';

export const HOME_ROUTE = '(inicio)';

/** Barra do app do aluno: Trilha, Ranking, [Início], Flashcards, Perfil. */
export function BottomNav(props: BottomTabBarProps) {
  return (
    <GameTabBar
      {...props}
      items={[
        { route: 'trilha', label: 'Trilha', icon: 'map' },
        { route: 'ranking', label: 'Ranking', icon: 'trophy' },
        { route: 'flashcards', label: 'Flashcards', icon: 'cards' },
        { route: 'perfil', label: 'Perfil', icon: 'user' },
      ]}
      center={{ route: HOME_ROUTE, label: 'Início', icon: 'home' }}
    />
  );
}
