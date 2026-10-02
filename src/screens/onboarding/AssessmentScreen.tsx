import React, { useState } from "react";
import { View } from "react-native";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Button } from "../../components/Button";
import { Chip } from "../../components/Inputs";
import { useAppStore } from "../../store/appStore";
import { colors, spacing } from "../../theme";
import type { FitnessLevel } from "../../types";

const QUESTIONS = [
  {
    id: "squat",
    prompt: "Can you sit to a chair and stand with control?",
    options: [
      { label: "Not yet — need support", score: 0 },
      { label: "Yes, bodyweight only", score: 1 },
      { label: "Yes, with a dumbbell", score: 2 },
    ],
  },
  {
    id: "push",
    prompt: "Push-up ability right now?",
    options: [
      { label: "Wall or knee push-ups", score: 0 },
      { label: "A few full push-ups", score: 1 },
      { label: "Solid sets of push-ups", score: 2 },
    ],
  },
  {
    id: "hinge",
    prompt: "Hip hinge familiarity?",
    options: [
      { label: "New to me", score: 0 },
      { label: "Practiced with bodyweight", score: 1 },
      { label: "Comfortable with RDLs", score: 2 },
    ],
  },
];

export function AssessmentScreen() {
  const completeAssessment = useAppStore((s) => s.completeAssessment);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const total = Object.values(answers).reduce((a, b) => a + b, 0);
  const level: FitnessLevel =
    total <= 2 ? "beginner" : total <= 4 ? "intermediate" : "advanced";

  const ready = QUESTIONS.every((q) => answers[q.id] !== undefined);

  return (
    <Screen scroll>
      <AppText variant="label">CAPABILITY CHECK</AppText>
      <AppText variant="title" style={{ marginVertical: spacing.sm }}>
        Honest assessment
      </AppText>
      <AppText style={{ marginBottom: spacing.lg }}>
        Not just “I am beginner” — we place you on a true Foundations path when needed.
      </AppText>

      {QUESTIONS.map((q) => (
        <View key={q.id} style={{ marginBottom: spacing.lg }}>
          <AppText variant="subtitle" style={{ marginBottom: spacing.sm }}>
            {q.prompt}
          </AppText>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {q.options.map((o) => (
              <Chip
                key={o.label}
                label={o.label}
                selected={answers[q.id] === o.score}
                onPress={() => setAnswers((a) => ({ ...a, [q.id]: o.score }))}
              />
            ))}
          </View>
        </View>
      ))}

      {ready ? (
        <AppText style={{ marginBottom: spacing.md }}>
          Suggested level: <AppText color={colors.accent}>{level}</AppText>
        </AppText>
      ) : null}

      <Button
        title="Start training"
        disabled={!ready}
        onPress={() => completeAssessment(level)}
      />
    </Screen>
  );
}
