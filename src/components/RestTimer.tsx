import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { colors, radii, spacing, typography } from "../theme";
import { AppText } from "./AppText";
import { Button } from "./Button";

export function RestTimer({
  seconds,
  why,
  onDone,
}: {
  seconds: number;
  why: string;
  onDone?: () => void;
}) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    setLeft(seconds);
    setRunning(true);
  }, [seconds]);

  useEffect(() => {
    if (!running || left <= 0) {
      if (left <= 0) onDone?.();
      return;
    }
    const id = setTimeout(() => setLeft((v) => v - 1), 1000);
    return () => clearTimeout(id);
  }, [running, left]);

  return (
    <View style={styles.wrap}>
      <AppText variant="label">REST TIMER</AppText>
      <AppText style={styles.time}>{left}s</AppText>
      <AppText variant="caption" style={{ marginBottom: spacing.md }}>
        {why}
      </AppText>
      <View style={styles.row}>
        <Button
          title={running ? "Pause" : "Resume"}
          variant="secondary"
          onPress={() => setRunning((r) => !r)}
          style={{ flex: 1 }}
        />
        <Button title="Skip" variant="ghost" onPress={() => setLeft(0)} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

export function MuscleHeatmap({
  scores,
}: {
  scores: { muscle: string; score: number }[];
}) {
  return (
    <View style={styles.heat}>
      <AppText variant="label" style={{ marginBottom: 8 }}>
        MUSCLES THIS WEEK
      </AppText>
      {scores.map((s) => (
        <View key={s.muscle} style={styles.heatRow}>
          <AppText variant="caption" style={{ width: 90 }}>
            {s.muscle}
          </AppText>
          <View style={styles.barBg}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${Math.min(100, s.score * 20)}%`,
                  backgroundColor:
                    s.score >= 4 ? colors.warning : s.score >= 2 ? colors.accent : colors.info,
                },
              ]}
            />
          </View>
          <AppText variant="caption">{s.score}/5</AppText>
        </View>
      ))}
      <AppText variant="caption" style={{ marginTop: 8 }}>
        Higher = more volume. Lower scores are typically fresher to train.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  time: {
    fontFamily: typography.display,
    fontSize: 48,
    color: colors.accent,
    marginVertical: 8,
  },
  row: { flexDirection: "row", gap: 8 },
  heat: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  heatRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.bgElevated,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: { height: 8, borderRadius: 4 },
});
