import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActivityCard } from '@/components/home/ActivityCard';
import { homeGlows, ScreenBackground } from '@/components/ui/ScreenBackground';
import { colors, fonts } from '@/constants/theme';
import { activities } from '@/data/mock';

export default function TrilhaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScreenBackground glows={homeGlows}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>TODAS AS MISSÕES</Text>
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onPress={() => router.push({ pathname: '/atividade/[id]', params: { id: activity.id } })}
          />
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 44,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.text.primary,
    marginBottom: 4,
  },
});
