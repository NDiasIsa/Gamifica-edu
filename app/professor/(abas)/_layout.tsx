import { useRouter } from 'expo-router';
import { Tabs } from 'expo-router/tabs';

import { GameTabBar } from '@/components/navigation/GameTabBar';
import { colors } from '@/constants/theme';
import { useSchool } from '@/store/SchoolProvider';

export default function TeacherTabsLayout() {
  const router = useRouter();
  const { submissions, roster, currentClassId } = useSchool();

  const pendingInClass = submissions.filter(
    (item) =>
      item.status === 'pending' && roster.find((student) => student.id === item.studentId)?.classId === currentClassId,
  ).length;

  return (
    <Tabs
      tabBar={(props) => (
        <GameTabBar
          {...props}
          items={[
            { route: 'index', label: 'Painel', icon: 'grid' },
            { route: '(alunos)', label: 'Alunos', icon: 'users' },
            { route: 'entregas', label: 'Entregas', icon: 'inbox', badge: pendingInClass },
            { route: 'gestao', label: 'Gestão', icon: 'sliders' },
          ]}
          center={{ label: 'Criar', icon: 'plus', onPress: () => router.push('/professor/nova-atividade') }}
        />
      )}
      backBehavior="initialRoute"
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg.base } }}>
      <Tabs.Screen name="index" options={{ title: 'Painel' }} />
      <Tabs.Screen name="(alunos)" options={{ title: 'Alunos' }} />
      <Tabs.Screen name="entregas" options={{ title: 'Entregas' }} />
      <Tabs.Screen name="gestao" options={{ title: 'Gestão' }} />
    </Tabs>
  );
}
