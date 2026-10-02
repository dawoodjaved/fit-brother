import React, { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { Chip, TextField } from "../../components/Inputs";
import { Button } from "../../components/Button";
import { BodyMap } from "../../components/BodyMap";
import { FadeInHeader, FadeInItem } from "../../components/motion";
import { CueOfDayCard, FormStreakBanner } from "../../components/engagement/CueOfDay";
import { APP_TAGLINE } from "../../brand";
import { BrandLogo } from "../../components/BrandLogo";
import { exercises, learningPaths, jargonGlossary } from "../../data/seed";
import { useAppStore } from "../../store/appStore";
import { colors, spacing } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";
import type { FitnessLevel, MovementPattern } from "../../types";
import { PatternIcon } from "../../components/icons/PatternIcon";
import { CapacityRing, ProgressBar } from "../../components/charts/VisualMeter";
import { cueOfTheDay } from "../../utils/engagement";
import { academySuggestionFromFeel } from "../../utils/regions";

const PATTERNS: (MovementPattern | "all")[] = [
  "all",
  "squat",
  "hinge",
  "push",
  "pull",
  "lunge",
  "core",
  "mobility",
];

const PAGE = 24;

export function AcademyHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAppStore((s) => s.user);
  const bookings = useAppStore((s) => s.bookings);
  const classes = useAppStore((s) => s.classes);
  const [muscle, setMuscle] = useState<string | null>(null);
  const [pattern, setPattern] = useState<(typeof PATTERNS)[number]>("all");
  const [level, setLevel] = useState<FitnessLevel | "all">("all");
  const [showGlossary, setShowGlossary] = useState(false);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE);

  const feelSuggestion = useMemo(
    () => academySuggestionFromFeel(user?.formFeelByBooking, bookings, classes),
    [user?.formFeelByBooking, bookings, classes]
  );

  const cueEx = useMemo(() => {
    const cue = cueOfTheDay();
    return (
      exercises.find((e) => e.jargonTerms?.includes(cue.term)) || exercises[0]
    );
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter((e) => {
      if (pattern !== "all" && e.pattern !== pattern) return false;
      if (level !== "all" && e.level !== level) return false;
      if (q) {
        const hay = `${e.name} ${e.muscles.primary.join(" ")} ${e.muscles.synergist.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (muscle) {
        const all = [
          ...e.muscles.primary,
          ...e.muscles.synergist,
          ...e.muscles.stabilizer,
        ].join(" ");
        const map: Record<string, string[]> = {
          Chest: ["Chest", "Pectoralis", "Serratus"],
          Back: ["Back", "Lats", "Mid Back", "Traps", "Erectors", "Rhomboid"],
          Shoulders: ["Delts", "Rear Delts", "Front Delts", "Deltoid"],
          Arms: ["Biceps", "Triceps", "Forearms"],
          Core: ["Core", "Deep Core", "Abs", "Oblique"],
          Glutes: ["Glutes"],
          Legs: [
            "Quadriceps",
            "Hamstrings",
            "Calves",
            "Adductors",
            "Hip Flexors",
            "Quads",
            "Tibialis",
          ],
        };
        const keys = map[muscle] || [muscle];
        if (!keys.some((k) => all.includes(k))) return false;
      }
      if (user?.equipmentPreferences?.length) {
        const ok = e.equipment.some(
          (eq) => user.equipmentPreferences.includes(eq) || eq === "bodyweight"
        );
        if (!ok) return false;
      }
      return true;
    });
  }, [muscle, pattern, level, user?.equipmentPreferences, query]);

  const shown = list.slice(0, visible);

  return (
    <Screen scroll>
      <FadeInHeader>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: spacing.xs }}>
          <BrandLogo variant="header" />
          <View style={{ flex: 1 }}>
            <AppText variant="title">Academy</AppText>
            <AppText variant="caption" color={colors.accent}>
              {APP_TAGLINE}
            </AppText>
          </View>
        </View>
        <AppText style={{ marginBottom: spacing.sm }}>
          {exercises.length}+ FitBrother guided moves — looping form scans, muscles hit, and cues from first squat to advanced lifts.
        </AppText>
      </FadeInHeader>

      <FormStreakBanner
        streak={user?.formStreak || 0}
        understoodCount={user?.formUnderstood?.length || 0}
      />

      <CueOfDayCard
        onPress={() => {
          if (cueEx) {
            navigation.navigate("ExerciseDetail", { exerciseId: cueEx.id });
          }
        }}
      />

      {feelSuggestion ? (
        <Card style={{ marginBottom: spacing.md, borderColor: colors.accent }}>
          <AppText variant="label">FOR YOU</AppText>
          <AppText variant="subtitle" style={{ marginTop: 6 }}>
            {feelSuggestion.title}
          </AppText>
          {feelSuggestion.exerciseIds.map((id) => {
            const ex = exercises.find((e) => e.id === id);
            if (!ex) return null;
            return (
              <Pressable
                key={id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 10,
                }}
                onPress={() => navigation.navigate("ExerciseDetail", { exerciseId: id })}
              >
                <PatternIcon pattern={ex.pattern} size={22} />
                <AppText style={{ flex: 1 }}>{ex.name}</AppText>
              </Pressable>
            );
          })}
        </Card>
      ) : null}

      <TextField
        label="Search"
        placeholder="Squat, row, plank…"
        value={query}
        onChangeText={(t) => {
          setQuery(t);
          setVisible(PAGE);
        }}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Pressable onPress={() => setShowGlossary((v) => !v)}>
        <Card index={0}>
          <AppText variant="subtitle" color={colors.accent}>
            Jargon glossary {showGlossary ? "▾" : "▸"}
          </AppText>
          {showGlossary
            ? jargonGlossary.map((j) => (
                <View key={j.term} style={{ marginTop: 8 }}>
                  <AppText color={colors.text}>{j.term}</AppText>
                  <AppText variant="caption">{j.definition}</AppText>
                </View>
              ))
            : (
              <AppText variant="caption">Tap to decode RPE, hinge, tempo…</AppText>
            )}
        </Card>
      </Pressable>

      <AppText variant="label" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
        LEARNING PATHS
      </AppText>
      {learningPaths.map((p, i) => {
        const done = user?.pathProgress?.[p.id] || 0;
        const pct = Math.round((done / p.exerciseIds.length) * 100);
        return (
          <Pressable
            key={p.id}
            onPress={() => navigation.navigate("PathDetail", { pathId: p.id })}
          >
            <Card index={i + 1} style={{ marginBottom: spacing.sm }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <CapacityRing
                  progress={done / p.exerciseIds.length}
                  label={`${pct}`}
                  size={48}
                />
                <View style={{ flex: 1 }}>
                  <AppText variant="subtitle">{p.title}</AppText>
                  <AppText variant="caption">{p.level}</AppText>
                  <ProgressBar
                    progress={done / p.exerciseIds.length}
                    height={5}
                  />
                </View>
              </View>
            </Card>
          </Pressable>
        );
      })}

      <BodyMap
        selected={muscle}
        onSelect={(m) => {
          setMuscle(m);
          setVisible(PAGE);
        }}
        onTrainRegion={(r) => navigation.navigate("RegionTrain", { region: r })}
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {PATTERNS.map((p) => (
          <Chip
            key={p}
            label={p}
            selected={pattern === p}
            onPress={() => { setPattern(p); setVisible(PAGE); }}
          />
        ))}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: spacing.sm }}>
        {(["all", "beginner", "intermediate", "advanced"] as const).map((l) => (
          <Chip
            key={l}
            label={l}
            selected={level === l}
            onPress={() => { setLevel(l); setVisible(PAGE); }}
          />
        ))}
      </View>

      <AppText variant="caption" style={{ marginBottom: spacing.sm }}>
        Showing {shown.length} of {list.length} matches
      </AppText>

      {shown.map((e, i) => (
        <Pressable
          key={e.id}
          onPress={() => navigation.navigate("ExerciseDetail", { exerciseId: e.id })}
        >
          <Card
            index={i % PAGE}
            style={{
              marginBottom: spacing.sm,
              borderLeftWidth: 4,
              borderLeftColor: e.thumbnailColor,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <PatternIcon pattern={e.pattern} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <AppText variant="subtitle" style={{ flex: 1, paddingRight: 8 }}>
                    {e.name}
                  </AppText>
                  <AppText variant="caption" color={colors.accent}>
                    {e.level}
                  </AppText>
                </View>
                <AppText variant="caption">
                  {e.muscles.primary.slice(0, 2).join(", ")}
                </AppText>
              </View>
            </View>
          </Card>
        </Pressable>
      ))}

      {visible < list.length ? (
        <Button
          title={`Load more (${list.length - visible} left)`}
          variant="secondary"
          style={{ marginTop: spacing.sm }}
          onPress={() => setVisible((v) => v + PAGE)}
        />
      ) : null}
    </Screen>
  );
}
