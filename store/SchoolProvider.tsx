import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { initialCosmetics } from '@/data/cosmetics';
import { flashcards as initialFlashcards, topics as initialTopics } from '@/data/flashcards';
import { initialActivities } from '@/data/mock';
import {
  initialClasses,
  initialLateDeliveries,
  initialNotices,
  initialRoster,
  initialSubmissions,
  newStudentAvatars,
  teacher,
} from '@/data/school';
import { subjects } from '@/data/mock';
import { classShortName, createId, formatGrade, inviteCodeFor, xpForGrade } from '@/lib/school';
import type {
  Activity,
  Cosmetic,
  Flashcard,
  LateDelivery,
  RosterStudent,
  SchoolClass,
  StudentNotice,
  SubjectId,
  Submission,
  Teacher,
  Topic,
} from '@/types/game';

// Conteúdo gerido pelo professor e compartilhado com o app do aluno.
// Sem backend, tudo fica em memória: o que o professor muda aparece na hora para a aluna de exemplo.

export type NewStudentInput = { name: string; enrollment: string; classId: string; guardianEmail?: string };
export type NewClassInput = { name: string; color: string; depthColor: string };
export type GradeInput = { grade: number; comment: string; decision: 'approved' | 'revision' };

type SchoolContextValue = {
  teacher: Teacher;
  classes: SchoolClass[];
  managedClasses: SchoolClass[];
  getClass: (id: string) => SchoolClass | undefined;
  /** Turma que o professor está acompanhando no painel. */
  currentClassId: string;
  selectClass: (classId: string) => void;
  createClass: (input: NewClassInput) => SchoolClass;

  roster: RosterStudent[];
  getStudent: (id: string) => RosterStudent | undefined;
  registerStudent: (input: NewStudentInput) => RosterStudent;
  nextEnrollment: () => string;
  /** Soma XP numa matéria (sem deixar negativo). Retorna o quanto foi aplicado de fato. */
  addXp: (studentId: string, subjectId: SubjectId, amount: number) => number;
  giveBonusXp: (studentId: string, subjectId: SubjectId, amount: number, reason: string) => void;
  sendMessage: (studentId: string, text: string) => void;
  notices: StudentNotice[];
  markNoticesRead: (studentId: string) => void;

  activities: Activity[];
  getActivity: (id: string) => Activity | undefined;
  saveActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
  setActivityStatus: (id: string, status: Activity['status']) => void;

  topics: Topic[];
  flashcards: Flashcard[];
  addTopic: (subjectId: SubjectId, name: string) => Topic;
  deleteTopic: (topicId: string) => void;
  addFlashcard: (card: Omit<Flashcard, 'id'>) => void;
  deleteFlashcard: (cardId: string) => void;

  cosmetics: Cosmetic[];
  updateCosmetic: (id: string, patch: Partial<Pick<Cosmetic, 'price' | 'requiredLevel' | 'active' | 'name'>>) => void;
  createCosmetic: (item: Omit<Cosmetic, 'id' | 'sales'>) => void;
  recordSale: (id: string) => void;

  submissions: Submission[];
  gradeSubmission: (submissionId: string, input: GradeInput) => void;
  lateDeliveries: LateDelivery[];
  remindLateDelivery: (id: string) => void;
};

const SchoolContext = createContext<SchoolContextValue | null>(null);

