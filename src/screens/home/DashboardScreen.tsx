import React, { useMemo } from "react";
import { Pressable, StyleSheet, View, ScrollView, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Path } from "react-native-svg";
import { format, subDays } from "date-fns";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../../components/AppText";
import { ProgressRing } from "../../components/charts/ProgressRing";
import { WeekBars } from "../../components/charts/WeekBars";
import { GlobalExerciseSearch } from "../../components/GlobalExerciseSearch";
import { FadeInHeader, PopIn } from "../../components/motion";
import { learningPaths } from "../../data/seed";
import { useAppStore } from "../../store/appStore";
import { colors, radii, spacing, typography } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";
import { APP_TAGLINE } from "../../brand";
import { BrandLogo } from "../../components/BrandLogo";
import { cueOfTheDay } from "../../utils/engagement";

export function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAppStore((s) => s.user);
  const logs = useAppStore((s) => s.workoutLogs);
  const bookings = useAppStore((s) => s.bookings);
  const personalRecords = useAppStore((s) => s.personalRecords);

  const pathId = user?.activePathId || "path-foundations";
  const path = learningPaths.find((p) => p.id === pathId);
  const pathDone = user?.pathProgress?.[pathId] || 0;
  const pathTotal = path?.exerciseIds.length || 1;
  const pathPct = pathDone / pathTotal;

  const understood = user?.formUnderstood?.length || 0;
  const formPct = Math.min(1, understood / 12);
  const streak = user?.formStreak || 0;
  const streakPct = Math.min(1, streak / 7);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      const key = format(d, "yyyy-MM-dd");
      const count = logs.filter((l) => l.date === key).length;
      return { label: format(d, "EEEEE"), value: count };
    });
  }, [logs]);

  const upcoming = bookings.filter(
    (b) =>
      b.userId === user?.uid &&
      (b.status === "booked" || b.status === "waitlisted")
  ).length;

  const cue = cueOfTheDay();

  const spark = useMemo(() => {
    const vals = weekDays.map((d) => d.value);
    const max = Math.max(1, ...vals);
    const w = 120;
    const h = 36;
    const step = w / Math.max(1, vals.length - 1);
    const pts = vals
      .map((v, i) => {
        const x = i * step;
        const y = h - (v / max) * (h - 4) - 2;
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
    return { pts, w, h };
  }, [weekDays]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#12353A", colors.bg]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <FadeInHeader>
            <View style={styles.brandRow}>
              <BrandLogo variant="header" />
              <View style={{ flex: 1 }}>
                <AppText
                  style={{
                    color: colors.text,
                    fontFamily: typography.heading,
                    fontSize: 28,
                  }}
                >
                  Hey {user?.firstName || "Athlete"}
                </AppText>
                <AppText color={colors.textSecondary} style={{ marginTop: 4 }}>
                  {APP_TAGLINE}
                </AppText>
              </View>
            </View>
          </FadeInHeader>

          <View style={styles.sparkRow}>
            <View style={{ flex: 1 }}>
              <AppText variant="caption" color={colors.textMuted}>
                WEEKLY SPARK
              </AppText>
              <AppText
                style={{
                  color: colors.accent,
                  fontFamily: typography.heading,
                  fontSize: 22,
                  marginTop: 2,
                }}
              >
                {logs.filter((l) => l.date === format(new Date(), "yyyy-MM-dd")).length}{" "}
                <AppText color={colors.textSecondary} style={{ fontSize: 14 }}>
                  logged today
                </AppText>
              </AppText>
            </View>
            <Svg width={spark.w} height={spark.h}>
              <Path
                d={spark.pts}
                stroke={colors.accent}
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {weekDays.map((d, i) => {
                const max = Math.max(1, ...weekDays.map((x) => x.value));
                const step = spark.w / Math.max(1, weekDays.length - 1);
                const x = i * step;
                const y = spark.h - (d.value / max) * (spark.h - 4) - 2;
                return (
                  <Circle
                    key={d.label + i}
                    cx={x}
                    cy={y}
                    r={i === weekDays.length - 1 ? 3.5 : 2}
                    fill={
                      i === weekDays.length - 1
                        ? colors.accent
                        : colors.chartSecondary
                    }
                  />
                );
              })}
            </Svg>
          </View>
        </LinearGradient>

        <GlobalExerciseSearch
          onSelect={(ex) =>
            navigation.navigate("ExerciseDetail", { exerciseId: ex.id })
          }
        />

        <AppText variant="label" style={{ marginBottom: spacing.sm }}>
          YOUR RINGS
        </AppText>
        <PopIn>
          <View style={styles.rings}>
            <ProgressRing
              progress={pathPct}
              label="Path"
              valueLabel={`${Math.round(pathPct * 100)}%`}
              delay={0}
            />
            <ProgressRing
              progress={formPct}
              label="Forms"
              valueLabel={`${understood}`}
              color={colors.chartSecondary}
              delay={120}
            />
            <ProgressRing
              progress={streakPct}
              label="Streak"
              valueLabel={`${streak}d`}
              color={colors.chartTertiary}
              delay={240}
            />
          </View>
        </PopIn>

        <View style={styles.card}>
          <WeekBars days={weekDays} />
        </View>

        <View style={styles.statRow}>
          <StatTile label="PRs" value={String(personalRecords.length)} sub="personal bests" />
          <StatTile label="Classes" value={String(upcoming)} sub="upcoming" />
          <StatTile label="Logs" value={String(logs.length)} sub="sessions" />
        </View>

        <Pressable
          style={styles.cueCard}
          onPress={() => navigation.navigate("TrainersHome")}
        >
          <AppText variant="label">PAKISTAN TRAINERS</AppText>
          <AppText
            style={{
              color: colors.text,
              fontFamily: typography.bodyMedium,
              fontSize: 18,
              marginTop: 6,
            }}
          >
            Ask a coach
          </AppText>
          <AppText color={colors.textSecondary} style={{ marginTop: 4 }}>
            Chat, voice notes, WhatsApp form guidance
          </AppText>
        </Pressable>

        <Pressable
          style={styles.cueCard}
          onPress={() => navigation.navigate("MainTabs", { screen: "Academy" })}
        >
          <AppText variant="label">CUE OF THE DAY</AppText>
          <AppText
            style={{
              color: colors.text,
              fontFamily: typography.bodyMedium,
              fontSize: 18,
              marginTop: 6,
            }}
          >
            {cue.term}
          </AppText>
          <AppText color={colors.textSecondary} style={{ marginTop: 4 }}>
            {cue.definition}
          </AppText>
        </Pressable>

        {path ? (
          <Pressable
            style={styles.pathCard}
            onPress={() => navigation.navigate("PathDetail", { pathId: path.id })}
          >
            <View style={{ flex: 1 }}>
              <AppText variant="label">ACTIVE PATH</AppText>
              <AppText color={colors.text} style={styles.pathTitle}>
                {path.title}
              </AppText>
              <AppText variant="caption" color={colors.textMuted}>
                {pathDone}/{pathTotal} lessons
              </AppText>
            </View>
            <ProgressRing
              progress={pathPct}
              size={72}
              stroke={7}
              label=""
              valueLabel={`${Math.round(pathPct * 100)}`}
              delay={400}
            />
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatTile({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <View style={styles.stat}>
      <AppText variant="caption" color={colors.textMuted}>
        {label}
      </AppText>
      <AppText
        style={{
          color: colors.accent,
          fontFamily: typography.heading,
          fontSize: 26,
          marginTop: 2,
        }}
      >
        {value}
      </AppText>
      <AppText variant="caption" color={colors.textSecondary}>
        {sub}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  hero: {
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sparkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    gap: 12,
  },
  rings: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  statRow: { flexDirection: "row", gap: 10, marginBottom: spacing.md },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  cueCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.accentDim,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  pathCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  pathTitle: {
    fontFamily: typography.bodyMedium,
    fontSize: 17,
    marginTop: 4,
    marginBottom: 2,
  },
});
