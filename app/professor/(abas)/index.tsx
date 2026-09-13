import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClassPickerSheet } from '@/components/teacher/ClassPickerSheet';
import { StudentRow } from '@/components/teacher/StudentRow';
import { Glyph, type GlyphName } from '@/components/ui/Glyph';
import { IconButton } from '@/components/ui/IconButton';
import { PixelAvatar } from '@/components/ui/PixelAvatar';
import { ScreenBackground, teacherGlows } from '@/components/ui/ScreenBackground';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { colors, fonts, solidShadow, withAlpha } from '@/constants/theme';
import { subjectOrder, subjects } from '@/data/mock';
import { formatNumber } from '@/lib/progression';
import { useTeacherView } from '@/store/useTeacherView';

/** Abaixo disso a matéria ganha o alerta amarelo. */
const ACCURACY_WARNING = 0.7;

function StatTile({
  icon,
  color,
  depthColor,
  value,
  label,
}: {
  icon: GlyphName;
  color: string;
  depthColor: string;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.stat}>
      <View style={[styles.statIcon, { backgroundColor: color }, solidShadow(3, depthColor)]}>
        <Glyph name={icon} size={20} strokeWidth={2.8} color={colors.bg.base} />
      </View>
      <View style={styles.statText}>
        <Text style={styles.statValue} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.statLabel} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );
}

