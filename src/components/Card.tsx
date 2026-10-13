import React, { memo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { colors, radii, spacing } from "../theme";

export const Card = memo(function Card({
  children,
  style,
  index = 0,
  animate = false,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Stagger index for list entrance (only when animate) */
  index?: number;
  /** Off by default — list scroll stays smooth on Android */
  animate?: boolean;
}) {
  if (!animate) {
    return <View style={[styles.card, style]}>{children}</View>;
  }
  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 40)
        .duration(320)
        .springify()
        .damping(18)}
      style={[styles.card, style]}
    >
      {children}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
