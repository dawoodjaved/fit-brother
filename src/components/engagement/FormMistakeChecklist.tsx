import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { AppText } from "../AppText";
import { Card } from "../Card";
import { Button } from "../Button";
import type { CommonMistake, ViewAngle } from "../../types";
import { colors, radii, spacing } from "../../theme";

const ANGLE_TIP: Record<ViewAngle, string> = {
  front: "Film or watch from the FRONT — knees, feet, and shoulder line show clearly.",
  side: "Film or watch from the SIDE — hip hinge, spine, and depth show clearly.",
  rear: "Film or watch from the BACK — scapula, hip shift, and foot flare show clearly.",
};

type CheckState = Record<string, "yes" | "no" | null>;

/** Interactive mistake checklist + angle coach for form learning. */
export function FormMistakeChecklist({
  mistakes,
  onAllClear,
}: {
  mistakes: CommonMistake[];
  onAllClear?: () => void;
}) {
  const [checks, setChecks] = useState<CheckState>({});

  const primaryAngle = useMemo(() => {
    const counts: Record<string, number> = {};
    mistakes.forEach((m) => {
      counts[m.visibleFromAngle] = (counts[m.visibleFromAngle] || 0) + 1;
    });
    const best = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || [
      "side",
      0,
    ]) as [ViewAngle, number];
    return best[0];
  }, [mistakes]);

  const answered = mistakes.filter((m) => checks[m.title] != null).length;
  const clean = mistakes.every((m) => checks[m.title] === "no");
  const done = answered === mistakes.length && mistakes.length > 0;

  if (!mistakes.length) return null;

  return (
    <View style={{ marginTop: spacing.lg }}>
      <Animated.View entering={FadeInDown.duration(320)}>
        <Card style={styles.angleCard}>
          <AppText variant="label">ANGLE COACH</AppText>
          <AppText style={{ marginTop: 6 }}>{ANGLE_TIP[primaryAngle]}</AppText>
        </Card>
      </Animated.View>

      <AppText variant="label" style={{ marginTop: spacing.md }}>
        WHAT AM I DOING WRONG?
      </AppText>
      <AppText variant="caption" style={{ marginBottom: spacing.sm }}>
        Watch the GIF, then tap Yes / No for each check ({answered}/{mistakes.length})
      </AppText>

      {mistakes.map((m, i) => {
        const val = checks[m.title];
        return (
          <Animated.View key={m.title} entering={FadeInDown.delay(i * 60).duration(280)}>
            <Card style={{ marginBottom: spacing.sm }}>
              <AppText variant="subtitle">{m.title}</AppText>
              <AppText variant="caption" color={colors.accent} style={{ marginTop: 4 }}>
                Spot from {m.visibleFromAngle} · {m.fix}
              </AppText>
              <View style={styles.row}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Yes I see ${m.title}`}
                  onPress={() => setChecks((c) => ({ ...c, [m.title]: "yes" }))}
                  style={[styles.chip, val === "yes" && styles.chipBad]}
                >
                  <AppText
                    variant="caption"
                    color={val === "yes" ? colors.accentInk : colors.textSecondary}
                  >
                    Yes — I see it
                  </AppText>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`No form looks good for ${m.title}`}
                  onPress={() => setChecks((c) => ({ ...c, [m.title]: "no" }))}
                  style={[styles.chip, val === "no" && styles.chipGood]}
                >
                  <AppText
                    variant="caption"
                    color={val === "no" ? colors.accentInk : colors.textSecondary}
                  >
                    No — form looks good
                  </AppText>
                </Pressable>
              </View>
              {val === "yes" ? (
                <AppText style={{ marginTop: spacing.sm }}>Fix: {m.fix}</AppText>
              ) : null}
            </Card>
          </Animated.View>
        );
      })}

      {done ? (
        <Animated.View entering={ZoomIn.duration(280)}>
          <Card style={styles.result}>
            <AppText variant="subtitle" color={colors.accent}>
              {clean ? "Form check clear" : "You’ve spotted issues — great awareness"}
            </AppText>
            <AppText variant="caption" style={{ marginTop: 4 }}>
              {clean
                ? "Mark this form as understood to grow your FitBrother streak."
                : "Replay the GIF from the angle above and fix one cue at a time."}
            </AppText>
            {clean && onAllClear ? (
              <Button
                title="I understand this form"
                style={{ marginTop: spacing.sm }}
                onPress={onAllClear}
              />
            ) : null}
          </Card>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  angleCard: {
    borderColor: colors.accentDim,
    backgroundColor: colors.bgElevated,
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: spacing.sm },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  chipGood: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipBad: { backgroundColor: colors.warning, borderColor: colors.warning },
  result: { marginTop: spacing.sm, borderColor: colors.accent },
});
