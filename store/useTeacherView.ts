import { CURRENT_STUDENT_ID } from '@/data/mock';
import { playerLevel } from '@/lib/progression';
import { isActiveStudent, totalXp } from '@/lib/school';
import { useGame } from '@/store/GameProvider';
import { useSchool } from '@/store/SchoolProvider';
import type { AvatarPalette, RosterStudent } from '@/types/game';

/** Dados derivados que as telas do professor usam para a turma selecionada. */
export function useTeacherView() {
  const school = useSchool();
  const { avatar: studentAvatar } = useGame();

  const currentClass = school.getClass(school.currentClassId);
  const classStudents = school.roster
    .filter((student) => student.classId === school.currentClassId)
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  const byXp = [...classStudents].sort((a, b) => totalXp(b.subjectXp) - totalXp(a.subjectXp));

  const pendingSubmissions = school.submissions.filter(
    (item) => item.status === 'pending' && classStudents.some((student) => student.id === item.studentId),
  );

  return {
    ...school,
    currentClass,
    classStudents,
    activeToday: classStudents.filter((student) => student.lastActiveDaysAgo === 0).length,
    activeCount: classStudents.filter(isActiveStudent).length,
    pendingSubmissions,
    classActivities: school.activities.filter((item) => item.classId === school.currentClassId),
    /** A aluna logada aparece com os itens que equipou na loja. */
    avatarOf: (student: RosterStudent): AvatarPalette =>
      student.id === CURRENT_STUDENT_ID ? studentAvatar : student.avatar,
    levelOf: (student: RosterStudent) => playerLevel(totalXp(student.subjectXp)).level,
    /** Posição do aluno no ranking da própria turma. */
    classPositionOf: (student: RosterStudent) => {
      const classmates = school.roster
        .filter((item) => item.classId === student.classId)
        .sort((a, b) => totalXp(b.subjectXp) - totalXp(a.subjectXp));
      return classmates.findIndex((item) => item.id === student.id) + 1;
    },
    byXp,
  };
}
