import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { format, parseISO } from "date-fns";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { Chip } from "../../components/Inputs";
import { CueOfDayCard, FormStreakBanner } from "../../components/engagement/CueOfDay";
import { FadeInHeader, FadeInItem, Pulse } from "../../components/motion";
import { CapacityRing } from "../../components/charts/VisualMeter";
import { useAppStore } from "../../store/appStore";
import { colors, spacing } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";
import { APP_TAGLINE } from "../../brand";
import { BrandLogo } from "../../components/BrandLogo";
import { cueOfTheDay } from "../../utils/engagement";
import { exercises } from "../../data/seed";

export function HomeClassesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAppStore((s) => s.user);
  const classes = useAppStore((s) => s.classes);
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(classes.map((c) => c.category))),
    [classes]
  );

  const filtered = classes.filter((c) => !category || c.category === category);

  const cueExercise = useMemo(() => {
    const cue = cueOfTheDay();
    return (
      exercises.find((e) => e.jargonTerms?.includes(cue.term)) ||
      exercises.find((e) => e.cues.some((c) => c.toLowerCase().includes(cue.term.toLowerCase()))) ||
      exercises[0]
    );
  }, []);

  return (
    <Screen scroll>
      <FadeInHeader>
        <View style={styles.headerRow}>
          <BrandLogo variant="header" />
          <View style={{ flex: 1 }}>
            <AppText variant="title">Hey {user?.firstName}</AppText>
            <AppText variant="caption" color={colors.accent} style={{ marginTop: 2 }}>
              {APP_TAGLINE}
            </AppText>
          </View>
        </View>
      </FadeInHeader>

      <FormStreakBanner
        streak={user?.formStreak || 0}
        understoodCount={user?.formUnderstood?.length || 0}
      />

      <CueOfDayCard
        onPress={() => {
          if (cueExercise) {
            navigation.navigate("ExerciseDetail", { exerciseId: cueExercise.id });
          }
        }}
      />

      <View style={styles.chips}>
        <Chip label="All" selected={!category} onPress={() => setCategory(null)} />
        {categories.map((c) => (
          <Chip
            key={c}
            label={c}
            selected={category === c}
            onPress={() => setCategory(c)}
          />
        ))}
      </View>

      {filtered.map((klass, i) => {
        const spots = Math.max(0, klass.capacity - klass.bookedCount);
        const fill = klass.bookedCount / Math.max(1, klass.capacity);
        return (
          <FadeInItem key={klass.id} index={i}>
            <Pressable
              onPress={() => navigation.navigate("ClassDetail", { classId: klass.id })}
            >
              <Card style={styles.card}>
                <View style={styles.row}>
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <AppText variant="label">{klass.category}</AppText>
                    <AppText variant="subtitle" style={{ marginTop: 6 }}>
                      {klass.title}
                    </AppText>
                    <AppText variant="caption" style={{ marginTop: 4 }}>
                      {format(parseISO(klass.date), "EEE, MMM d")} · {klass.time}
                    </AppText>
                    {klass.relatedExerciseIds.length ? (
                      <AppText variant="caption" color={colors.accent} style={{ marginTop: 6 }}>
                        {klass.relatedExerciseIds.length} form GIFs
                      </AppText>
                    ) : null}
                  </View>
                  {spots ? (
                    <CapacityRing
                      progress={1 - fill}
                      label={`${spots}`}
                      size={52}
                    />
                  ) : (
                    <Pulse active>
                      <CapacityRing
                        progress={1}
                        label="WL"
                        size={52}
                        color={colors.warning}
                      />
                    </Pulse>
                  )}
                </View>
              </Card>
            </Pressable>
          </FadeInItem>
        );
      })}

      {user?.role === "admin" ? (
        <Pressable onPress={() => navigation.navigate("AdminDashboard")}>
          <Card style={{ marginTop: spacing.md, borderColor: colors.accent }}>
            <AppText variant="subtitle" color={colors.accent}>
              Admin dashboard →
            </AppText>
          </Card>
        </Pressable>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    gap: 12,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", marginBottom: spacing.md },
  card: { marginBottom: spacing.md },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
