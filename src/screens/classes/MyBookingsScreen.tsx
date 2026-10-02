import React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { FormFeelPrompt } from "../../components/engagement/FormFeelPrompt";
import { StatusPip } from "../../components/charts/VisualMeter";
import { BrandLogo } from "../../components/BrandLogo";
import { View, StyleSheet } from "react-native";
import { useAppStore } from "../../store/appStore";
import { colors, spacing } from "../../theme";
import { notify } from "../../utils/notify";
import { waitlistHint, waitlistPosition } from "../../utils/engagement";
import type { RootStackParamList } from "../../navigation/types";
import { exercises } from "../../data/seed";

export function MyBookingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAppStore((s) => s.user);
  const allBookings = useAppStore((s) => s.bookings);
  const classes = useAppStore((s) => s.classes);
  const cancelBooking = useAppStore((s) => s.cancelBooking);
  const submitFormFeel = useAppStore((s) => s.submitFormFeel);
  const markBookingAttended = useAppStore((s) => s.markBookingAttended);

  const bookings = allBookings.filter((b) => b.userId === user?.uid);
  const upcoming = bookings.filter((b) => b.status === "booked" || b.status === "waitlisted");
  const past = bookings.filter((b) => b.status === "cancelled" || b.status === "attended");

  return (
    <Screen scroll>
      <View style={styles.header}>
        <BrandLogo variant="header" />
        <View style={{ flex: 1 }}>
          <AppText variant="title">My bookings</AppText>
        </View>
      </View>

      <AppText variant="label">UPCOMING</AppText>
      {!upcoming.length ? (
        <AppText variant="caption" style={{ marginVertical: spacing.sm }}>
          No upcoming bookings
        </AppText>
      ) : (
        upcoming.map((b) => {
          const klass = classes.find((c) => c.id === b.classId);
          const pos = waitlistPosition(b, allBookings);
          return (
            <Card key={b.id} style={{ marginVertical: spacing.sm }}>
              <View style={styles.titleRow}>
                <StatusPip
                  tone={b.status === "waitlisted" ? "warning" : "accent"}
                />
                <AppText variant="subtitle" style={{ flex: 1, marginLeft: 8 }}>
                  {b.classTitle}
                </AppText>
              </View>
              <AppText variant="caption" style={{ marginTop: 4 }}>
                {b.classDate} · {b.classTime}
              </AppText>
              {b.status === "waitlisted" && pos > 0 ? (
                <AppText color={colors.warning} style={{ marginTop: 8 }}>
                  {waitlistHint(pos, klass)}
                </AppText>
              ) : null}
              {b.status === "booked" ? (
                <Button
                  title="Mark attended · rate form"
                  variant="secondary"
                  style={{ marginTop: spacing.sm }}
                  onPress={() => {
                    markBookingAttended(b.id);
                    notify("Nice work", "How did form feel? Scroll to History.");
                  }}
                />
              ) : null}
              <Button
                title="Cancel"
                variant="danger"
                style={{ marginTop: spacing.sm }}
                onPress={() => {
                  const res = cancelBooking(b.id);
                  notify(res.ok ? "Done" : "Can't cancel", res.message);
                }}
              />
            </Card>
          );
        })
      )}

      <AppText variant="label" style={{ marginTop: spacing.lg }}>
        HISTORY
      </AppText>
      {!past.length ? (
        <AppText variant="caption" style={{ marginVertical: spacing.sm }}>
          Attend a class to unlock form-feel check-ins
        </AppText>
      ) : null}
      {past.map((b) => {
        const feel = user?.formFeelByBooking?.[b.id];
        const klass = classes.find((c) => c.id === b.classId);
        const related = exercises.filter((e) =>
          klass?.relatedExerciseIds.includes(e.id)
        );
        return (
          <Card key={b.id} style={{ marginVertical: spacing.sm }}>
            <AppText>{b.classTitle}</AppText>
            <AppText variant="caption" color={colors.textMuted}>
              {b.status} · {b.classDate}
            </AppText>
            {b.status === "attended" ? (
              <>
                <FormFeelPrompt
                  classTitle={b.classTitle || "class"}
                  already={feel}
                  onFeel={(f) => {
                    submitFormFeel(b.id, f);
                    notify(
                      "Logged",
                      f === "needs_work"
                        ? "We’ll suggest Academy GIFs on your next visit."
                        : "Thanks — keep stacking form wins."
                    );
                  }}
                />
                {feel === "needs_work" && related[0] ? (
                  <Button
                    title={`Practice: ${related[0].name}`}
                    variant="ghost"
                    style={{ marginTop: spacing.sm }}
                    onPress={() =>
                      navigation.navigate("ExerciseDetail", {
                        exerciseId: related[0]!.id,
                      })
                    }
                  />
                ) : null}
              </>
            ) : null}
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    gap: 12,
  },
  titleRow: { flexDirection: "row", alignItems: "center" },
});
