import React from "react";
import { Text, StyleSheet, TextProps, TextStyle } from "react-native";
import { colors, typography } from "../theme";

type Variant = "display" | "title" | "subtitle" | "body" | "caption" | "label";

export function AppText({
  variant = "body",
  color,
  style,
  ...rest
}: TextProps & { variant?: Variant; color?: string }) {
  return (
    <Text
      {...rest}
      style={[styles[variant], color ? { color } : null, style as TextStyle]}
    />
  );
}

const styles = StyleSheet.create({
  display: {
    fontFamily: typography.display,
    fontSize: 40,
    lineHeight: 44,
    color: colors.text,
  },
  title: {
    fontFamily: typography.heading,
    fontSize: 24,
    lineHeight: 30,
    color: colors.text,
  },
  subtitle: {
    fontFamily: typography.bodyMedium,
    fontSize: 18,
    lineHeight: 26,
    color: colors.text,
  },
  body: {
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  caption: {
    fontFamily: typography.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  label: {
    fontFamily: typography.bodyBold,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: colors.accent,
  },
});
