import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DeckCard } from "@/components/flashcards/DeckCard";
import { FlashStatsCard } from "@/components/flashcards/FlashStatsCard";
import { RoundSetupSheet } from "@/components/flashcards/RoundSetupSheet";
import { Glyph } from "@/components/ui/Glyph";
import { GradientButton } from "@/components/ui/GradientButton";
import {
  flashcardGlows,
  ScreenBackground,
} from "@/components/ui/ScreenBackground";
import { SectionLabel } from "@/components/ui/SectionLabel";
import {
  STICKY_FOOTER_SPACE,
  StickyFooter,
} from "@/components/ui/StickyFooter";
import { colors, fonts, solidShadow } from "@/constants/theme";
import { subjectOrder, subjects } from "@/data/mock";
import { deckStats } from "@/lib/flashcards";
import { useGame } from "@/store/GameProvider";
import { useSchool } from "@/store/SchoolProvider";
import type { SubjectId } from "@/types/game";

export default function FlashcardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cardProgress, flashcardDaily } = useGame();
  const { flashcards, topics } = useSchool();
  /** Matérias pré-selecionadas no modal; null = modal fechado. */
  const [setupSubjects, setSetupSubjects] = useState<SubjectId[] | null>(null);

  const startRound = (topicIds: string[], size: number) => {
    setSetupSubjects(null);
    router.push({
      pathname: "/rodada",
      params: { topicos: topicIds.join(","), quantidade: String(size) },
    });
  };

  return (
    <ScreenBackground glows={flashcardGlows}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 4 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>FLASH CARDS</Text>
            <Text style={styles.subtitle}>
              Revise um pouco todo dia e suba de nível
            </Text>
          </View>
          <Pressable
            onPress={() => setSetupSubjects(subjectOrder)}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Nova rodada de perguntas"
          >
            <Glyph
              name="plus"
              size={24}
              strokeWidth={3.2}
              color={colors.text.onColor}
            />
          </Pressable>
        </View>

        <FlashStatsCard
          totalCards={flashcards.length}
          cardsToday={flashcardDaily.cards}
          xpToday={flashcardDaily.xp}
        />

        <View style={styles.decks}>
          <SectionLabel label="SEUS BARALHOS" />
          {subjectOrder.map((id) => (
            <DeckCard
              key={id}
              subject={subjects[id]}
              stats={deckStats(id, topics, flashcards, cardProgress)}
              onPress={() => setSetupSubjects([id])}
            />
          ))}
        </View>
      </ScrollView>

      <StickyFooter>
        <GradientButton
          size="md"
          label="INICIAR RODADA DE PERGUNTAS"
          onPress={() => setSetupSubjects(subjectOrder)}
        />
      </StickyFooter>

      {setupSubjects && (
        <RoundSetupSheet
          initialSubjectIds={setupSubjects}
          onClose={() => setSetupSubjects(null)}
          onStart={startRound}
        />
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: STICKY_FOOTER_SPACE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerText: {
    flexShrink: 1,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 32,
    color: colors.text.primary,
  },
  subtitle: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.text.secondary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brand.primary,
    ...solidShadow(4, colors.depth.primary),
  },
  pressed: {
    transform: [{ translateY: 2 }],
  },
  decks: {
    gap: 10,
  },
});
