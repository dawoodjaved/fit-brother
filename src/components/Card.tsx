import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";
import { colors, radii, spacing } from "../theme";

export function Card({
  children,
  style,
  index = 0,
  animate = true,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Stagger index for list entrance */
  index?: number;
  animate?: boolean;
}) {
  if (!animate) {
    return (
      <Animated.View style={[styles.card, style]} layout={Layout.springify()}>
        {children}
      </Animated.View>
    );
  }
  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 12) * 45)
        .duration(380)
        .springify()
        .damping(18)}
      layout={Layout.springify().damping(16)}
      style={[styles.card, style]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
