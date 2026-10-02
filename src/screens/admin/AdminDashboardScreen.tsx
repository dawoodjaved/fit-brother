import React, { useState } from "react";
import { View } from "react-native";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { TextField } from "../../components/Inputs";
import { useAppStore } from "../../store/appStore";
import { useGuidanceStore } from "../../store/guidanceStore";
import { colors, spacing } from "../../theme";
import type { FitnessLevel } from "../../types";
import { notify } from "../../utils/notify";

export function AdminDashboardScreen() {
  const classes = useAppStore((s) => s.classes);
  const bookings = useAppStore((s) => s.bookings);
  const createClass = useAppStore((s) => s.createClass);
  const deleteClass = useAppStore((s) => s.deleteClass);
  const applications = useGuidanceStore((s) => s.applications);
  const approveApplication = useGuidanceStore((s) => s.approveApplication);
  const rejectApplication = useGuidanceStore((s) => s.rejectApplication);
  const sessions = useGuidanceStore((s) => s.sessions);
  const confirmSessionPayment = useGuidanceStore((s) => s.confirmSessionPayment);

  const [title, setTitle] = useState("");
  const [trainer, setTrainer] = useState("Ayesha Khan");
  const [time, setTime] = useState("10:00");
  const [capacity, setCapacity] = useState("12");

  const today = new Date().toISOString().slice(0, 10);
  const todays = classes.filter((c) => c.date === today);
  const activeBookings = bookings.filter(
    (b) => b.status === "booked" || b.status === "waitlisted"
  );
  const pending = applications.filter((a) => a.status === "pending");
  const markedPaid = sessions.filter((s) => s.paymentStatus === "marked_paid");

  return (
    <Screen scroll>
      <AppText variant="label">ADMIN</AppText>
      <AppText variant="title" style={{ marginVertical: spacing.sm }}>
        Dashboard
      </AppText>

      <View style={{ flexDirection: "row", gap: 8, marginBottom: spacing.lg }}>
        <Card style={{ flex: 1 }}>
          <AppText variant="caption">Today’s classes</AppText>
          <AppText variant="title">{todays.length}</AppText>
        </Card>
        <Card style={{ flex: 1 }}>
          <AppText variant="caption">Active bookings</AppText>
          <AppText variant="title">{activeBookings.length}</AppText>
        </Card>
      </View>

      <AppText variant="label">TRAINER APPLICATIONS</AppText>
      <AppText variant="caption" style={{ marginBottom: spacing.sm }}>
        Spark free tier — approve here (no Cloud Functions).
      </AppText>
      {!pending.length ? (
        <AppText
          variant="caption"
          color={colors.textMuted}
          style={{ marginBottom: spacing.md }}
        >
          No pending applications
        </AppText>
      ) : (
        pending.map((a) => (
          <Card key={a.id} style={{ marginBottom: spacing.sm }}>
            <AppText variant="subtitle">
              {a.firstName} {a.lastName}
            </AppText>
            <AppText variant="caption">
              {a.city} · {a.experienceYears}y · PKR {a.feePkr}
            </AppText>
            <AppText variant="caption">
              {a.email} · {a.phone}
            </AppText>
            <AppText variant="caption" style={{ marginTop: 4 }}>
              {a.bio}
            </AppText>
            <View style={{ flexDirection: "row", gap: 8, marginTop: spacing.sm }}>
              <Button
                title="Approve"
                style={{ flex: 1 }}
                onPress={async () => {
                  await approveApplication(a.id);
                  notify("Approved", "Trainer is now listed");
                }}
              />
              <Button
                title="Reject"
                variant="danger"
                style={{ flex: 1 }}
                onPress={async () => {
                  await rejectApplication(a.id);
                  notify("Rejected");
                }}
              />
            </View>
          </Card>
        ))
      )}

      <AppText variant="label" style={{ marginTop: spacing.md }}>
        PAYMENTS TO CONFIRM
      </AppText>
      {!markedPaid.length ? (
        <AppText
          variant="caption"
          color={colors.textMuted}
          style={{ marginBottom: spacing.md }}
        >
          None
        </AppText>
      ) : (
        markedPaid.map((s) => (
          <Card key={s.id} style={{ marginBottom: spacing.sm }}>
            <AppText variant="caption">
              {s.packageId} · PKR {s.feePkr}
            </AppText>
            <Button
              title="Confirm payment"
              style={{ marginTop: 8 }}
              onPress={() => {
                confirmSessionPayment(s.id);
                notify("Confirmed");
              }}
            />
          </Card>
        ))
      )}

      <AppText variant="label" style={{ marginTop: spacing.lg }}>
        CREATE CLASS
      </AppText>
      <TextField label="Title" value={title} onChangeText={setTitle} />
      <TextField label="Trainer" value={trainer} onChangeText={setTrainer} />
      <TextField label="Time (HH:mm)" value={time} onChangeText={setTime} />
      <TextField
        label="Capacity"
        keyboardType="numeric"
        value={capacity}
        onChangeText={setCapacity}
      />
      <Button
        title="Create"
        onPress={() => {
          if (!title.trim()) {
            notify("Title required");
            return;
          }
          createClass({
            title,
            description: "Admin-created session",
            trainer,
            category: "Strength",
            level: "beginner" as FitnessLevel,
            capacity: Number(capacity) || 12,
            date: today,
            time,
            durationMin: 45,
            relatedExerciseIds: ["ex-box-squat"],
            cancelWindowHours: 2,
          });
          setTitle("");
          notify("Created", "Class added to schedule");
        }}
      />

      <AppText variant="label" style={{ marginTop: spacing.lg }}>
        ALL CLASSES
      </AppText>
      {classes.map((c) => (
        <Card key={c.id} style={{ marginTop: spacing.sm }}>
          <AppText variant="subtitle">{c.title}</AppText>
          <AppText variant="caption">
            {c.date} {c.time} · {c.bookedCount}/{c.capacity} · waitlist{" "}
            {c.waitlistCount}
          </AppText>
          <Button
            title="Delete"
            variant="danger"
            style={{ marginTop: spacing.sm }}
            onPress={() => deleteClass(c.id)}
          />
        </Card>
      ))}
    </Screen>
  );
}
