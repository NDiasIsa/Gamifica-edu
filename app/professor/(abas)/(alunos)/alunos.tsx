import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RegisterStudentSheet } from '@/components/teacher/RegisterStudentSheet';
import { StudentRow } from '@/components/teacher/StudentRow';
import { IconButton } from '@/components/ui/IconButton';
import { ScreenBackground, teacherGlows } from '@/components/ui/ScreenBackground';
import { ScreenTitle } from '@/components/ui/ScreenTitle';
import { TextField } from '@/components/ui/TextField';
import { colors, fonts, solidShadow } from '@/constants/theme';
import { formatNumber } from '@/lib/progression';
import { isActiveStudent, lastActiveInfo, totalXp } from '@/lib/school';
import { useTeacherView } from '@/store/useTeacherView';

type Filter = 'todos' | 'ativos' | 'inativos';

/** Ignora acentos e maiúsculas na busca ("joao" encontra "João"). */
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export default function StudentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentClass, classStudents, activeCount, avatarOf, levelOf } = useTeacherView();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('todos');
  const [registerOpen, setRegisterOpen] = useState(false);

  const counts: Record<Filter, number> = {
    todos: classStudents.length,
    ativos: activeCount,
    inativos: classStudents.length - activeCount,
  };

  const visible = classStudents.filter((student) => {
    if (filter === 'ativos' && !isActiveStudent(student)) return false;
    if (filter === 'inativos' && isActiveStudent(student)) return false;
    const term = normalize(query.trim());
    return !term || normalize(student.name).includes(term) || student.enrollment.includes(term);
  });

  return (
    <ScreenBackground glows={teacherGlows}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 4 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <ScreenTitle
          title="ALUNOS"
          subtitle={`${currentClass?.name} · ${classStudents.length} ${classStudents.length === 1 ? 'aluno' : 'alunos'}`}
          action={
            <IconButton
              icon="plus"
              variant="primary"
              accessibilityLabel="Cadastrar aluno"
              onPress={() => setRegisterOpen(true)}
            />
          }
        />

        <TextField icon="search" value={query} onChangeText={setQuery} placeholder="Buscar por nome ou matrícula" />

        <View style={styles.filters} accessibilityRole="tablist">
          {(
            [
              ['todos', 'Todos'],
              ['ativos', 'Ativos'],
              ['inativos', 'Inativos'],
            ] as const
          ).map(([value, label]) => {
            const active = filter === value;
            return (
              <Pressable
                key={value}
                onPress={() => setFilter(value)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                style={[styles.filter, active ? styles.filterActive : styles.filterIdle]}>
                <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>{label}</Text>
                <Text style={[styles.filterCount, active && styles.filterCountActive]}>{counts[value]}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.list}>
          {visible.map((student) => (
            <StudentRow
              key={student.id}
              name={student.name}
              avatar={avatarOf(student)}
              subtitle={`Nv ${levelOf(student)} · ${formatNumber(totalXp(student.subjectXp))} XP`}
              status={lastActiveInfo(student.lastActiveDaysAgo)}
              onPress={() => router.push({ pathname: '/professor/aluno/[id]', params: { id: student.id } })}
            />
          ))}
          {visible.length === 0 && (
            <Text style={styles.empty}>
              {classStudents.length === 0
                ? 'Nenhum aluno nesta turma ainda. Toque em + para cadastrar.'
                : 'Nenhum aluno encontrado com esse filtro.'}
            </Text>
          )}
        </View>
      </ScrollView>

      <LinearGradient
        colors={['rgba(18,12,34,0)', 'rgba(18,12,34,0.92)', colors.bg.base]}
        locations={[0, 0.45, 1]}
        style={styles.bottomFade}
      />

      {registerOpen && <RegisterStudentSheet onClose={() => setRegisterOpen(false)} />}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 56,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  filter: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  filterActive: {
    backgroundColor: colors.brand.primary,
    ...solidShadow(3, colors.depth.primary),
  },
  filterIdle: {
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  filterLabel: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
    color: colors.text.secondary,
  },
  filterLabelActive: {
    fontFamily: fonts.black,
    color: colors.text.onColor,
  },
  filterCount: {
    fontFamily: fonts.black,
    fontSize: 12,
    color: colors.text.secondary,
  },
  filterCountActive: {
    color: colors.brand.primaryLight,
  },
  list: {
    gap: 8,
  },
  empty: {
    paddingVertical: 24,
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.text.secondary,
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
    pointerEvents: 'none',
  },
});
