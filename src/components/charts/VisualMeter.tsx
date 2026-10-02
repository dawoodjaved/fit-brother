import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AppText } from "../AppText";
import { colors, spacing } from "../../theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** Compact capacity / completion ring for lists and cards. */
export function CapacityRing({
  progress,
  size = 40,
  color = colors.accent,
  label,
}: {
  progress: number;
  size?: number;
  color?: string;
  label?: string;
}) {
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));
  const anim = useSharedValue(0);

  useEffect(() => {
    anim.value = withTiming(clamped, {
      duration: 650,
      easing: Easing.out(Easing.cubic),
    });
  }, [clamped, anim]);

  const props = useAnimatedProps(() => ({
    strokeDashoffset: c * (1 - anim.value),
  }));

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.border}
          strokeWidth={stroke}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          animatedProps={props}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {label ? (
        <AppText
          variant="caption"
          color={colors.text}
          style={styles.ringLabel}
        >
          {label}
        </AppText>
      ) : null}
    </View>
  );
}

/** Horizontal animated fill bar. */
export function ProgressBar({
  progress,
  height = 6,
  color = colors.accent,
}: {
  progress: number;
  height?: number;
  color?: string;
}) {
  const w = useSharedValue(0);
  const clamped = Math.max(0, Math.min(1, progress));

  useEffect(() => {
    w.value = withTiming(clamped, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
  }, [clamped, w]);

  const anim = useAnimatedStyle(() => ({
    width: `${Math.round(w.value * 100)}%`,
  }));

  return (
    <View style={[styles.barTrack, { height, borderRadius: height }]}>
      <Animated.View
        style={[
          {
            height,
            borderRadius: height,
            backgroundColor: color,
          },
          anim,
        ]}
      />
    </View>
  );
}

/** Inline status pip for bookings / waitlist. */
export function StatusPip({
  tone = "accent",
}: {
  tone?: "accent" | "warning" | "danger" | "muted";
}) {
  const fill =
    tone === "warning"
      ? colors.warning
      : tone === "danger"
        ? colors.danger
        : tone === "muted"
          ? colors.textMuted
          : colors.accent;
  return (
    <View style={[styles.pip, { backgroundColor: fill, shadowColor: fill }]} />
  );
}

const styles = StyleSheet.create({
  ringLabel: {
    position: "absolute",
    fontSize: 10,
    fontWeight: "700",
  },
  barTrack: {
    width: "100%",
    backgroundColor: colors.border,
    overflow: "hidden",
    marginTop: spacing.xs,
  },
  pip: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
