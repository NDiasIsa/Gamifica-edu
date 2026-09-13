import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomSheet, SheetHeader } from '@/components/ui/BottomSheet';
import { ChunkyButton } from '@/components/ui/ChunkyButton';
import { ConfirmSheet } from '@/components/ui/ConfirmSheet';
import { DashedButton } from '@/components/ui/DashedButton';
import { Glyph } from '@/components/ui/Glyph';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SubjectPicker } from '@/components/ui/SubjectPicker';
import { TextField } from '@/components/ui/TextField';
import { useToast } from '@/components/ui/Toast';
import { colors, fonts } from '@/constants/theme';
import { subjects } from '@/data/mock';
import { useSchool } from '@/store/SchoolProvider';
import type { SubjectId, Topic } from '@/types/game';

type Pending = { kind: 'topic' | 'card'; id: string; label: string };

export function FlashcardsPanel() {
  const { topics, flashcards, deleteFlashcard, deleteTopic } = useSchool();
  const { showToast } = useToast();
  const [subjectId, setSubjectId] = useState<SubjectId>('matematica');
  const [openTopicId, setOpenTopicId] = useState<string | null>(null);
  const [newTopicOpen, setNewTopicOpen] = useState(false);
  const [cardTopic, setCardTopic] = useState<Topic | null>(null);
  const [toDelete, setToDelete] = useState<Pending | null>(null);

  const subjectTopics = topics.filter((topic) => topic.subjectId === subjectId);
  const subjectCards = flashcards.filter((card) => card.subjectId === subjectId);

  return (
    <View style={styles.list}>
      <SubjectPicker
        selected={[subjectId]}
        onToggle={(id) => {
          setSubjectId(id);
          setOpenTopicId(null);
        }}
      />

      <Text style={styles.summary}>
        {subjects[subjectId].name} · {subjectTopics.length} {subjectTopics.length === 1 ? 'tópico' : 'tópicos'} ·{' '}
        {subjectCards.length} {subjectCards.length === 1 ? 'card' : 'cards'} · os alunos veem na hora
      </Text>

      {subjectTopics.map((topic) => {
        const cards = flashcards.filter((card) => card.topicId === topic.id);
        const open = openTopicId === topic.id;
        return (
          <View key={topic.id} style={[styles.topic, open && styles.topicOpen]}>
            <Pressable
              onPress={() => setOpenTopicId(open ? null : topic.id)}
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              accessibilityLabel={`${topic.name}, ${cards.length} cards`}
              style={styles.topicHeader}>
              <View style={[styles.diamond, { backgroundColor: subjects[subjectId].color }]} />
              <View style={styles.flex}>
                <Text style={styles.topicName}>{topic.name}</Text>
                <Text style={styles.topicMeta}>
                  {cards.length} {cards.length === 1 ? 'card cadastrado' : 'cards cadastrados'}
                </Text>
              </View>
              <Glyph
                name={open ? 'chevronDown' : 'chevronRight'}
                size={18}
                strokeWidth={3}
                color={colors.text.secondary}
              />
            </Pressable>

            {open && (
              <View style={styles.cards}>
                {cards.map((card) => (
                  <View key={card.id} style={styles.card}>
                    <View style={styles.flex}>
                      <Text style={styles.question}>{card.question}</Text>
                      <View style={styles.answerRow}>
                        <Glyph name="check" size={13} strokeWidth={3.2} color={colors.accent.success} />
                        <Text style={styles.answer}>{card.answer}</Text>
                      </View>
                      <Text style={styles.distractors} numberOfLines={1}>
                        Erradas: {card.distractors.join(' · ')}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => setToDelete({ kind: 'card', id: card.id, label: card.question })}
                      accessibilityRole="button"
                      accessibilityLabel="Excluir card"
                      hitSlop={6}
                      style={styles.trash}>
                      <Glyph name="trash" size={17} color={colors.text.secondary} />
                    </Pressable>
                  </View>
                ))}
                {cards.length === 0 && <Text style={styles.empty}>Nenhum card neste tópico ainda.</Text>}
                <View style={styles.topicActions}>
                  <View style={styles.flex}>
                    <DashedButton label="Novo card" onPress={() => setCardTopic(topic)} />
                  </View>
                  <Pressable
                    onPress={() => setToDelete({ kind: 'topic', id: topic.id, label: topic.name })}
                    accessibilityRole="button"
                    accessibilityLabel={`Excluir tópico ${topic.name}`}
                    style={styles.deleteTopic}>
                    <Glyph name="trash" size={18} color={colors.accent.hpPink} />
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        );
      })}

      <DashedButton label="Novo tópico" hint={`em ${subjects[subjectId].name}`} onPress={() => setNewTopicOpen(true)} />

      {newTopicOpen && (
        <NewTopicSheet
          subjectId={subjectId}
          onClose={() => setNewTopicOpen(false)}
          onCreated={(topic) => setOpenTopicId(topic.id)}
        />
      )}
      {cardTopic && <NewCardSheet topic={cardTopic} onClose={() => setCardTopic(null)} />}
      {toDelete && (
        <ConfirmSheet
          eyebrow={toDelete.kind === 'topic' ? 'EXCLUIR TÓPICO' : 'EXCLUIR CARD'}
          title={toDelete.kind === 'topic' ? toDelete.label : 'Excluir este card?'}
          message={
            toDelete.kind === 'topic'
              ? 'Todos os cards deste tópico serão removidos das rodadas e duelos dos alunos.'
              : `"${toDelete.label}" sai das rodadas e dos duelos dos alunos.`
          }
          confirmLabel="EXCLUIR"
          onConfirm={() => {
            if (toDelete.kind === 'topic') deleteTopic(toDelete.id);
            else deleteFlashcard(toDelete.id);
            showToast(toDelete.kind === 'topic' ? 'Tópico excluído' : 'Card excluído');
          }}
          onClose={() => setToDelete(null)}
        />
      )}
    </View>
  );
}

function NewTopicSheet({
  subjectId,
  onClose,
  onCreated,
}: {
  subjectId: SubjectId;
  onClose: () => void;
  onCreated: (topic: Topic) => void;
}) {
  const { addTopic, topics } = useSchool();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const trimmed = name.trim();
  const error = !trimmed
    ? 'Dê um nome para o tópico.'
    : topics.some((topic) => topic.subjectId === subjectId && topic.name.toLowerCase() === trimmed.toLowerCase())
      ? 'Esse tópico já existe.'
      : undefined;

  return (
    <BottomSheet onClose={onClose}>
      <SheetHeader
        eyebrow={`NOVO TÓPICO · ${subjects[subjectId].name.toUpperCase()}`}
        eyebrowColor={subjects[subjectId].color}
        title="Criar tópico"
        onClose={onClose}
      />
      <TextField
        label="NOME DO TÓPICO"
        value={name}
        onChangeText={setName}
        placeholder="Ex.: Equação do 2º grau"
        error={submitted ? error : undefined}
      />
      <ChunkyButton
        icon="plus"
        label="CRIAR TÓPICO"
        color={colors.brand.primary}
        depthColor={colors.depth.primary}
        onPress={() => {
          setSubmitted(true);
          if (error) return;
          const topic = addTopic(subjectId, trimmed);
          showToast(`Tópico "${topic.name}" criado`);
          onCreated(topic);
          onClose();
        }}
      />
    </BottomSheet>
  );
}

function NewCardSheet({ topic, onClose }: { topic: Topic; onClose: () => void }) {
  const { addFlashcard } = useSchool();
  const { showToast } = useToast();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [wrong, setWrong] = useState(['', '', '']);
  const [submitted, setSubmitted] = useState(false);

  const distractors = wrong.map((item) => item.trim()).filter(Boolean);
  const errors = {
    question: question.trim().length < 5 ? 'Escreva a pergunta.' : undefined,
    answer: !answer.trim() ? 'Informe a resposta certa.' : undefined,
    wrong:
      distractors.length === 0
        ? 'Adicione pelo menos uma alternativa errada.'
        : distractors.some((item) => item.toLowerCase() === answer.trim().toLowerCase())
          ? 'Uma alternativa errada está igual à resposta certa.'
          : new Set(distractors.map((item) => item.toLowerCase())).size !== distractors.length
            ? 'Há alternativas erradas repetidas.'
            : undefined,
  };

  const submit = () => {
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    addFlashcard({
      subjectId: topic.subjectId,
      topicId: topic.id,
      question: question.trim(),
      answer: answer.trim(),
      distractors,
    });
    showToast(`Card adicionado em "${topic.name}"`);
    onClose();
  };

  return (
    <BottomSheet onClose={onClose}>
      <SheetHeader
        eyebrow={topic.name.toUpperCase()}
        eyebrowColor={subjects[topic.subjectId].color}
        title="Novo flashcard"
        onClose={onClose}
      />

      <TextField
        label="PERGUNTA"
        value={question}
        onChangeText={setQuestion}
        placeholder="Ex.: Quanto é 3/4 em número decimal?"
        multiline
        minHeight={72}
        error={submitted ? errors.question : undefined}
      />
      <TextField
        label="RESPOSTA CERTA"
        icon="check"
        iconColor={colors.accent.success}
        value={answer}
        onChangeText={setAnswer}
        placeholder="Ex.: 0,75"
        error={submitted ? errors.answer : undefined}
      />

      <View style={styles.section}>
        <SectionLabel label="ALTERNATIVAS ERRADAS" hint="até 3" />
        {wrong.map((value, index) => (
          <TextField
            key={index}
            icon="close"
            iconColor={colors.accent.hpPink}
            value={value}
            onChangeText={(text) => setWrong((prev) => prev.map((item, i) => (i === index ? text : item)))}
            placeholder={`Alternativa errada ${index + 1}`}
            accessibilityLabel={`Alternativa errada ${index + 1}`}
          />
        ))}
        {submitted && errors.wrong && <Text style={styles.error}>{errors.wrong}</Text>}
      </View>

      <ChunkyButton
        icon="plus"
        label="ADICIONAR CARD"
        color={colors.brand.primary}
        depthColor={colors.depth.primary}
        onPress={submit}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  summary: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  topic: {
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.bg.border,
    backgroundColor: colors.bg.surface,
    overflow: 'hidden',
  },
  topicOpen: {
    borderColor: colors.brand.primary,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  diamond: {
    width: 9,
    height: 9,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  topicName: {
    fontFamily: fonts.black,
    fontSize: 15,
    color: colors.text.primary,
  },
  topicMeta: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  cards: {
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.bg.base,
  },
  question: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.primary,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  answer: {
    flexShrink: 1,
    fontFamily: fonts.black,
    fontSize: 12,
    color: colors.accent.success,
  },
  distractors: {
    marginTop: 2,
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.text.secondary,
  },
  trash: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  topicActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteTopic: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.bg.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: 8,
  },
  error: {
    fontFamily: fonts.extraBold,
    fontSize: 12,
    color: colors.accent.hpPink,
  },
});
