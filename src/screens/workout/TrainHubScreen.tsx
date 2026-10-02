import React, { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { BodyMap } from "../../components/BodyMap";
import { FadeInHeader, FadeInItem, PopIn } from "../../components/motion";
import { FormStreakBanner } from "../../components/engagement/CueOfDay";
import { exercises, learningPaths } from "../../data/seed";
import { useAppStore } from "../../store/appStore";
import { colors, spacing } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";
import { groupFavoritesByMuscle } from "../../utils/regions";
import { notify } from "../../utils/notify";
import { PatternIcon } from "../../components/icons/PatternIcon";
import { BrandLogo } from "../../components/BrandLogo";
import { ProgressBar } from "../../components/charts/VisualMeter";
import { APP_TAGLINE } from "../../brand";

export function TrainHubScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAppStore((s) => s.user);
  const toggleSessionExercise = useAppStore((s) => s.toggleSessionExercise);
  const setSessionExercises = useAppStore((s) => s.setSessionExercises);
  const clearSession = useAppStore((s) => s.clearSession);
  const [region, setRegion] = useState<string | null>(null);

  const favorites = user?.favorites || [];
  const sessionIds = user?.sessionExerciseIds || [];
  const byMuscle = useMemo(() => groupFavoritesByMuscle(favorites), [favorites]);
  const sessionExercises = exercises.filter((e) => sessionIds.includes(e.id));

  const activePath = learningPaths.find(
    (p) => p.id === (user?.activePathId || "path-foundations")
  );
  const pathSuggestions = (activePath?.exerciseIds || [])
    .filter((id) => !user?.completedLessons?.includes(id))
    .slice(0, 4)
    .map((id) => exercises.find((e) => e.id === id))
    .filter(Boolean);

  const startSession = () => {
    if (sessionIds.length < 1) {
      notify("Add moves", "Pick 3–5 exercises for today’s session.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    navigation.navigate("WorkoutLogger", {
      exerciseId: sessionIds[0]!,
      sessionIds,
    });
  };

  return (
    <Screen scroll>
      <FadeInHeader>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <BrandLogo variant="header" />
          <View style={{ flex: 1 }}>
            <AppText variant="label">FITBROTHER TRAIN</AppText>
            <AppText variant="title" style={{ marginTop: 4 }}>
              Session builder
            </AppText>
            <AppText variant="caption" color={colors.accent} style={{ marginTop: 2 }}>
              {APP_TAGLINE}
            </AppText>
          </View>
        </View>
        <AppText style={{ marginVertical: spacing.md }}>
          Stack 3–5 form-first moves · favorites by muscle · Body Map mini-paths.
        </AppText>
      </FadeInHeader>

      <FormStreakBanner
        streak={user?.formStreak || 0}
        understoodCount={user?.formUnderstood?.length || 0}
      />

      <PopIn>
        <Card style={{ marginBottom: spacing.md, borderColor: colors.accentDim }}>
          <AppText variant="label">
            TODAY’S SESSION · {sessionIds.length}/5
          </AppText>
          <ProgressBar progress={sessionIds.length / 5} height={6} />
          {!sessionExercises.length ? (
            <AppText variant="caption" style={{ marginTop: 6 }}>
              Add from favorites, path picks, or Academy.
            </AppText>
          ) : (
            sessionExercises.map((e) => (
              <View
                key={e.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 10,
                  gap: 8,
                }}
              >
                <PatternIcon pattern={e.pattern} size={24} />
                <AppText style={{ flex: 1 }} color={colors.text}>
                  {e.name}
                </AppText>
                <Button
                  title="−"
                  variant="ghost"
                  style={{ marginBottom: 0, minWidth: 44 }}
                  onPress={() => toggleSessionExercise(e.id)}
                />
              </View>
            ))
          )}
          <View style={{ flexDirection: "row", gap: 8, marginTop: spacing.md }}>
            <Button
              title="Start session"
              style={{ flex: 1 }}
              onPress={startSession}
            />
            {sessionIds.length ? (
              <Button title="Clear" variant="secondary" onPress={clearSession} />
            ) : null}
          </View>
        </Card>
      </PopIn>

      <AppText variant="label" style={{ marginBottom: spacing.sm }}>
        BODY MAP → TRAIN REGION
      </AppText>
      <BodyMap
        selected={region}
        onSelect={setRegion}
        onTrainRegion={(r) => navigation.navigate("RegionTrain", { region: r })}
      />

      {pathSuggestions.length ? (
        <>
          <AppText variant="label" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
            FROM {activePath?.title?.toUpperCase() || "PATH"}
          </AppText>
          {pathSuggestions.map((e, i) =>
            e ? (
              <FadeInItem key={e.id} index={i}>
                <Card style={{ marginBottom: spacing.sm }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <PatternIcon pattern={e.pattern} size={24} />
                    <AppText variant="subtitle" style={{ flex: 1 }}>
                      {e.name}
                    </AppText>
                  </View>
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                    <Button
                      title={sessionIds.includes(e.id) ? "In session" : "Add"}
                      variant="secondary"
                      style={{ flex: 1 }}
                      onPress={() => toggleSessionExercise(e.id)}
                    />
                    <Button
                      title="Form"
                      variant="ghost"
                      style={{ flex: 1 }}
                      onPress={() =>
                        navigation.navigate("ExerciseDetail", {
                          exerciseId: e.id,
                          pathId: activePath?.id,
                        })
                      }
                    />
                  </View>
                </Card>
              </FadeInItem>
            ) : null
          )}
        </>
      ) : null}

      <AppText variant="label" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
        FAVORITES BY MUSCLE
      </AppText>
      {!favorites.length ? (
        <Card>
          <AppText>No favorites yet</AppText>
          <Button
            title="Browse Academy"
            variant="secondary"
            style={{ marginTop: spacing.sm }}
            onPress={() => navigation.navigate("MainTabs", { screen: "Academy" })}
          />
        </Card>
      ) : (
        Object.entries(byMuscle).map(([folder, list]) => (
          <Card key={folder} style={{ marginBottom: spacing.sm }}>
            <AppText variant="subtitle" color={colors.accent}>
              {folder}
            </AppText>
            {list.map((e) => (
              <Pressable
                key={e.id}
                onPress={() => toggleSessionExercise(e.id)}
                style={{ marginTop: 10 }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <PatternIcon
                    pattern={e.pattern}
                    size={24}
                    active={sessionIds.includes(e.id)}
                  />
                  <AppText color={colors.text} style={{ flex: 1 }}>
                    {e.name}
                  </AppText>
                </View>
                <View style={{ flexDirection: "row", gap: 8, marginTop: 6 }}>
                  <Button
                    title="Log"
                    variant="ghost"
                    style={{ flex: 1 }}
                    onPress={() =>
                      navigation.navigate("WorkoutLogger", { exerciseId: e.id })
                    }
                  />
                  <Button
                    title="Form guide"
                    variant="secondary"
                    style={{ flex: 1 }}
                    onPress={() =>
                      navigation.navigate("ExerciseDetail", { exerciseId: e.id })
                    }
                  />
                </View>
              </Pressable>
            ))}
          </Card>
        ))
      )}

      {!sessionIds.length && favorites.length >= 3 ? (
        <Button
          title="Quick session from top favorites"
          variant="secondary"
          style={{ marginTop: spacing.md }}
          onPress={() => {
            setSessionExercises(favorites.slice(0, 5));
            notify("Session ready", "Start when you’re set.");
          }}
        />
      ) : null}
    </Screen>
  );
}
