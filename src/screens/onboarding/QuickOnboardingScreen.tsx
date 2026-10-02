import React, { useState } from "react";
import { View } from "react-native";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Button } from "../../components/Button";
import { Chip } from "../../components/Inputs";
import { useAppStore } from "../../store/appStore";
import { spacing } from "../../theme";
import type { Equipment, FitnessLevel, Goal, Limitation } from "../../types";

const LEVELS: FitnessLevel[] = ["beginner", "intermediate", "advanced"];
const GOALS: Goal[] = ["general", "muscle", "strength", "fat_loss"];
const EQUIP: Equipment[] = [
  "bodyweight",
  "dumbbell",
  "barbell",
  "band",
  "machine",
  "cable",
  "kettlebell",
  "bench",
  "pullup_bar",
];
const LIMITS: Limitation[] = [
  "knee_sensitive",
  "shoulder_sensitive",
  "lower_back_sensitive",
  "wrist_sensitive",
];

export function QuickOnboardingScreen() {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [level, setLevel] = useState<FitnessLevel>("beginner");
  const [goals, setGoals] = useState<Goal[]>(["general"]);
  const [equipment, setEquipment] = useState<Equipment[]>(["bodyweight", "dumbbell"]);
  const [limitations, setLimitations] = useState<Limitation[]>([]);

  const toggle = <T,>(list: T[], item: T, setter: (v: T[]) => void) => {
    setter(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  return (
    <Screen scroll>
      <AppText variant="label">2-MINUTE SETUP</AppText>
      <AppText variant="title" style={{ marginVertical: spacing.sm }}>
        Tell us how you train
      </AppText>
      <AppText style={{ marginBottom: spacing.lg }}>
        Fast onboarding — then jump straight into your first lesson or class.
      </AppText>

      <AppText variant="label">LEVEL</AppText>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: spacing.sm }}>
        {LEVELS.map((l) => (
          <Chip key={l} label={l} selected={level === l} onPress={() => setLevel(l)} />
        ))}
      </View>

      <AppText variant="label">GOALS</AppText>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: spacing.sm }}>
        {GOALS.map((g) => (
          <Chip
            key={g}
            label={g.replace("_", " ")}
            selected={goals.includes(g)}
            onPress={() => toggle(goals, g, setGoals)}
          />
        ))}
      </View>

      <AppText variant="label">EQUIPMENT YOU HAVE</AppText>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: spacing.sm }}>
        {EQUIP.map((e) => (
          <Chip
            key={e}
            label={e.replace("_", " ")}
            selected={equipment.includes(e)}
            onPress={() => toggle(equipment, e, setEquipment)}
          />
        ))}
      </View>

      <AppText variant="label">LIMITATIONS (OPTIONAL)</AppText>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: spacing.sm }}>
        {LIMITS.map((l) => (
          <Chip
            key={l}
            label={l.replace("_", " ")}
            selected={limitations.includes(l)}
            onPress={() => toggle(limitations, l, setLimitations)}
          />
        ))}
      </View>

      <Button
        title="Continue to assessment"
        onPress={() =>
          completeOnboarding({
            level,
            goals: goals.length ? goals : ["general"],
            equipmentPreferences: equipment.length ? equipment : ["bodyweight"],
            limitations,
          })
        }
        style={{ marginTop: spacing.lg }}
      />
    </Screen>
  );
}
