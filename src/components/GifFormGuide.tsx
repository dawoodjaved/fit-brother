import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "./AppText";
import {
  GIF_ASSETS,
  GIF_FORM_PHASES,
  GIF_LOOP_MS,
  type GifKey,
} from "../data/exerciseGifs";
import type { MuscleRoles } from "../types";
import { colors, radii, spacing, typography } from "../theme";

const W = Dimensions.get("window").width - spacing.lg * 2;

type Props = {
  gifKey: GifKey;
  /** Prefer CDN URL when set (exact exercise animation) */
  gifUrl?: string;
  exerciseName: string;
  muscles: MuscleRoles;
  cues: string[];
  restartKey?: string;
};

/**
 * Looping form GIF + synced phase callouts + muscle-hit legend.
 * Prefers exercise-specific CDN GIF; falls back to bundled pattern GIF.
 */
export function GifFormGuide({
  gifKey,
  gifUrl,
  exerciseName,
  muscles,
  cues,
  restartKey,
}: Props) {
  const phases = GIF_FORM_PHASES[gifKey] || GIF_FORM_PHASES.squat;
  const loopMs = GIF_LOOP_MS[gifKey] || 3000;
  const phaseMs = Math.max(900, Math.floor(loopMs / Math.max(phases.length, 1)));

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [gifNonce, setGifNonce] = useState(0);
  const [useCdn, setUseCdn] = useState(!!gifUrl);
  const [loading, setLoading] = useState(true);
  const pulse = useSharedValue(1);

  useEffect(() => {
    setPhaseIndex(0);
    setGifNonce((n) => n + 1);
    setUseCdn(!!gifUrl);
    setLoading(true);
  }, [gifKey, gifUrl, restartKey]);

  useEffect(() => {
    const id = setInterval(() => {
      setPhaseIndex((i) => (i + 1) % phases.length);
    }, phaseMs);
    return () => clearInterval(id);
  }, [phaseMs, phases.length, gifKey]);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.08, { duration: 700, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [pulse]);

  const primaryPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const phase = phases[phaseIndex]!;
  const source = useCdn && gifUrl ? { uri: gifUrl } : GIF_ASSETS[gifKey];

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.wrap}>
      <View style={styles.player}>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator color={colors.accent} size="large" />
          </View>
        ) : null}
        <Image
          key={`${gifKey}-${restartKey ?? ""}-${gifNonce}-${useCdn ? "cdn" : "local"}`}
          source={source}
          style={styles.gif}
          resizeMode="contain"
          onLoad={() => setLoading(false)}
          onError={() => {
            if (useCdn) {
              setUseCdn(false);
              setLoading(true);
            } else {
              setLoading(false);
            }
          }}
        />

        <LinearGradient
          colors={["transparent", "rgba(11,15,14,0.92)"]}
          style={styles.fade}
          pointerEvents="none"
        />

        <View style={styles.phaseBar} pointerEvents="none">
          <AppText variant="label" color={colors.accent}>
            RIGHT FORM · {phase.title.toUpperCase()}
          </AppText>
          <AppText style={styles.watchFor}>{phase.watchFor}</AppText>
          <View style={styles.dots}>
            {phases.map((p, i) => (
              <View
                key={p.id}
                style={[styles.dot, i === phaseIndex && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        <Pressable
          style={styles.restart}
          onPress={() => setGifNonce((n) => n + 1)}
          accessibilityLabel="Restart GIF"
        >
          <AppText variant="caption" color={colors.accent}>
            Replay
          </AppText>
        </Pressable>
      </View>

      <AppText variant="caption" style={{ marginTop: spacing.sm }}>
        Watch {exerciseName} loop · follow the highlighted form phase
      </AppText>

      <View style={styles.muscleBlock}>
        <AppText variant="label">MUSCLES THIS HIT</AppText>
        <View style={styles.chipRow}>
          {muscles.primary.map((m) => (
            <Animated.View
              key={`p-${m}`}
              style={[styles.chip, styles.chipPrimary, primaryPulse]}
            >
              <AppText variant="caption" color={colors.accentInk} style={styles.chipText}>
                Primary · {m}
              </AppText>
            </Animated.View>
          ))}
        </View>
        {muscles.synergist.length ? (
          <View style={styles.chipRow}>
            {muscles.synergist.map((m) => (
              <View key={`s-${m}`} style={[styles.chip, styles.chipSyn]}>
                <AppText variant="caption" color={colors.text} style={styles.chipText}>
                  Synergist · {m}
                </AppText>
              </View>
            ))}
          </View>
        ) : null}
        {muscles.stabilizer.length ? (
          <View style={styles.chipRow}>
            {muscles.stabilizer.map((m) => (
              <View key={`st-${m}`} style={[styles.chip, styles.chipStab]}>
                <AppText variant="caption" color={colors.text} style={styles.chipText}>
                  Stabilizer · {m}
                </AppText>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      {cues.length ? (
        <View style={styles.cues}>
          <AppText variant="label">COACH CUES</AppText>
          {cues.map((c, i) => (
            <AppText key={i} style={styles.cueLine}>
              • {c}
            </AppText>
          ))}
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.sm },
  player: {
    width: W,
    height: Math.min(W, 380),
    alignSelf: "center",
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  gif: { width: "100%", height: "100%" },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  fade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "48%",
  },
  phaseBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
  },
  watchFor: {
    marginTop: 4,
    color: colors.text,
    fontFamily: typography.bodyMedium,
  },
  dots: { flexDirection: "row", gap: 6, marginTop: 10 },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: { backgroundColor: colors.accent, width: 18 },
  restart: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(18,24,22,0.85)",
    borderWidth: 1,
    borderColor: colors.border,
  },
  muscleBlock: { marginTop: spacing.md },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipPrimary: { backgroundColor: colors.musclePrimary },
  chipSyn: { backgroundColor: "rgba(91,159,212,0.35)" },
  chipStab: { backgroundColor: "rgba(245,166,35,0.3)" },
  chipText: { fontFamily: typography.bodyBold, fontSize: 11 },
  cues: { marginTop: spacing.md },
  cueLine: { marginTop: 4 },
});
