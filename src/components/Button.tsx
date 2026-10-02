import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { colors, radii, spacing, typography } from "../theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled,
  loading,
  style,
  textStyle,
}: Props) {
  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";
  const isGhost = variant === "ghost";
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={() => {
        if (!disabled && !loading) scale.value = withSpring(0.97, { damping: 16 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        styles.base,
        isPrimary && styles.primary,
        variant === "secondary" && styles.secondary,
        isGhost && styles.ghost,
        isDanger && styles.danger,
        (disabled || loading) && styles.disabled,
        anim,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.accentInk : colors.accent} />
      ) : (
        <Text
          style={[
            styles.text,
            isPrimary && styles.textOnPrimary,
            (variant === "secondary" || isGhost) && styles.textAccent,
            isDanger && styles.textDanger,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  primary: { backgroundColor: colors.accent },
  secondary: {
    backgroundColor: colors.accentMuted,
    borderWidth: 1,
    borderColor: colors.accentDim,
  },
  ghost: { backgroundColor: "transparent" },
  danger: { backgroundColor: "rgba(255,107,107,0.15)", borderWidth: 1, borderColor: colors.danger },
  disabled: { opacity: 0.45 },
  text: {
    fontFamily: typography.bodyBold,
    fontSize: 16,
  },
  textOnPrimary: { color: colors.accentInk },
  textAccent: { color: colors.accent },
  textDanger: { color: colors.danger },
});
