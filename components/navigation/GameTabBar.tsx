import { LinearGradient } from 'expo-linear-gradient';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glyph, type GlyphName } from '@/components/ui/Glyph';
import { colors, fonts, solidShadow } from '@/constants/theme';

export type TabItem = {
  route: string;
  label: string;
  icon: GlyphName;
  /** Contador magenta sobre o ícone (ex.: entregas para corrigir). */
  badge?: number;
};

export type CenterButton = {
  label: string;
  icon: GlyphName;
} & (
  | { /** O botão central abre uma aba (Início do aluno). */ route: string; onPress?: never }
  | { /** O botão central dispara uma ação (Criar do professor). */ onPress: () => void; route?: never }
);

type GameTabBarProps = BottomTabBarProps & {
  /** Duas abas à esquerda e duas à direita do botão central. */
  items: [TabItem, TabItem, TabItem, TabItem];
  center: CenterButton;
};

export function GameTabBar({ state, navigation, items, center }: GameTabBarProps) {
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

  const renderItem = ({ route, label, icon, badge }: TabItem) => {
    const focused = focusedRoute === route;
    const color = focused ? colors.brand.primaryLight : colors.text.secondary;
    return (
      <Pressable
        key={route}
        style={styles.item}
        onPress={() => go(route)}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={badge ? `${label}, ${badge} pendentes` : label}>
        {focused && <View style={styles.indicator} />}
        <Glyph name={icon} size={26} color={color} />
        <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
          {label}
        </Text>
        {!!badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        )}
      </Pressable>
    );
  };

  // O botão de ação (Criar) fica sempre destacado; o de aba (Início) só quando está focado.
  const centerActive = center.route ? focusedRoute === center.route : true;
  const pressCenter = () => (center.route ? go(center.route) : center.onPress?.());

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      {items.slice(0, 2).map(renderItem)}
      <View style={styles.spacer}>
        <Text style={[styles.label, centerActive && styles.labelActive]}>{center.label}</Text>
      </View>
      {items.slice(2).map(renderItem)}

      <View style={styles.centerLayer}>
        <Pressable
          onPress={pressCenter}
          accessibilityRole={center.route ? 'tab' : 'button'}
          accessibilityState={center.route ? { selected: centerActive } : undefined}
          accessibilityLabel={center.label}
          style={[styles.centerWrap, solidShadow(6, centerActive ? colors.depth.deep : colors.depth.card)]}>
          {centerActive ? (
            <LinearGradient colors={['#A78BFA', '#7C3AED']} style={styles.centerButton}>
              <Glyph name={center.icon} size={center.route ? 30 : 32} strokeWidth={center.route ? 2.6 : 3.2} color={colors.text.onColor} />
            </LinearGradient>
          ) : (
            <View style={[styles.centerButton, styles.centerIdle]}>
              <Glyph name={center.icon} size={30} color={colors.text.secondary} />
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
  badge: {
    position: 'absolute',
    left: 34,
    top: -6,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: colors.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand.magenta,
  },
  badgeText: {
    fontFamily: fonts.black,
    fontSize: 10,
    lineHeight: 12,
    color: colors.text.onColor,
  },
  spacer: {
    width: 64,
    height: 58,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  // Camada com a largura total da barra (incluindo o padding) para centralizar o botão.
  // Evita `left: '50%'`, que no iOS/Android é calculado sem o padding horizontal.
  centerLayer: {
    position: 'absolute',
    top: -28,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  centerWrap: {
    borderRadius: 20,
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: colors.bg.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIdle: {
    backgroundColor: colors.bg.surface2,
  },
});
