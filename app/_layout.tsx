import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import { Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black, useFonts } from '@expo-google-fonts/nunito';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { colors } from '@/constants/theme';
import { GameProvider } from '@/store/GameProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.brand.primary,
    background: colors.bg.base,
    card: colors.bg.surface,
    text: colors.text.primary,
    border: colors.bg.border,
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
    LilitaOne_400Regular,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <GameProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg.base } }}>
          <Stack.Screen name="(tabs)" />
          {/* Rodada de flashcards e duelo ocupam a tela toda, sem a BottomNav. */}
          <Stack.Screen name="rodada" options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
          <Stack.Screen name="duelo/[id]" options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
        </Stack>
      </GameProvider>
    </ThemeProvider>
  );
}
