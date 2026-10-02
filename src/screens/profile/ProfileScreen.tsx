import React, { useMemo } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import QRCode from "react-native-qrcode-svg";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { MuscleHeatmap } from "../../components/RestTimer";
import { Chip } from "../../components/Inputs";
import { useAppStore } from "../../store/appStore";
import { colors, spacing } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";
import type { Equipment, Limitation } from "../../types";
import { APP_TAGLINE } from "../../brand";
import { BrandLogo } from "../../components/BrandLogo";
import { FormStreakBanner } from "../../components/engagement/CueOfDay";
import { FadeInHeader } from "../../components/motion";
import { CapacityRing } from "../../components/charts/VisualMeter";

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

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const prs = useAppStore((s) => s.personalRecords);
  const logs = useAppStore((s) => s.workoutLogs);
  const code = useAppStore((s) => s.getCheckInCode)();

  const heatmap = useMemo(() => {
    const map: Record<string, number> = {
      Chest: 0,
      Back: 0,
      Legs: 0,
      Shoulders: 0,
      Core: 0,
      Arms: 0,
    };
    logs.slice(0, 20).forEach((l) => {
      const n = l.exerciseName.toLowerCase();
      if (n.includes("squat") || n.includes("lunge")) map.Legs += 1;
      else if (n.includes("row") || n.includes("pull")) map.Back += 1;
      else if (n.includes("bench") || n.includes("push")) map.Chest += 1;
      else if (n.includes("press") || n.includes("ohp")) map.Shoulders += 1;
      else if (n.includes("dead") || n.includes("bug") || n.includes("core")) map.Core += 1;
      else map.Arms += 1;
    });
    return Object.entries(map).map(([muscle, score]) => ({
      muscle,
      score: Math.min(5, score),
    }));
  }, [logs]);

  if (!user) return null;

  const toggleEquip = (e: Equipment) => {
    const has = user.equipmentPreferences.includes(e);
    updateProfile({
      equipmentPreferences: has
        ? user.equipmentPreferences.filter((x) => x !== e)
        : [...user.equipmentPreferences, e],
    });
  };

  const toggleLimit = (l: Limitation) => {
    const has = user.limitations.includes(l);
    updateProfile({
      limitations: has
        ? user.limitations.filter((x) => x !== l)
        : [...user.limitations, l],
    });
  };

  return (
    <Screen scroll>
      <FadeInHeader>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <BrandLogo variant="header" />
          <View style={{ flex: 1 }}>
            <AppText variant="title">Profile</AppText>
            <AppText variant="caption" color={colors.accent}>
              {APP_TAGLINE}
            </AppText>
          </View>
          <CapacityRing
            progress={Math.min(1, (user.formUnderstood?.length || 0) / 20)}
            size={44}
            label={`${user.formUnderstood?.length || 0}`}
          />
        </View>
      </FadeInHeader>

      <FormStreakBanner
        streak={user.formStreak || 0}
        understoodCount={user.formUnderstood?.length || 0}
      />

      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: colors.accent,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppText variant="title" color={colors.accentInk}>
            {user.initials}
          </AppText>
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="title">
            {user.firstName} {user.lastName}
          </AppText>
          <AppText variant="caption">
            {user.role} · {user.level} · {user.membershipStatus}
          </AppText>
        </View>
      </View>

      <Card style={{ marginTop: spacing.lg, alignItems: "center" }}>
        <AppText variant="label" style={{ marginBottom: spacing.sm }}>
          QR CHECK-IN
        </AppText>
        <QRCode value={code} size={160} backgroundColor={colors.surface} color={colors.text} />
        <AppText variant="caption" style={{ marginTop: spacing.sm }}>
          {code}
        </AppText>
      </Card>

      <View style={{ marginTop: spacing.lg }}>
        <MuscleHeatmap scores={heatmap} />
      </View>

      <AppText variant="label" style={{ marginTop: spacing.lg }}>
        PERSONAL RECORDS
      </AppText>
      {!prs.length ? (
        <AppText variant="caption">Log workouts to unlock PRs</AppText>
      ) : (
        prs.map((p) => (
          <Card key={p.exerciseId} style={{ marginTop: spacing.sm }}>
            <AppText variant="subtitle">{p.exerciseName}</AppText>
            <AppText variant="caption">
              {p.weight}kg × {p.reps} · {p.date}
            </AppText>
          </Card>
        ))
      )}

      <AppText variant="label" style={{ marginTop: spacing.lg }}>
        MY EQUIPMENT
      </AppText>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: spacing.sm }}>
        {EQUIP.map((e) => (
          <Chip
            key={e}
            label={e.replace("_", " ")}
            selected={user.equipmentPreferences.includes(e)}
            onPress={() => toggleEquip(e)}
          />
        ))}
      </View>

      <AppText variant="label" style={{ marginTop: spacing.md }}>
        LIMITATIONS
      </AppText>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: spacing.sm }}>
        {LIMITS.map((l) => (
          <Chip
            key={l}
            label={l.replace("_", " ")}
            selected={user.limitations.includes(l)}
            onPress={() => toggleLimit(l)}
          />
        ))}
      </View>

      <Button
        title="Gym info hub"
        variant="secondary"
        style={{ marginTop: spacing.lg }}
        onPress={() => navigation.navigate("GymHub")}
      />
      <Button title="Sign out" variant="danger" style={{ marginTop: spacing.sm }} onPress={logout} />
    </Screen>
  );
}
