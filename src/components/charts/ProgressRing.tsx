import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { AppText } from "../AppText";
import { colors, typography } from "../../theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  progress: number; // 0–1
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  label: string;
  valueLabel: string;
  delay?: number;
};

export function ProgressRing({
  progress,
  size = 108,
  stroke = 9,
  color = colors.accent,
  trackColor = colors.border,
  label,
  valueLabel,
  delay = 0,
}: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));
  const anim = useSharedValue(0);

  useEffect(() => {
    anim.value = withDelay(
      delay,
      withTiming(clamped, { duration: 900, easing: Easing.out(Easing.cubic) })
    );
  }, [clamped, delay, anim]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: c * (1 - anim.value),
  }));

  return (
    <View style={[styles.wrap, { width: size }]}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={trackColor}
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
            animatedProps={animatedProps}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.center}>
          <AppText
            style={{
              color: colors.text,
              fontFamily: typography.heading,
              fontSize: 20,
            }}
          >
            {valueLabel}
          </AppText>
        </View>
      </View>
      {label ? (
        <AppText
          variant="caption"
          color={colors.textSecondary}
          style={{ marginTop: 8, textAlign: "center" }}
        >
          {label}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center" },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
