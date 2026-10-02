import React, { useEffect, useMemo } from "react";
import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { GifFormGuide } from "../../components/GifFormGuide";
import { Chip } from "../../components/Inputs";
import { FormMistakeChecklist } from "../../components/engagement/FormMistakeChecklist";
import { FadeInHeader, PopIn } from "../../components/motion";
import { PatternIcon } from "../../components/icons/PatternIcon";
import { exercises, jargonGlossary } from "../../data/seed";
import { resolveGifKey, type GifKey } from "../../data/exerciseGifs";
import {
  getSwapCandidates,
  overloadHint,
  useAppStore,
} from "../../store/appStore";
import { colors, spacing } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";
import { notify } from "../../utils/notify";

type Props = NativeStackScreenProps<RootStackParamList, "ExerciseDetail">;

export function ExerciseDetailScreen({ route, navigation }: Props) {
  const { exerciseId, pathId } = route.params;
  const exercise = exercises.find((e) => e.id === exerciseId);
  const user = useAppStore((s) => s.user);
  const markLessonComplete = useAppStore((s) => s.markLessonComplete);
  const markFormUnderstood = useAppStore((s) => s.markFormUnderstood);
  const touchFormActivity = useAppStore((s) => s.touchFormActivity);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const toggleSessionExercise = useAppStore((s) => s.toggleSessionExercise);
  const logs = useAppStore((s) => s.workoutLogs);

  useEffect(() => {
    touchFormActivity();
  }, [exerciseId, touchFormActivity]);

  const gifKey = useMemo(
    () =>
      (exercise?.gifKey as GifKey | undefined) ||
      resolveGifKey(exerciseId, exercise?.pattern),
    [exercise, exerciseId]
  );

  const swaps = useMemo(
    () =>
      getSwapCandidates(
        exerciseId,
        user?.equipmentPreferences || ["bodyweight"],
        user?.limitations || []
      ),
    [exerciseId, user]
  );

  if (!exercise) {
    return (
      <Screen>
        <AppText>Exercise not found</AppText>
      </Screen>
    );
  }

  const fav = user?.favorites.includes(exercise.id);
  const inSession = user?.sessionExerciseIds?.includes(exercise.id);
  const understood = user?.formUnderstood?.includes(exercise.id);
  const terms = jargonGlossary.filter((j) => exercise.jargonTerms?.includes(j.term));

  return (
    <Screen scroll>
      <FadeInHeader>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <PatternIcon pattern={exercise.pattern} size={32} active />
          <View style={{ flex: 1 }}>
            <AppText variant="label">{exercise.pattern.toUpperCase()} · GIF FORM GUIDE</AppText>
            <AppText variant="title" style={{ marginVertical: spacing.sm }}>
              {exercise.name}
            </AppText>
            <AppText variant="caption">
              {exercise.level} · tempo {exercise.tempo}
            </AppText>
            {understood ? (
              <AppText variant="caption" color={colors.accent} style={{ marginTop: 6 }}>
                Form marked understood · streak active
              </AppText>
            ) : null}
          </View>
        </View>
      </FadeInHeader>

      <GifFormGuide
        gifKey={gifKey}
        gifUrl={exercise.gifUrl}
        exerciseName={exercise.name}
        muscles={exercise.muscles}
        cues={exercise.cues}
        restartKey={exercise.id}
      />

      <Card style={{ marginVertical: spacing.md }}>
        <AppText variant="label">MUSCLE ROLES (FULL)</AppText>
        <RoleRow label="Primary" color={colors.musclePrimary} items={exercise.muscles.primary} />
        <RoleRow label="Synergist" color={colors.muscleSynergist} items={exercise.muscles.synergist} />
        <RoleRow label="Stabilizer" color={colors.muscleStabilizer} items={exercise.muscles.stabilizer} />
        <RoleRow
          label="Antagonist"
          color={colors.muscleAntagonist}
          items={exercise.muscles.antagonist}
        />
      </Card>

      <AppText variant="label">SETUP</AppText>
      {exercise.setupSteps.map((s, i) => (
        <AppText key={i} style={{ marginTop: 4 }}>
          {i + 1}. {s}
        </AppText>
      ))}
      <AppText variant="label" style={{ marginTop: spacing.md }}>
        EXECUTION
      </AppText>
      {exercise.executionSteps.map((s, i) => (
        <AppText key={i} style={{ marginTop: 4 }}>
          {i + 1}. {s}
        </AppText>
      ))}
      <AppText variant="caption" style={{ marginTop: spacing.sm }}>
        Breathing: {exercise.breathing}
      </AppText>

      <FormMistakeChecklist
        mistakes={exercise.commonMistakes}
        onAllClear={() => {
          markFormUnderstood(exercise.id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          notify("Form understood", "Form streak updated. Keep the GIF habit going.");
        }}
      />

      {terms.length ? (
        <Card style={{ marginTop: spacing.md }}>
          <AppText variant="label">TERMS IN THIS LESSON</AppText>
          {terms.map((t) => (
            <View key={t.term} style={{ marginTop: 6 }}>
              <AppText color={colors.text}>{t.term}</AppText>
              <AppText variant="caption">{t.definition}</AppText>
            </View>
          ))}
        </Card>
      ) : null}

      <AppText variant="label" style={{ marginTop: spacing.lg }}>
        SMART SWAPS
      </AppText>
      <AppText variant="caption" style={{ marginBottom: spacing.sm }}>
        Same pattern · respects your equipment & limitations
      </AppText>
      {swaps.length ? (
        swaps.slice(0, 4).map((s) => (
          <Button
            key={s.id}
            title={s.name}
            variant="secondary"
            style={{ marginBottom: 8 }}
            onPress={() =>
              navigation.replace("ExerciseDetail", { exerciseId: s.id, pathId })
            }
          />
        ))
      ) : (
        <AppText variant="caption">No swaps match current filters</AppText>
      )}

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: spacing.md, gap: 8 }}>
        {exercise.regressions.map((id) => {
          const ex = exercises.find((e) => e.id === id);
          return ex ? (
            <Chip
              key={id}
              label={`Easier: ${ex.name}`}
              onPress={() =>
                navigation.replace("ExerciseDetail", { exerciseId: id, pathId })
              }
            />
          ) : null;
        })}
        {exercise.progressions.map((id) => {
          const ex = exercises.find((e) => e.id === id);
          return ex ? (
            <Chip
              key={id}
              label={`Harder: ${ex.name}`}
              onPress={() =>
                navigation.replace("ExerciseDetail", { exerciseId: id, pathId })
              }
            />
          ) : null;
        })}
      </View>

      <PopIn>
        <Card style={{ marginTop: spacing.lg }}>
          <AppText variant="label">OVERLOAD HINT</AppText>
          <AppText style={{ marginTop: 6 }}>{overloadHint(exercise.id, logs)}</AppText>
        </Card>
      </PopIn>

      <Button
        title={fav ? "Remove favorite" : "Save to form library"}
        variant="secondary"
        style={{ marginTop: spacing.md }}
        onPress={() => {
          toggleFavorite(exercise.id);
          Haptics.selectionAsync().catch(() => {});
        }}
      />
      <Button
        title={inSession ? "Remove from today’s session" : "Add to today’s session"}
        variant="ghost"
        style={{ marginTop: spacing.sm }}
        onPress={() => {
          toggleSessionExercise(exercise.id);
          notify(
            inSession ? "Removed" : "Added",
            inSession
              ? "Exercise removed from Train session builder."
              : "Open Train to build a 3–5 move session."
          );
        }}
      />
      <Button
        title="Mark lesson complete"
        style={{ marginTop: spacing.sm }}
        onPress={() => {
          markLessonComplete(exercise.id, pathId || user?.activePathId);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          notify("Nice", "Lesson marked complete. Path progress updated.");
        }}
      />
      <Button
        title="Log this exercise"
        variant="ghost"
        style={{ marginTop: spacing.sm }}
        onPress={() => navigation.navigate("WorkoutLogger", { exerciseId: exercise.id })}
      />
    </Screen>
  );
}

function RoleRow({
  label,
  color,
  items,
}: {
  label: string;
  color: string;
  items: string[];
}) {
  if (!items.length) return null;
  return (
    <View style={{ marginTop: 8 }}>
      <AppText variant="caption" color={color}>
        {label}
      </AppText>
      <AppText>{items.join(", ")}</AppText>
    </View>
  );
}
