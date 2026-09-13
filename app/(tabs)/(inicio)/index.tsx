import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useState } from 'react';

import { ActivityCard } from '@/components/home/ActivityCard';
import { CurrencyBar } from '@/components/home/CurrencyBar';
import { NoticesSheet } from '@/components/home/NoticesSheet';
import { ProfileCard } from '@/components/home/ProfileCard';
import { Icon } from '@/components/ui/Icon';
import { homeGlows, ScreenBackground } from '@/components/ui/ScreenBackground';
import { colors, fonts } from '@/constants/theme';
import { useGame } from '@/store/GameProvider';
import { useSchool } from '@/store/SchoolProvider';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { student, avatar, level, totalXp, classPosition, activities } = useGame();
  const { notices } = useSchool();
  const [noticesOpen, setNoticesOpen] = useState(false);

  const unreadNotices = notices.filter((notice) => notice.studentId === student.id && !notice.read).length;

  const pendingActivities = activities.filter((activity) =>
    activity.steps.some((step) => !student.completedStepIds.includes(step.id)),
  );

  return (
    <ScreenBackground glows={homeGlows}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 6 }]}
        showsVerticalScrollIndicator={false}>
        <CurrencyBar
          streakDays={student.streakDays}
          coins={student.coins}
          unreadNotices={unreadNotices}
          onPressNotifications={() => setNoticesOpen(true)}
        />

        <ProfileCard
          student={student}
          avatar={avatar}
          level={level.level}
          totalXp={totalXp}
          classPosition={classPosition}
        />

        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitle}>
            <Icon name="sword" size={20} />
            <Text style={styles.sectionTitleText}>ATIVIDADES DISPONÍVEIS</Text>
          </View>
          <Pressable onPress={() => router.navigate('/trilha')} accessibilityRole="link" hitSlop={8}>
            <Text style={styles.seeAll}>Ver todas</Text>
          </Pressable>
        </View>

        <View style={styles.list}>
          {pendingActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onPress={() => router.push({ pathname: '/atividade/[id]', params: { id: activity.id } })}
            />
          ))}
          {pendingActivities.length === 0 && (
            <Text style={styles.empty}>Tudo em dia! Novas missões aparecem aqui. ✨</Text>
          )}
        </View>
      </ScrollView>

      {noticesOpen && <NoticesSheet studentId={student.id} onClose={() => setNoticesOpen(false)} />}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingHorizontal: 20,
    // Espaço extra para o botão central da BottomNav, que invade a tela em 28pt.
    paddingBottom: 44,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  sectionTitleText: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.text.primary,
  },
  seeAll: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
    color: colors.brand.primaryLight,
  },
  list: {
    gap: 12,
  },
  empty: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingVertical: 24,
  },
});
