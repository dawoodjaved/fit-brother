import React, { useMemo } from "react";
import { Alert, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { format, parseISO } from "date-fns";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { FadeInHeader, FadeInItem } from "../../components/motion";
import { useAppStore } from "../../store/appStore";
import { colors, spacing } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";
import type { WorkoutLogEntry } from "../../types";
import { notify } from "../../utils/notify";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutHistory">;

function setsSummary(sets: WorkoutLogEntry["sets"]) {
  const done = sets.filter((s) => s.completed).length || sets.length;
  const top = sets.reduce(
    (a, b) => (b.weight * b.reps >= a.weight * a.reps ? b : a),
    sets[0] || { reps: 0, weight: 0, completed: false }
  );
  return `${done} set${done === 1 ? "" : "s"} · top ${top.weight}kg × ${top.reps}`;
}

export function WorkoutHistoryScreen({ navigation }: Props) {
  const logs = useAppStore((s) => s.workoutLogs);
  const deleteWorkout = useAppStore((s) => s.deleteWorkout);

  const grouped = useMemo(() => {
    const map = new Map<string, WorkoutLogEntry[]>();
    for (const log of logs) {
      const key = log.date || "unknown";
      const list = map.get(key) || [];
      list.push(log);
      map.set(key, list);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [logs]);

  const confirmDelete = (log: WorkoutLogEntry) => {
    Alert.alert(
      "Delete workout?",
      `${log.exerciseName} · ${log.date}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteWorkout(log.id);
            notify("Deleted", `${log.exerciseName} removed from history.`);
          },
        },
      ]
    );
  };

  return (
    <Screen scroll>
      <FadeInHeader>
        <AppText variant="label">TRAINING LOG</AppText>
        <AppText variant="title" style={{ marginTop: 4 }}>
          Workout history
        </AppText>
        <AppText style={{ marginTop: spacing.sm, marginBottom: spacing.md }}>
          Fix a mistyped weight, or remove a session you logged by mistake.
        </AppText>
      </FadeInHeader>

      {!logs.length ? (
        <Card>
          <AppText variant="subtitle">No workouts yet</AppText>
          <AppText variant="caption" style={{ marginTop: 6 }}>
            Log from Train or Academy — history shows up here.
          </AppText>
          <Button
            title="Go to Train"
            variant="secondary"
            style={{ marginTop: spacing.md }}
            onPress={() => navigation.navigate("MainTabs", { screen: "Train" })}
          />
        </Card>
      ) : (
        grouped.map(([date, dayLogs], groupIndex) => {
          let dateLabel = date;
          try {
            dateLabel = format(parseISO(date), "EEE · d MMM yyyy");
          } catch {
            /* keep raw */
          }
          return (
            <View key={date} style={{ marginBottom: spacing.lg }}>
              <AppText variant="label" style={{ marginBottom: spacing.sm }}>
                {dateLabel.toUpperCase()}
              </AppText>
              {dayLogs.map((log, i) => (
                <FadeInItem key={log.id} index={groupIndex * 10 + i}>
                  <Card style={{ marginBottom: spacing.sm }}>
                    <AppText variant="subtitle">{log.exerciseName}</AppText>
                    <AppText variant="caption" style={{ marginTop: 4 }}>
                      {setsSummary(log.sets)}
                    </AppText>
                    {log.notes ? (
                      <AppText variant="caption" color={colors.textMuted} style={{ marginTop: 4 }}>
                        {log.notes}
                      </AppText>
                    ) : null}
                    <View style={{ flexDirection: "row", gap: 8, marginTop: spacing.sm }}>
                      <Button
                        title="Edit"
                        style={{ flex: 1 }}
                        onPress={() =>
                          navigation.navigate("WorkoutLogger", {
                            exerciseId: log.exerciseId,
                            logId: log.id,
                          })
                        }
                      />
                      <Button
                        title="Delete"
                        variant="secondary"
                        style={{ flex: 1 }}
                        onPress={() => confirmDelete(log)}
                      />
                    </View>
                  </Card>
                </FadeInItem>
              ))}
            </View>
          );
        })
      )}
    </Screen>
  );
}
