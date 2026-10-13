import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { Chip, TextField } from "../../components/Inputs";
import { Button } from "../../components/Button";
import { BodyMap } from "../../components/BodyMap";
import { FadeInHeader } from "../../components/motion";
import { CueOfDayCard, FormStreakBanner } from "../../components/engagement/CueOfDay";
import { APP_TAGLINE } from "../../brand";
import { BrandLogo } from "../../components/BrandLogo";
import { exerciseById, exercises, learningPaths, jargonGlossary } from "../../data/seed";
import { useAppStore } from "../../store/appStore";
import { colors, spacing } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";
import type { Exercise, FitnessLevel, MovementPattern } from "../../types";
import { PatternIcon } from "../../components/icons/PatternIcon";
import { CapacityRing, ProgressBar } from "../../components/charts/VisualMeter";
import { cueOfTheDay } from "../../utils/engagement";
import { academySuggestionFromFeel } from "../../utils/regions";
import { useLayout } from "../../utils/layout";

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

const REGION_KEYS: Record<string, string[]> = {
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

function ExerciseRow({
  exercise,
  onPress,
}: {
  exercise: Exercise;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Card
        style={{
          marginBottom: spacing.sm,
          borderLeftWidth: 4,
          borderLeftColor: exercise.thumbnailColor,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <PatternIcon pattern={exercise.pattern} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <AppText variant="subtitle" style={{ flex: 1, paddingRight: 8 }}>
                {exercise.name}
              </AppText>
              <AppText variant="caption" color={colors.accent}>
                {exercise.level}
              </AppText>
            </View>
            <AppText variant="caption">
              {exercise.muscles.primary.slice(0, 2).join(", ")}
            </AppText>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

export function AcademyHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { contentPad } = useLayout();
  const equipmentPreferences = useAppStore((s) => s.user?.equipmentPreferences);
  const formStreak = useAppStore((s) => s.user?.formStreak || 0);
  const formUnderstoodCount = useAppStore((s) => s.user?.formUnderstood?.length || 0);
  const formFeelByBooking = useAppStore((s) => s.user?.formFeelByBooking);
  const pathProgress = useAppStore((s) => s.user?.pathProgress);
  const bookings = useAppStore((s) => s.bookings);
  const classes = useAppStore((s) => s.classes);
  const [muscle, setMuscle] = useState<string | null>(null);
  const [pattern, setPattern] = useState<(typeof PATTERNS)[number]>("all");
  const [level, setLevel] = useState<FitnessLevel | "all">("all");
  const [showGlossary, setShowGlossary] = useState(false);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE);

  const feelSuggestion = useMemo(
    () => academySuggestionFromFeel(formFeelByBooking, bookings, classes),
    [formFeelByBooking, bookings, classes]
  );

  const cueEx = useMemo(() => {
    const cue = cueOfTheDay();
    return (
      exercises.find((e) => e.jargonTerms?.includes(cue.term)) || exercises[0]
    );
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
    return exercises.filter((e) => {
      if (pattern !== "all" && e.pattern !== pattern) return false;
      if (level !== "all" && e.level !== level) return false;
      if (tokens.length) {
        const hay = `${e.name} ${e.muscles.primary.join(" ")} ${e.muscles.synergist.join(" ")}`.toLowerCase();
        // Every token must match as a word/prefix (avoids "row" matching "throw")
        const words = hay.split(/[^a-z0-9]+/).filter(Boolean);
        if (!tokens.every((t) => words.some((w) => w.startsWith(t) || w.includes(t) && t.length >= 4))) {
          return false;
        }
      }
      if (muscle) {
        const all = [
          ...e.muscles.primary,
          ...e.muscles.synergist,
          ...e.muscles.stabilizer,
        ].join(" ");
        const keys = REGION_KEYS[muscle] || [muscle];
        if (!keys.some((k) => all.includes(k))) return false;
      }
      // When searching by name, show the full catalog — equipment prefs are browse-only.
      if (!tokens.length && equipmentPreferences?.length) {
        const ok = e.equipment.some(
          (eq) => equipmentPreferences.includes(eq) || eq === "bodyweight"
        );
        if (!ok) return false;
      }
      return true;
    });
  }, [muscle, pattern, level, equipmentPreferences, query]);

  const shown = useMemo(() => list.slice(0, visible), [list, visible]);

  const openExercise = useCallback(
    (id: string) => navigation.navigate("ExerciseDetail", { exerciseId: id }),
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Exercise }) => (
      <ExerciseRow exercise={item} onPress={() => openExercise(item.id)} />
    ),
    [openExercise]
  );

  const keyExtractor = useCallback((item: Exercise) => item.id, []);

  const header = (
    <View>
      <FadeInHeader>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: spacing.xs,
          }}
        >
          <BrandLogo variant="header" />
          <View style={{ flex: 1 }}>
            <AppText variant="title">Academy</AppText>
            <AppText variant="caption" color={colors.accent}>
              {APP_TAGLINE}
            </AppText>
          </View>
        </View>
        <AppText style={{ marginBottom: spacing.sm }}>
          {exercises.length}+ FitBrother guided moves — looping form scans, muscles hit, and cues
          from first squat to advanced lifts.
        </AppText>
      </FadeInHeader>

      <FormStreakBanner streak={formStreak} understoodCount={formUnderstoodCount} />

      <CueOfDayCard
        onPress={() => {
          if (cueEx) openExercise(cueEx.id);
        }}
      />

      {feelSuggestion ? (
        <Card style={{ marginBottom: spacing.md, borderColor: colors.accent }}>
          <AppText variant="label">FOR YOU</AppText>
          <AppText variant="subtitle" style={{ marginTop: 6 }}>
            {feelSuggestion.title}
          </AppText>
          {feelSuggestion.exerciseIds.map((id) => {
            const ex = exerciseById[id];
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
                onPress={() => openExercise(id)}
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
        <Card>
          <AppText variant="subtitle" color={colors.accent}>
            Jargon glossary {showGlossary ? "▾" : "▸"}
          </AppText>
          {showGlossary ? (
            jargonGlossary.map((j) => (
              <View key={j.term} style={{ marginTop: 8 }}>
                <AppText color={colors.text}>{j.term}</AppText>
                <AppText variant="caption">{j.definition}</AppText>
              </View>
            ))
          ) : (
            <AppText variant="caption">Tap to decode RPE, hinge, tempo…</AppText>
          )}
        </Card>
      </Pressable>

      <AppText variant="label" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
        LEARNING PATHS
      </AppText>
      {learningPaths.map((p) => {
        const done = pathProgress?.[p.id] || 0;
        const pct = Math.round((done / p.exerciseIds.length) * 100);
        return (
          <Pressable
            key={p.id}
            onPress={() => navigation.navigate("PathDetail", { pathId: p.id })}
          >
            <Card style={{ marginBottom: spacing.sm }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <CapacityRing
                  progress={done / p.exerciseIds.length}
                  label={`${pct}`}
                  size={48}
                />
                <View style={{ flex: 1 }}>
                  <AppText variant="subtitle">{p.title}</AppText>
                  <AppText variant="caption">{p.level}</AppText>
                  <ProgressBar progress={done / p.exerciseIds.length} height={5} />
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
            onPress={() => {
              setPattern(p);
              setVisible(PAGE);
            }}
          />
        ))}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: spacing.sm }}>
        {(["all", "beginner", "intermediate", "advanced"] as const).map((l) => (
          <Chip
            key={l}
            label={l}
            selected={level === l}
            onPress={() => {
              setLevel(l);
              setVisible(PAGE);
            }}
          />
        ))}
      </View>

      <AppText variant="caption" style={{ marginBottom: spacing.sm }}>
        Showing {shown.length} of {list.length} matches
        {query.trim()
          ? " · name search (all equipment)"
          : equipmentPreferences?.length
            ? " · filtered by your equipment"
            : ""}
      </AppText>
    </View>
  );

  const footer =
    visible < list.length ? (
      <Button
        title={`Load more (${list.length - visible} left)`}
        variant="secondary"
        style={{ marginTop: spacing.sm, marginBottom: spacing.lg }}
        onPress={() => setVisible((v) => v + PAGE)}
      />
    ) : (
      <View style={{ height: spacing.lg }} />
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={shown}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerStyle={{
          paddingHorizontal: contentPad,
          paddingBottom: spacing.xxl,
        }}
        initialNumToRender={10}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
