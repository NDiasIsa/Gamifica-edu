import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActivitiesPanel } from '@/components/teacher/gestao/ActivitiesPanel';
import { ClassesPanel } from '@/components/teacher/gestao/ClassesPanel';
import { FlashcardsPanel } from '@/components/teacher/gestao/FlashcardsPanel';
import { ShopPanel } from '@/components/teacher/gestao/ShopPanel';
import { IconButton } from '@/components/ui/IconButton';
import { ScreenBackground, teacherGlows } from '@/components/ui/ScreenBackground';
import { ScreenTitle } from '@/components/ui/ScreenTitle';
import { SegmentedControl } from '@/components/ui/SegmentedControl';

type Section = 'turmas' | 'atividades' | 'flashcards' | 'loja';

export default function ManagementScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [section, setSection] = useState<Section>('turmas');

  return (
    <ScreenBackground glows={teacherGlows}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 4 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <ScreenTitle
          title="GESTÃO"
          subtitle="Turmas, atividades, flashcards e loja"
          action={
            <IconButton icon="user" accessibilityLabel="Voltar para o app do aluno" onPress={() => router.replace('/')} />
          }
        />

        <SegmentedControl
          height={40}
          fontSize={12}
          value={section}
          onChange={setSection}
          options={[
            { value: 'turmas', label: 'Turmas' },
            { value: 'atividades', label: 'Atividades' },
            { value: 'flashcards', label: 'Flashcards' },
            { value: 'loja', label: 'Loja' },
          ]}
        />

        {section === 'turmas' && <ClassesPanel />}
        {section === 'atividades' && <ActivitiesPanel />}
        {section === 'flashcards' && <FlashcardsPanel />}
        {section === 'loja' && <ShopPanel />}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 56,
  },
});
