import { LinearGradient } from 'expo-linear-gradient';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glyph, type GlyphName } from '@/components/ui/Glyph';
import { colors, fonts, solidShadow } from '@/constants/theme';

export const HOME_ROUTE = '(inicio)';

const sideItems: { route: string; label: string; icon: GlyphName }[] = [
  { route: 'trilha', label: 'Trilha', icon: 'map' },
  { route: 'ranking', label: 'Ranking', icon: 'trophy' },
  { route: 'flashcards', label: 'Flashcards', icon: 'cards' },
  { route: 'perfil', label: 'Perfil', icon: 'user' },
];

export function BottomNav({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const focusedRoute = state.routes[state.index]?.name;

  const go = (routeName: string) => {
    const route = state.routes.find((item) => item.name === routeName);
    if (!route) return;
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (focusedRoute !== routeName && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const renderItem = ({ route, label, icon }: (typeof sideItems)[number]) => {
    const focused = focusedRoute === route;
    const color = focused ? colors.brand.primaryLight : colors.text.secondary;
    return (
      <Pressable
        key={route}
        style={styles.item}
        onPress={() => go(route)}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={label}>
        {focused && <View style={styles.indicator} />}
        <Glyph name={icon} size={26} color={color} />
        <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
          {label}
        </Text>
      </Pressable>
    );
  };

  const homeFocused = focusedRoute === HOME_ROUTE;

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      {sideItems.slice(0, 2).map(renderItem)}
      <View style={styles.spacer}>
        <Text style={[styles.label, homeFocused && styles.labelActive]}>Início</Text>
      </View>
      {sideItems.slice(2).map(renderItem)}

      <View style={styles.homeLayer}>
        <Pressable
          onPress={() => go(HOME_ROUTE)}
          accessibilityRole="tab"
          accessibilityState={{ selected: homeFocused }}
          accessibilityLabel="Início"
          style={[styles.homeButtonWrap, solidShadow(6, homeFocused ? colors.depth.deep : colors.depth.card)]}>
          {homeFocused ? (
            <LinearGradient colors={['#A78BFA', '#7C3AED']} style={styles.homeButton}>
              <Glyph name="home" size={30} strokeWidth={2.6} color={colors.text.onColor} />
            </LinearGradient>
          ) : (
            <View style={[styles.homeButton, styles.homeButtonIdle]}>
              <Glyph name="home" size={30} color={colors.text.secondary} />
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: 18,
    borderTopWidth: 2,
    borderTopColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  item: {
    width: 58,
    gap: 4,
    alignItems: 'center',
  },
  // Traço no topo da barra, acima da aba ativa.
  indicator: {
    position: 'absolute',
    top: -12,
    width: 24,
    height: 4,
    borderRadius: 99,
    backgroundColor: colors.brand.primaryLight,
  },
  label: {
    fontFamily: fonts.extraBold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  labelActive: {
    fontFamily: fonts.black,
    color: colors.brand.primaryLight,
  },
  spacer: {
    width: 64,
    height: 58,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  // Camada com a largura total da barra (incluindo o padding) para centralizar o botão.
  // Evita `left: '50%'`, que no iOS/Android é calculado sem o padding horizontal.
  homeLayer: {
    position: 'absolute',
    top: -28,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  homeButtonWrap: {
    borderRadius: 20,
  },
  homeButton: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: colors.bg.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButtonIdle: {
    backgroundColor: colors.bg.surface2,
  },
});
