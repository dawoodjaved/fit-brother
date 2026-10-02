import React, { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Button } from "../../components/Button";
import { TextField } from "../../components/Inputs";
import { Card } from "../../components/Card";
import { RestTimer } from "../../components/RestTimer";
import { PopIn, FadeInHeader } from "../../components/motion";
import { PatternIcon } from "../../components/icons/PatternIcon";
import { ProgressBar } from "../../components/charts/VisualMeter";
import { exercises } from "../../data/seed";
import {
  getSwapCandidates,
  overloadHint,
  restGuidance,
  useAppStore,
} from "../../store/appStore";
import { colors, spacing } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";
import type { WorkoutSet } from "../../types";
import { format } from "date-fns";
import { notify } from "../../utils/notify";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutLogger">;

export function WorkoutLoggerScreen({ route, navigation }: Props) {
  const sessionIds = route.params.sessionIds?.length
    ? route.params.sessionIds
    : [route.params.exerciseId];
  const [sessionIndex, setSessionIndex] = useState(0);
  const exerciseId = sessionIds[sessionIndex] || route.params.exerciseId;
  const exercise = exercises.find((e) => e.id === exerciseId);
  const user = useAppStore((s) => s.user);
  const logWorkout = useAppStore((s) => s.logWorkout);
  const logs = useAppStore((s) => s.workoutLogs);

  const lastLog = useMemo(
    () => logs.find((l) => l.exerciseId === exerciseId),
    [logs, exerciseId]
  );
  const lastTop = lastLog?.sets?.reduce(
    (a, b) => (b.weight * b.reps >= a.weight * a.reps ? b : a),
    lastLog.sets[0]
  );

  const [sets, setSets] = useState<WorkoutSet[]>(() => {
    if (lastTop) {
      return [
        { reps: lastTop.reps, weight: lastTop.weight, completed: false },
        { reps: lastTop.reps, weight: lastTop.weight, completed: false },
        { reps: lastTop.reps, weight: lastTop.weight, completed: false },
      ];
    }
    return [
      { reps: 8, weight: 20, completed: false },
      { reps: 8, weight: 20, completed: false },
      { reps: 8, weight: 20, completed: false },
    ];
  });
  const [showRest, setShowRest] = useState(false);
  const [savedCompare, setSavedCompare] = useState<string | null>(null);

  const rest = useMemo(
    () => restGuidance(user?.goals?.[0], user?.level || "beginner"),
    [user]
  );

  const swaps = useMemo(
    () =>
      getSwapCandidates(
        exerciseId,
        user?.equipmentPreferences || ["bodyweight"],
        user?.limitations || []
      ).slice(0, 3),
    [exerciseId, user]
  );

  const limitedSwapHint = useMemo(() => {
    if (!user?.limitations?.length) return null;
    if (user.limitations.includes("shoulder_sensitive") && exercise?.pattern === "push") {
      return swaps[0];
    }
    if (user.limitations.includes("knee_sensitive") && (exercise?.pattern === "squat" || exercise?.pattern === "lunge")) {
      return swaps[0];
    }
    if (user.limitations.includes("lower_back_sensitive") && exercise?.pattern === "hinge") {
      return swaps[0];
    }
    return null;
  }, [user, exercise, swaps]);

  if (!exercise) {
    return (
      <Screen>
        <AppText>Missing exercise</AppText>
      </Screen>
    );
  }

  const updateSet = (idx: number, patch: Partial<WorkoutSet>) => {
    setSets((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const switchExercise = (id: string) => {
    const idx = sessionIds.indexOf(id);
    if (idx >= 0) setSessionIndex(idx);
    else {
      navigation.replace("WorkoutLogger", {
        exerciseId: id,
        sessionIds: [id, ...sessionIds.filter((x) => x !== id)],
      });
    }
    setSavedCompare(null);
    setShowRest(false);
  };

  return (
    <Screen scroll>
      <FadeInHeader>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <PatternIcon pattern={exercise.pattern} size={32} active />
          <View style={{ flex: 1 }}>
            <AppText variant="label">
              LOG
              {sessionIds.length > 1
                ? ` · ${sessionIndex + 1}/${sessionIds.length}`
                : ""}
            </AppText>
            <AppText variant="title" style={{ marginTop: 4 }}>
              {exercise.name}
            </AppText>
          </View>
        </View>
        {sessionIds.length > 1 ? (
          <ProgressBar
            progress={(sessionIndex + 1) / sessionIds.length}
            height={5}
          />
        ) : null}
      </FadeInHeader>

      {sessionIds.length > 1 ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: spacing.md }}>
          {sessionIds.map((id, i) => {
            const ex = exercises.find((e) => e.id === id);
            return (
              <Button
                key={id}
                title={ex?.name?.split(" ").slice(0, 2).join(" ") || id}
                variant={i === sessionIndex ? "primary" : "secondary"}
                style={{ marginBottom: 0 }}
                onPress={() => {
                  setSessionIndex(i);
                  const prev = logs.find((l) => l.exerciseId === id);
                  const top = prev?.sets?.[0];
                  setSets(
                    top
                      ? [
                          { reps: top.reps, weight: top.weight, completed: false },
                          { reps: top.reps, weight: top.weight, completed: false },
                          { reps: top.reps, weight: top.weight, completed: false },
                        ]
                      : [
                          { reps: 8, weight: 20, completed: false },
                          { reps: 8, weight: 20, completed: false },
                          { reps: 8, weight: 20, completed: false },
                        ]
                  );
                  setSavedCompare(null);
                }}
              />
            );
          })}
        </View>
      ) : null}

      {lastTop ? (
        <Card style={{ marginBottom: spacing.md, borderColor: colors.accentDim }}>
          <AppText variant="label">COMPARE LAST SET</AppText>
          <AppText style={{ marginTop: 6 }}>
            Last time: {lastTop.weight}kg × {lastTop.reps}
          </AppText>
          <AppText variant="caption" color={colors.accent} style={{ marginTop: 4 }}>
            {overloadHint(exercise.id, logs)}
          </AppText>
        </Card>
      ) : null}

      {limitedSwapHint ? (
        <PopIn>
          <Card style={{ marginBottom: spacing.md, borderColor: colors.warning }}>
            <AppText variant="label">SMART SWAP</AppText>
            <AppText style={{ marginTop: 6 }}>
              Your profile notes sensitivity — try {limitedSwapHint.name} instead?
            </AppText>
            <Button
              title={`Swap to ${limitedSwapHint.name}`}
              variant="secondary"
              style={{ marginTop: spacing.sm }}
              onPress={() => switchExercise(limitedSwapHint.id)}
            />
          </Card>
        </PopIn>
      ) : null}

      <Button
        title="Open GIF form guide"
        variant="secondary"
        style={{ marginBottom: spacing.md }}
        onPress={() => navigation.navigate("ExerciseDetail", { exerciseId: exercise.id })}
      />

      {sets.map((s, idx) => (
        <Card key={idx} style={{ marginBottom: spacing.sm }}>
          <AppText variant="label">SET {idx + 1}</AppText>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1 }}>
              <TextField
                label="kg"
                keyboardType="numeric"
                value={String(s.weight)}
                onChangeText={(t) => updateSet(idx, { weight: Number(t) || 0 })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextField
                label="reps"
                keyboardType="numeric"
                value={String(s.reps)}
                onChangeText={(t) => updateSet(idx, { reps: Number(t) || 0 })}
              />
            </View>
          </View>
          <Button
            title={s.completed ? "Completed" : "Complete set + rest"}
            variant={s.completed ? "secondary" : "primary"}
            onPress={() => {
              updateSet(idx, { completed: true });
              setShowRest(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            }}
          />
        </Card>
      ))}

      {showRest ? (
        <RestTimer
          seconds={rest.seconds}
          why={rest.why}
          onDone={() => setShowRest(false)}
        />
      ) : null}

      {swaps.length ? (
        <Card style={{ marginTop: spacing.md }}>
          <AppText variant="label">MORE SWAPS</AppText>
          {swaps.map((s) => (
            <Button
              key={s.id}
              title={s.name}
              variant="ghost"
              style={{ marginTop: 4 }}
              onPress={() => switchExercise(s.id)}
            />
          ))}
        </Card>
      ) : null}

      {savedCompare ? (
        <PopIn>
          <Card style={{ marginTop: spacing.md, borderColor: colors.accent }}>
            <AppText variant="subtitle" color={colors.accent}>
              Next step locked in
            </AppText>
            <AppText style={{ marginTop: 6 }}>{savedCompare}</AppText>
          </Card>
        </PopIn>
      ) : null}

      <Button
        title={
          sessionIndex < sessionIds.length - 1
            ? "Save & next exercise"
            : "Save workout"
        }
        style={{ marginTop: spacing.lg }}
        onPress={() => {
          logWorkout({
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            sets,
            date: format(new Date(), "yyyy-MM-dd"),
          });
          const top = sets.reduce((a, b) =>
            b.weight * b.reps >= a.weight * a.reps ? b : a
          );
          const compare = lastTop
            ? `Last ${lastTop.weight}kg × ${lastTop.reps} → today ${top.weight}kg × ${top.reps}. ${overloadHint(exercise.id, [{ ...lastLog!, sets, exerciseId: exercise.id, exerciseName: exercise.name, date: "", id: "", synced: true }])}`
            : `Logged ${top.weight}kg × ${top.reps}. Next time add reps or +2.5kg.`;
          setSavedCompare(compare);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          notify("Logged", compare);
          if (sessionIndex < sessionIds.length - 1) {
            const nextId = sessionIds[sessionIndex + 1]!;
            setSessionIndex(sessionIndex + 1);
            const prev = logs.find((l) => l.exerciseId === nextId);
            const topPrev = prev?.sets?.[0];
            setSets(
              topPrev
                ? [
                    { reps: topPrev.reps, weight: topPrev.weight, completed: false },
                    { reps: topPrev.reps, weight: topPrev.weight, completed: false },
                    { reps: topPrev.reps, weight: topPrev.weight, completed: false },
                  ]
                : [
                    { reps: 8, weight: 20, completed: false },
                    { reps: 8, weight: 20, completed: false },
                    { reps: 8, weight: 20, completed: false },
                  ]
            );
            setShowRest(false);
          } else {
            navigation.goBack();
          }
        }}
      />
    </Screen>
  );
}
