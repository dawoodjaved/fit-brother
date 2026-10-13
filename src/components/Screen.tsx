import React, { memo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  StatusBar,
} from "react-native";
import { colors, spacing } from "../theme";
import { useLayout } from "../utils/layout";

export const Screen = memo(function Screen({
  children,
  scroll,
  style,
  contentStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}) {
  const { contentPad, isCompact } = useLayout();
  const padStyle = {
    paddingHorizontal: contentPad,
    paddingTop: isCompact ? spacing.sm : spacing.md,
    paddingBottom: spacing.xxl,
  };

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[padStyle, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      removeClippedSubviews
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[padStyle, contentStyle, { flex: 1 }]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.safe, style]} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" />
      {body}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
});
