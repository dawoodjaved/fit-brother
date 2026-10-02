import React, { useMemo } from "react";
import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { PatternIcon } from "../../components/icons/PatternIcon";
import { BrandLogo } from "../../components/BrandLogo";
import { ProgressBar } from "../../components/charts/VisualMeter";
import { useAppStore } from "../../store/appStore";
import { colors, spacing } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";
import { miniPathForRegion } from "../../utils/regions";
import { notify } from "../../utils/notify";

type Props = NativeStackScreenProps<RootStackParamList, "RegionTrain">;

/** ~10 min mini-path: 2 GIF form guides + logger for a Body Map region. */
export function RegionTrainScreen({ route, navigation }: Props) {
  const { region } = route.params;
  const setSessionExercises = useAppStore((s) => s.setSessionExercises);
  const pair = useMemo(() => miniPathForRegion(region), [region]);

  return (
    <Screen scroll>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: spacing.sm }}>
        <BrandLogo variant="header" />
        <View style={{ flex: 1 }}>
          <AppText variant="label">TRAIN THIS REGION</AppText>
          <AppText variant="title" style={{ marginTop: 4 }}>
            {region} · ~10 min
          </AppText>
        </View>
      </View>
      <ProgressBar progress={pair.length ? 0.15 : 0} height={5} />
      <AppText variant="caption" style={{ marginVertical: spacing.md }}>
        Two form GIFs, then log.
      </AppText>

      {!pair.length ? (
        <AppText>No exercises matched this region yet.</AppText>
      ) : (
        pair.map((e, i) => (
          <Card
            key={e.id}
            style={{
              marginBottom: spacing.md,
              borderColor: colors.border,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <PatternIcon pattern={e.pattern} size={28} />
              <View style={{ flex: 1 }}>
                <AppText variant="label">STEP {i + 1}</AppText>
                <AppText variant="subtitle" style={{ marginTop: 4 }}>
                  {e.name}
                </AppText>
                <AppText variant="caption" style={{ marginTop: 2 }}>
                  {e.muscles.primary.slice(0, 2).join(", ")}
                </AppText>
              </View>
            </View>
            <Button
              title="GIF form guide"
              variant="secondary"
              style={{ marginTop: spacing.sm }}
              onPress={() =>
                navigation.navigate("ExerciseDetail", { exerciseId: e.id })
              }
            />
            <Button
              title="Log sets"
              style={{ marginTop: spacing.sm }}
              onPress={() =>
                navigation.navigate("WorkoutLogger", { exerciseId: e.id })
              }
            />
          </Card>
        ))
      )}

      {pair.length >= 2 ? (
        <Button
          title="Build session + start"
          onPress={() => {
            const ids = pair.map((e) => e.id);
            setSessionExercises(ids);
            notify("Region session", `${region} session loaded.`);
            navigation.navigate("WorkoutLogger", {
              exerciseId: ids[0]!,
              sessionIds: ids,
            });
          }}
        />
      ) : null}
    </Screen>
  );
}
