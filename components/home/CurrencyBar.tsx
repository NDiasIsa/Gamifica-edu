import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { colors, fonts } from '@/constants/theme';
import { formatNumber } from '@/lib/progression';

type CurrencyBarProps = {
  streakDays: number;
  coins: number;
  onPressNotifications?: () => void;
};

function StatChip({ icon, value, color, label }: { icon: IconName; value: string; color: string; label: string }) {
  return (
    <View style={styles.chip} accessibilityLabel={label}>
      <Icon name={icon} size={18} />
      <Text style={[styles.chipValue, { color }]}>{value}</Text>
    </View>
  );
}

export function CurrencyBar({ streakDays, coins, onPressNotifications }: CurrencyBarProps) {
  return (
    <View style={styles.bar}>
      <Pressable
        style={({ pressed }) => [styles.bell, pressed && styles.pressed]}
        onPress={onPressNotifications}
        accessibilityRole="button"
        accessibilityLabel="Notificações">
        <Icon name="bell" size={20} />
      </Pressable>
      <StatChip
        icon="flame"
        value={String(streakDays)}
        color={colors.accent.streak}
        label={`Sequência de ${streakDays} dias`}
      />
      <StatChip
        icon="coin"
        value={formatNumber(coins)}
        color={colors.accent.xpGold}
        label={`${coins} moedas`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  bell: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg.surface2,
  },
  pressed: {
    opacity: 0.7,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 10,
    paddingRight: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  chipValue: {
    fontFamily: fonts.black,
    fontSize: 14,
  },
});
