import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeInRight } from "react-native-reanimated";
import { AppText } from "../AppText";
import { Card } from "../Card";
import { CapacityRing } from "../charts/VisualMeter";
import { FormScanMark } from "../icons/PatternIcon";
import { cueOfTheDay } from "../../utils/engagement";
import { colors, spacing } from "../../theme";

export function CueOfDayCard({ onPress }: { onPress?: () => void }) {
  const cue = cueOfTheDay();
  return (
    <Animated.View entering={FadeInRight.duration(400)}>
      <Pressable onPress={onPress}>
        <Card style={styles.card}>
          <View style={styles.row}>
            <FormScanMark size={32} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <AppText variant="label">CUE OF THE DAY</AppText>
              <AppText variant="subtitle" style={{ marginTop: 4 }}>
                {cue.term}
              </AppText>
            </View>
          </View>
        </Card>
      </Pressable>
    </Animated.View>
  );
}

export function FormStreakBanner({
  streak,
  understoodCount,
}: {
  streak: number;
  understoodCount: number;
}) {
  return (
    <Animated.View entering={FadeIn.duration(350)}>
      <Card style={styles.streak}>
        <View style={styles.row}>
          <CapacityRing
            progress={Math.min(1, streak / 7)}
            label={`${streak}d`}
            size={56}
          />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <AppText variant="label">FORM STREAK</AppText>
            <AppText variant="caption" style={{ marginTop: 4 }}>
              {understoodCount} forms understood
            </AppText>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md, borderColor: colors.accentDim },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  streak: {
    marginBottom: spacing.md,
    backgroundColor: colors.bgElevated,
  },
});
