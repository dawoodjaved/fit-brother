import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { AppText } from "../AppText";
import { Button } from "../Button";
import { Card } from "../Card";
import { FORM_FEEL_COPY } from "../../utils/engagement";
import { colors, spacing } from "../../theme";

type Feel = keyof typeof FORM_FEEL_COPY;

/** Post-class form feel prompt — drives Academy suggestions. */
export function FormFeelPrompt({
  classTitle,
  already,
  onFeel,
}: {
  classTitle: string;
  already?: Feel;
  onFeel: (feel: Feel) => void;
}) {
  if (already) {
    return (
      <AppText variant="caption" color={colors.accent} style={{ marginTop: spacing.sm }}>
        Logged: {FORM_FEEL_COPY[already]}
      </AppText>
    );
  }

  return (
    <Animated.View entering={FadeInUp.duration(300)}>
      <Card style={styles.card}>
        <AppText variant="label">HOW DID FORM FEEL?</AppText>
        <AppText variant="caption" style={{ marginTop: 4, marginBottom: spacing.sm }}>
          After {classTitle} — 3 taps. We use this for your next Academy focus.
        </AppText>
        <View style={styles.row}>
          {(Object.keys(FORM_FEEL_COPY) as Feel[]).map((k) => (
            <Button
              key={k}
              title={FORM_FEEL_COPY[k]}
              variant="secondary"
              style={styles.btn}
              onPress={() => onFeel(k)}
            />
          ))}
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: spacing.sm, borderColor: colors.accentDim },
  row: { gap: 8 },
  btn: { marginBottom: 0 },
});
