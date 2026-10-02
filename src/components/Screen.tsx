import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  StatusBar,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { colors, spacing } from "../theme";

export function Screen({
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
  const inner = (
    <Animated.View entering={FadeIn.duration(280)} style={{ flexGrow: 1 }}>
      {children}
    </Animated.View>
  );

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {inner}
    </ScrollView>
  ) : (
    <View style={[styles.content, contentStyle, { flex: 1 }]}>{inner}</View>
  );

  return (
    <SafeAreaView style={[styles.safe, style]} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" />
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
});
