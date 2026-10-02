import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { AppText } from "../AppText";
import { colors, spacing } from "../../theme";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

type Day = { label: string; value: number };

function Bar({
  x,
  maxH,
  value,
  maxValue,
  delay,
  color,
}: {
  x: number;
  maxH: number;
  value: number;
  maxValue: number;
  delay: number;
  color: string;
}) {
  const h = useSharedValue(0);
  const target = maxValue > 0 ? (value / maxValue) * maxH : 0;

  useEffect(() => {
    h.value = withDelay(
      delay,
      withTiming(target, { duration: 700, easing: Easing.out(Easing.cubic) })
    );
  }, [target, delay, h]);

  const props = useAnimatedProps(() => ({
    height: h.value,
    y: maxH - h.value + 4,
  }));

  return (
    <AnimatedRect
      x={x}
      width={18}
      rx={4}
      fill={color}
      animatedProps={props}
    />
  );
}

export function WeekBars({
  days,
  title = "ACTIVITY · 7 DAYS",
}: {
  days: Day[];
  title?: string;
}) {
  const maxValue = Math.max(1, ...days.map((d) => d.value));
  const W = 280;
  const H = 96;
  const gap = (W - days.length * 18) / (days.length + 1);

  return (
    <View style={styles.wrap}>
      <AppText
        variant="label"
        color={colors.accent}
        style={{ marginBottom: spacing.sm }}
      >
        {title}
      </AppText>
      <Svg width={W} height={H + 22}>
        {days.map((d, i) => (
          <Bar
            key={d.label}
            x={gap + i * (18 + gap)}
            maxH={H}
            value={d.value}
            maxValue={maxValue}
            delay={i * 70}
            color={i === days.length - 1 ? colors.accent : colors.chartSecondary}
          />
        ))}
      </Svg>
      <View style={[styles.labels, { width: W }]}>
        {days.map((d) => (
          <AppText
            key={d.label}
            variant="caption"
            color={colors.textMuted}
            style={styles.day}
          >
            {d.label}
          </AppText>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "flex-start" },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 4,
  },
  day: { flex: 1, textAlign: "center", fontSize: 11 },
});
