import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  View,
  ViewToken,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../../components/Button";
import { AppText } from "../../components/AppText";
import { BrandLogo } from "../../components/BrandLogo";
import { colors, spacing } from "../../theme";
import type { AuthStackParamList } from "../../navigation/types";
import { APP_MOTTO } from "../../brand";

const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    key: "1",
    title: "Form you can see",
    body: "FitBrother GIF scans show the exact movement, which muscles fire, and what to fix — before you load the bar.",
    image: require("../../../assets/1.jpg"),
  },
  {
    key: "2",
    title: "Train with your brothers",
    body: "Book classes, hit capacity waitlists, and get form guidance from verified coaches — gym life, branded FitBrother.",
    image: require("../../../assets/2.jpg"),
  },
  {
    key: "3",
    title: "Scan. Fix. Progress.",
    body: "Paths from foundations to advanced, jargon decode, and smart swaps so every session sharpens your form.",
    image: require("../../../assets/3.jpg"),
  },
];

type Props = NativeStackScreenProps<AuthStackParamList, "Onboarding">;

export function OnboardingScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
    }
  ).current;

  return (
    <View style={styles.root} pointerEvents="box-none">
      <FlatList
        style={styles.list}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(i) => i.key}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 60 }}
        renderItem={({ item }) => (
          <View style={styles.slide} pointerEvents="none">
            <ImageBackground source={item.image} style={StyleSheet.absoluteFill} resizeMode="cover">
              <LinearGradient
                colors={["transparent", "rgba(14,17,22,0.55)", colors.bg]}
                style={styles.grad}
              >
                <BrandLogo variant="mark" />
                <AppText variant="caption" color={colors.accent} style={{ marginTop: 8 }}>
                  {APP_MOTTO}
                </AppText>
                <AppText variant="display" style={styles.title}>
                  {item.title}
                </AppText>
                <AppText style={styles.body}>{item.body}</AppText>
              </LinearGradient>
            </ImageBackground>
          </View>
        )}
      />
      <View style={styles.footer}>
        <View style={styles.dots} pointerEvents="none">
          {SLIDES.map((s, i) => (
            <View key={s.key} style={[styles.dot, i === index && styles.dotOn]} />
          ))}
        </View>
        <Button title="Get started" onPress={() => navigation.navigate("GetStarted")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  slide: { width, height },
  grad: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.lg,
    paddingBottom: 140,
    minHeight: height,
  },
  title: { marginTop: spacing.sm, maxWidth: 320 },
  body: { marginTop: spacing.sm, maxWidth: 320, color: colors.textSecondary },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
    gap: spacing.md,
    zIndex: 20,
    elevation: 20,
  },
  list: { flex: 1 },
  dots: { flexDirection: "row", gap: 6, marginBottom: 4 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotOn: { width: 22, backgroundColor: colors.accent },
});