export function SchoolProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState(initialClasses);
  const [currentClassId, setCurrentClassId] = useState('7B');
  const [roster, setRoster] = useState(initialRoster);
  const [notices, setNotices] = useState(initialNotices);
  const [activities, setActivities] = useState(initialActivities);
  const [topics, setTopics] = useState(initialTopics);
  const [flashcards, setFlashcards] = useState(initialFlashcards);
  const [cosmetics, setCosmetics] = useState(initialCosmetics);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [lateDeliveries, setLateDeliveries] = useState(initialLateDeliveries);

  const pushNotice = useCallback((notice: Omit<StudentNotice, 'id' | 'read'>) => {
    setNotices((prev) => [{ ...notice, id: createId('aviso'), read: false }, ...prev]);
  }, []);

  const createClass = useCallback((input: NewClassInput) => {
    const shortName = classShortName(input.name);
    const created: SchoolClass = {
      id: createId('turma'),
      name: input.name.trim(),
      shortName,
      color: input.color,
      depthColor: input.depthColor,
      inviteCode: inviteCodeFor(shortName),
      managed: true,
      weeklyEngagement: 0,
      averageAccuracy: 0,
      weeklyXp: 0,
      accuracyBySubject: { matematica: 0, portugues: 0, historia: 0, ciencias: 0 },
    };
    setClasses((prev) => [...prev, created]);
    return created;
  }, []);

  const nextEnrollment = useCallback(() => {
    const highest = roster
      .map((student) => student.enrollment)
      .filter((code) => code.startsWith('2026-'))
      .map((code) => Number(code.slice(5)))
      .reduce((max, value) => Math.max(max, value), 0);
    return `2026-${String(highest + 1).padStart(4, '0')}`;
  }, [roster]);

  const registerStudent = useCallback(
    (input: NewStudentInput) => {
      const created: RosterStudent = {
        id: createId('aluno'),
        name: input.name.trim(),
        classId: input.classId,
        enrollment: input.enrollment.trim(),
        guardianEmail: input.guardianEmail?.trim() || undefined,
        avatar: newStudentAvatars[roster.length % newStudentAvatars.length],
        subjectXp: { matematica: 0, portugues: 0, historia: 0, ciencias: 0 },
        lastActiveDaysAgo: null,
        streakDays: 0,
        delivered: 0,
        assigned: 0,
        late: 0,
        flashcardAccuracy: 0,
      };
      setRoster((prev) => [...prev, created]);
      return created;
    },
    [roster.length],
  );

  const addXp = useCallback(
    (studentId: string, subjectId: SubjectId, amount: number) => {
      const current = roster.find((student) => student.id === studentId)?.subjectXp[subjectId] ?? 0;
      const applied = Math.max(-current, amount);
      setRoster((prev) =>
        prev.map((student) =>
          student.id === studentId
            ? {
                ...student,
                subjectXp: {
                  ...student.subjectXp,
                  [subjectId]: Math.max(0, student.subjectXp[subjectId] + amount),
                },
              }
            : student,
        ),
      );
      return applied;
    },
    [roster],
  );

  const giveBonusXp = useCallback(
    (studentId: string, subjectId: SubjectId, amount: number, reason: string) => {
      addXp(studentId, subjectId, amount);
      pushNotice({
        studentId,
        kind: 'bonus',
        title: `+${amount} XP bônus em ${subjects[subjectId].name}`,
        body: reason.trim() || `Presente de ${teacher.name}. Continue assim!`,
      });
    },
    [addXp, pushNotice],
  );

  const sendMessage = useCallback(
    (studentId: string, text: string) => {
      pushNotice({ studentId, kind: 'message', title: teacher.name, body: text.trim() });
    },
    [pushNotice],
  );

  const markNoticesRead = useCallback((studentId: string) => {
    setNotices((prev) => prev.map((notice) => (notice.studentId === studentId ? { ...notice, read: true } : notice)));
  }, []);

  const saveActivity = useCallback((activity: Activity) => {
    setActivities((prev) =>
      prev.some((item) => item.id === activity.id)
        ? prev.map((item) => (item.id === activity.id ? activity : item))
        : [activity, ...prev],
    );
  }, []);

  const deleteActivity = useCallback((id: string) => {
    setActivities((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const setActivityStatus = useCallback((id: string, status: Activity['status']) => {
    setActivities((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  }, []);

  const addTopic = useCallback((subjectId: SubjectId, name: string) => {
    const created: Topic = { id: createId('topico'), subjectId, name: name.trim() };
    setTopics((prev) => [...prev, created]);
    return created;
  }, []);

  const deleteTopic = useCallback((topicId: string) => {
    setTopics((prev) => prev.filter((topic) => topic.id !== topicId));
    setFlashcards((prev) => prev.filter((card) => card.topicId !== topicId));
  }, []);

  const addFlashcard = useCallback((card: Omit<Flashcard, 'id'>) => {
    setFlashcards((prev) => [...prev, { ...card, id: createId('card') }]);
  }, []);

  const deleteFlashcard = useCallback((cardId: string) => {
    setFlashcards((prev) => prev.filter((card) => card.id !== cardId));
  }, []);

  const updateCosmetic: SchoolContextValue['updateCosmetic'] = useCallback((id, patch) => {
    setCosmetics((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const createCosmetic = useCallback((item: Omit<Cosmetic, 'id' | 'sales'>) => {
    setCosmetics((prev) => [...prev, { ...item, id: createId('item'), sales: 0 }]);
  }, []);

  const recordSale = useCallback((id: string) => {
    setCosmetics((prev) => prev.map((item) => (item.id === id ? { ...item, sales: item.sales + 1 } : item)));
  }, []);

  const gradeSubmission = useCallback(
    (submissionId: string, { grade, comment, decision }: GradeInput) => {
      const submission = submissions.find((item) => item.id === submissionId);
      const activity = activities.find((item) => item.id === submission?.activityId);
      const step = activity?.steps.find((item) => item.id === submission?.stepId);
      if (!submission || !activity || !step || submission.status !== 'pending') return;

      const xp = decision === 'approved' ? xpForGrade(grade, step.points) : 0;
      setSubmissions((prev) =>
        prev.map((item) =>
          item.id === submissionId
            ? { ...item, status: decision, grade, comment: comment.trim() || undefined, xpAwarded: xp, isNew: false }
            : item,
        ),
      );

      if (decision === 'approved') {
        addXp(submission.studentId, activity.subjectId, xp);
        setRoster((prev) =>
          prev.map((student) =>
            student.id === submission.studentId
              ? { ...student, delivered: Math.min(student.assigned, student.delivered + 1) }
              : student,
          ),
        );
        pushNotice({
          studentId: submission.studentId,
          kind: 'grade',
          title: `${step.title}: nota ${formatGrade(grade)}`,
          body: `Entrega aprovada! +${xp} XP em ${subjects[activity.subjectId].name}.${comment.trim() ? ` "${comment.trim()}"` : ''}`,
        });
      } else {
        pushNotice({
          studentId: submission.studentId,
          kind: 'grade',
          title: `${step.title}: revisão pedida`,
          body: comment.trim() || 'O professor pediu para você revisar e enviar de novo.',
        });
      }
    },
    [submissions, activities, addXp, pushNotice],
  );

  const remindLateDelivery = useCallback(
    (id: string) => {
      const late = lateDeliveries.find((item) => item.id === id);
      const activity = activities.find((item) => item.id === late?.activityId);
      if (!late || late.reminded) return;
      setLateDeliveries((prev) => prev.map((item) => (item.id === id ? { ...item, reminded: true } : item)));
      pushNotice({
        studentId: late.studentId,
        kind: 'message',
        title: teacher.name,
        body: `Lembrete: a atividade "${activity?.title ?? 'pendente'}" está atrasada (${late.dueLabel}).`,
      });
    },
    [lateDeliveries, activities, pushNotice],
  );

  const value = useMemo<SchoolContextValue>(
    () => ({
      teacher,
      classes,
      managedClasses: classes.filter((item) => item.managed),
      getClass: (id) => classes.find((item) => item.id === id),
      currentClassId,
      selectClass: setCurrentClassId,
      createClass,
      roster,
      getStudent: (id) => roster.find((student) => student.id === id),
      registerStudent,
      nextEnrollment,
      addXp,
      giveBonusXp,
      sendMessage,
      notices,
      markNoticesRead,
      activities,
      getActivity: (id) => activities.find((item) => item.id === id),
      saveActivity,
      deleteActivity,
      setActivityStatus,
      topics,
      flashcards,
      addTopic,
      deleteTopic,
      addFlashcard,
      deleteFlashcard,
      cosmetics,
      updateCosmetic,
      createCosmetic,
      recordSale,
      submissions,
      gradeSubmission,
      lateDeliveries,
      remindLateDelivery,
    }),
    [
      classes,
      currentClassId,
      createClass,
      roster,
      registerStudent,
      nextEnrollment,
      addXp,
      giveBonusXp,
      sendMessage,
      notices,
      markNoticesRead,
      activities,
      saveActivity,
      deleteActivity,
      setActivityStatus,
      topics,
      flashcards,
      addTopic,
      deleteTopic,
      addFlashcard,
      deleteFlashcard,
      cosmetics,
      updateCosmetic,
      createCosmetic,
      recordSale,
      submissions,
      gradeSubmission,
      lateDeliveries,
      remindLateDelivery,
    ],
  );

  return <SchoolContext.Provider value={value}>{children}</SchoolContext.Provider>;
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) throw new Error('useSchool deve ser usado dentro de <SchoolProvider>');
  return context;
}
