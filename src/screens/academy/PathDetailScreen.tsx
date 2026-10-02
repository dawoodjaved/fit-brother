import React from "react";
import { Pressable, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { FadeInHeader, FadeInItem } from "../../components/motion";
import { PatternIcon } from "../../components/icons/PatternIcon";
import { CapacityRing, ProgressBar } from "../../components/charts/VisualMeter";
import { learningPaths, exercises } from "../../data/seed";
import { useAppStore } from "../../store/appStore";
import { colors, spacing } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "PathDetail">;

export function PathDetailScreen({ route, navigation }: Props) {
  const path = learningPaths.find((p) => p.id === route.params.pathId);
  const user = useAppStore((s) => s.user);
  const setActivePath = useAppStore((s) => s.setActivePath);

  React.useEffect(() => {
    if (path) setActivePath(path.id);
  }, [path, setActivePath]);

  if (!path) {
    return (
      <Screen>
        <AppText>Path not found</AppText>
      </Screen>
    );
  }

  const done = user?.completedLessons || [];
  let unlockedCount = 1;
  path.exerciseIds.forEach((id, idx) => {
    if (idx === 0 || done.includes(path.exerciseIds[idx - 1]!)) unlockedCount = idx + 1;
  });
  const progress = user?.pathProgress?.[path.id] || 0;
  const pct = Math.round((progress / path.exerciseIds.length) * 100);
  const frac = path.exerciseIds.length
    ? progress / path.exerciseIds.length
    : 0;

  return (
    <Screen scroll>
      <FadeInHeader>
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
          <CapacityRing
            progress={frac}
            size={56}
            label={`${pct}%`}
          />
          <View style={{ flex: 1 }}>
            <AppText variant="label">{path.level.toUpperCase()}</AppText>
            <AppText variant="title" style={{ marginVertical: spacing.sm }}>
              {path.title}
            </AppText>
            <AppText>{path.description}</AppText>
          </View>
        </View>
        <ProgressBar progress={frac} height={6} />
        <AppText variant="caption" style={{ marginVertical: spacing.md }}>
          {progress}/{path.exerciseIds.length} lessons · {path.weeks} weeks
        </AppText>
        {user?.activePathId === path.id ? (
          <AppText variant="caption" color={colors.accent}>
            Active path — completing lessons unlocks the next
          </AppText>
        ) : (
          <Button
            title="Set as active path"
            variant="secondary"
            onPress={() => setActivePath(path.id)}
          />
        )}
      </FadeInHeader>

      {path.exerciseIds.map((id, idx) => {
        const ex = exercises.find((e) => e.id === id);
        const complete = done.includes(id);
        const locked = idx >= unlockedCount && !complete;
        return (
          <FadeInItem key={id} index={idx}>
            <Pressable
              disabled={locked}
              onPress={() =>
                navigation.navigate("ExerciseDetail", {
                  exerciseId: id,
                  pathId: path.id,
                })
              }
            >
              <Card
                style={{
                  marginBottom: spacing.sm,
                  opacity: locked ? 0.45 : 1,
                  borderColor: complete ? colors.accent : colors.border,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {ex?.pattern ? (
                    <PatternIcon pattern={ex.pattern} size={24} active={complete} />
                  ) : null}
                  <View style={{ flex: 1 }}>
                    <AppText variant="subtitle">
                      {idx + 1}. {ex?.name || id}
                    </AppText>
                    <AppText variant="caption">
                      {complete
                        ? "Done"
                        : locked
                          ? "Locked"
                          : "Ready"}
                    </AppText>
                  </View>
                  {complete ? (
                    <CapacityRing progress={1} size={28} />
                  ) : locked ? (
                    <AppText variant="caption" color={colors.textMuted}>
                      ···
                    </AppText>
                  ) : (
                    <CapacityRing progress={0} size={28} />
                  )}
                </View>
              </Card>
            </Pressable>
          </FadeInItem>
        );
      })}
    </Screen>
  );
}