export default function TeacherDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { teacher, currentClass, classStudents, activeToday, pendingSubmissions, avatarOf } = useTeacherView();
  const [pickerOpen, setPickerOpen] = useState(false);

  const attention = classStudents
    .map((student) => {
      if (student.lastActiveDaysAgo === null) return { student, reason: 'Ainda não acessou o app', pink: false };
      if (student.lastActiveDaysAgo >= 5)
        return { student, reason: `${student.lastActiveDaysAgo} dias sem acessar o app`, pink: false };
      if (student.late >= 2) return { student, reason: `${student.late} atividades atrasadas`, pink: true };
      return null;
    })
    .filter((item) => item !== null);

  return (
    <ScreenBackground glows={teacherGlows}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 4 }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <PixelAvatar palette={teacher.avatar} size={52} />
          <View style={styles.headerText}>
            <View style={styles.modeChip}>
              <Text style={styles.modeChipText}>MODO PROFESSOR</Text>
            </View>
            <Text style={styles.teacherName} numberOfLines={1}>
              {teacher.name}
            </Text>
          </View>
          <IconButton
            icon="bell"
            dot={pendingSubmissions.length > 0}
            accessibilityLabel={`Notificações: ${pendingSubmissions.length} entregas para corrigir`}
            onPress={() => router.navigate('/professor/entregas')}
          />
        </View>

        <Pressable
          onPress={() => setPickerOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={`Turma ${currentClass?.name}. Trocar de turma`}
          style={({ pressed }) => [styles.classSelector, pressed && styles.pressed]}>
          <Glyph name="cap" size={20} color={colors.brand.primaryLight} />
          <Text style={styles.className}>{currentClass?.name}</Text>
          <Text style={styles.classCount}>
            · {classStudents.length} {classStudents.length === 1 ? 'aluno' : 'alunos'}
          </Text>
          <View style={styles.flex} />
          <Glyph name="chevronDown" size={20} strokeWidth={3} color={colors.text.secondary} />
        </Pressable>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatTile
              icon="users"
              color={colors.accent.success}
              depthColor={colors.depth.success}
              value={`${activeToday}/${classStudents.length}`}
              label="Ativos hoje"
            />
            <StatTile
              icon="inbox"
              color={colors.brand.magenta}
              depthColor={colors.depth.magenta}
              value={String(pendingSubmissions.length)}
              label="Para corrigir"
            />
          </View>
          <View style={styles.statsRow}>
            <StatTile
              icon="check"
              color={colors.accent.manaCyan}
              depthColor={colors.depth.cyan}
              value={`${Math.round((currentClass?.averageAccuracy ?? 0) * 100)}%`}
              label="Média de acertos"
            />
            <StatTile
              icon="bolt"
              color={colors.accent.xpGold}
              depthColor={colors.depth.gold}
              value={formatNumber(currentClass?.weeklyXp ?? 0)}
              label="XP na semana"
            />
          </View>
        </View>

        <View style={styles.card}>
          <SectionLabel label="ACERTOS POR MATÉRIA" hint="últimos 7 dias" />
          <View style={styles.bars}>
            {subjectOrder.map((id) => {
              const value = currentClass?.accuracyBySubject[id] ?? 0;
              return (
                <View key={id} style={styles.barRow}>
                  <Text style={styles.barName}>{subjects[id].name}</Text>
                  <View style={styles.track}>
                    <View style={[styles.fill, { width: `${value * 100}%`, backgroundColor: subjects[id].color }]} />
                  </View>
                  <View style={styles.barValue}>
                    {value > 0 && value < ACCURACY_WARNING && (
                      <Glyph name="alert" size={12} strokeWidth={2.8} color={colors.accent.xpGold} />
                    )}
                    <Text style={styles.barPercent}>{Math.round(value * 100)}%</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.attention}>
          <View style={styles.attentionHeader}>
            <Glyph name="alert" size={14} strokeWidth={2.8} color={colors.accent.xpGold} />
            <SectionLabel label="PRECISA DE ATENÇÃO" />
          </View>
          {attention.length === 0 && (
            <View style={[styles.card, styles.allGood]}>
              <Glyph name="check" size={18} strokeWidth={3} color={colors.accent.success} />
              <Text style={styles.allGoodText}>Toda a turma está em dia por aqui.</Text>
            </View>
          )}
          {attention.map(({ student, reason, pink }) => (
            <StudentRow
              key={student.id}
              name={student.name}
              avatar={avatarOf(student)}
              subtitle={reason}
              subtitleColor={pink ? colors.accent.hpPink : colors.text.primary}
              onPress={() => router.push({ pathname: '/professor/aluno/[id]', params: { id: student.id } })}
            />
          ))}
        </View>
      </ScrollView>

      {pickerOpen && (
        <ClassPickerSheet
          onClose={() => setPickerOpen(false)}
          onManage={() => {
            setPickerOpen(false);
            router.navigate('/professor/gestao');
          }}
        />
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 56,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-start',
    gap: 3,
  },
  modeChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: withAlpha(colors.accent.manaCyan, 0.15),
  },
  modeChipText: {
    fontFamily: fonts.black,
    fontSize: 9,
    letterSpacing: 0.9,
    color: colors.accent.manaCyan,
  },
  teacherName: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.text.primary,
  },
  classSelector: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  pressed: {
    backgroundColor: colors.bg.surface2,
  },
  className: {
    fontFamily: fonts.black,
    fontSize: 15,
    color: colors.text.primary,
  },
  classCount: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.text.secondary,
  },
  flex: {
    flex: 1,
  },
  statsGrid: {
    gap: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  stat: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: {
    flex: 1,
    minWidth: 0,
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 25,
    color: colors.text.primary,
  },
  statLabel: {
    fontFamily: fonts.extraBold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  card: {
    gap: 12,
    padding: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
  },
  bars: {
    gap: 10,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  barName: {
    width: 82,
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: colors.text.primary,
  },
  track: {
    flex: 1,
    height: 10,
    borderRadius: 99,
    overflow: 'hidden',
    backgroundColor: colors.bg.base,
  },
  fill: {
    height: 10,
    borderRadius: 99,
  },
  barValue: {
    width: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
  },
  barPercent: {
    fontFamily: fonts.black,
    fontSize: 12,
    color: colors.text.primary,
  },
  attention: {
    gap: 8,
  },
  attentionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  allGood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  allGoodText: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
    color: colors.text.primary,
  },
});
