import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { format, parseISO } from "date-fns";
import * as Haptics from "expo-haptics";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { PopIn } from "../../components/motion";
import { PatternIcon } from "../../components/icons/PatternIcon";
import { CapacityRing, ProgressBar } from "../../components/charts/VisualMeter";
import { useAppStore } from "../../store/appStore";
import { colors, spacing } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";
import { exercises } from "../../data/seed";
import { notify } from "../../utils/notify";
import { waitlistHint, waitlistPosition } from "../../utils/engagement";

type Props = NativeStackScreenProps<RootStackParamList, "ClassDetail">;

export function ClassDetailScreen({ route, navigation }: Props) {
  const { classId } = route.params;
  const klass = useAppStore((s) => s.classes.find((c) => c.id === classId));
  const bookClass = useAppStore((s) => s.bookClass);
  const bookings = useAppStore((s) => s.bookings);
  const user = useAppStore((s) => s.user);
  const [justBooked, setJustBooked] = useState(false);

  if (!klass) {
    return (
      <Screen>
        <AppText>Class not found</AppText>
      </Screen>
    );
  }

  const myBooking = bookings.find(
    (b) => b.classId === classId && b.userId === user?.uid && b.status !== "cancelled"
  );
  const spots = Math.max(0, klass.capacity - klass.bookedCount);
  const related = exercises.filter((e) => klass.relatedExerciseIds.includes(e.id));
  const wlPos = myBooking ? waitlistPosition(myBooking, bookings) : 0;

  const onBook = () => {
    const res = bookClass(klass.id);
    if (res.ok) {
      setJustBooked(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    notify(res.ok ? "Success" : "Couldn't book", res.message);
  };

  const fillRatio = klass.capacity
    ? Math.min(1, klass.bookedCount / klass.capacity)
    : 0;

  return (
    <Screen scroll>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
        <CapacityRing
          progress={fillRatio}
          size={56}
          color={spots ? colors.accent : colors.warning}
          label={`${spots}`}
        />
        <View style={{ flex: 1 }}>
          <AppText variant="label">{klass.category}</AppText>
          <AppText variant="title" style={{ marginVertical: spacing.sm }}>
            {klass.title}
          </AppText>
          <AppText variant="caption">{klass.description}</AppText>
        </View>
      </View>

      <Card style={{ marginVertical: spacing.md }}>
        <AppText variant="caption">
          {format(parseISO(klass.date), "EEEE, MMM d")} · {klass.time}
        </AppText>
        <AppText variant="caption">
          {klass.trainer} · {klass.durationMin} min · {klass.level}
        </AppText>
        <ProgressBar
          progress={fillRatio}
          height={6}
          color={spots ? colors.accent : colors.warning}
        />
        <AppText
          variant="caption"
          color={spots ? colors.accent : colors.warning}
          style={{ marginTop: spacing.sm }}
        >
          {spots
            ? `${spots} open of ${klass.capacity}`
            : `Full · ${klass.waitlistCount} waiting`}
        </AppText>
      </Card>

      {(justBooked || myBooking) && related.length ? (
        <PopIn>
          <Card style={{ marginBottom: spacing.md, borderColor: colors.accent }}>
            <AppText variant="label">FORM FOCUS</AppText>
            {related.slice(0, 2).map((e) => (
              <Pressable
                key={e.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 10,
                }}
                onPress={() =>
                  navigation.navigate("ExerciseDetail", { exerciseId: e.id })
                }
              >
                <PatternIcon pattern={e.pattern} size={22} />
                <AppText style={{ flex: 1 }}>{e.name}</AppText>
              </Pressable>
            ))}
          </Card>
        </PopIn>
      ) : null}

      {related.length && !myBooking && !justBooked ? (
        <View style={{ marginBottom: spacing.md }}>
          <AppText variant="label" style={{ marginBottom: spacing.sm }}>
            LEARN THESE MOVES
          </AppText>
          {related.map((e) => (
            <Pressable
              key={e.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
              onPress={() =>
                navigation.navigate("ExerciseDetail", { exerciseId: e.id })
              }
            >
              <PatternIcon pattern={e.pattern} size={22} />
              <AppText style={{ flex: 1 }}>{e.name}</AppText>
            </Pressable>
          ))}
        </View>
      ) : null}

      {myBooking ? (
        <Card>
          <AppText color={colors.accent}>
            You’re {myBooking.status === "waitlisted" ? "on the waitlist" : "booked"}
          </AppText>
          {myBooking.status === "waitlisted" && wlPos > 0 ? (
            <AppText style={{ marginTop: 8 }}>{waitlistHint(wlPos, klass)}</AppText>
          ) : null}
          <Button
            title="View my bookings"
            variant="ghost"
            onPress={() => navigation.navigate("MainTabs", { screen: "Bookings" } as never)}
          />
        </Card>
      ) : (
        <Button title={spots ? "Book class" : "Join waitlist"} onPress={onBook} />
      )}
    </Screen>
  );
}
