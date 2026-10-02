import React, { useState } from "react";
import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Chip, TextField } from "../../components/Inputs";
import { PLATFORM_PAYMENT_HINT } from "../../brand";
import { useAppStore } from "../../store/appStore";
import { useGuidanceStore } from "../../store/guidanceStore";
import { colors, spacing } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";
import { GUIDANCE_PACKAGES, type GuidancePackage } from "../../types";
import { notify } from "../../utils/notify";

type Props = NativeStackScreenProps<RootStackParamList, "GuidanceSessionBook">;

export function GuidanceSessionBookScreen({ route, navigation }: Props) {
  const { trainerId, threadId: existingThreadId } = route.params;
  const user = useAppStore((s) => s.user);
  const trainer = useGuidanceStore((s) => s.trainers.find((t) => t.id === trainerId));
  const getOrCreateThread = useGuidanceStore((s) => s.getOrCreateThread);
  const bookSession = useGuidanceStore((s) => s.bookSession);
  const rateTrainer = useGuidanceStore((s) => s.rateTrainer);
  const sessions = useGuidanceStore((s) => s.sessions);

  const [pkg, setPkg] = useState<GuidancePackage>("form_check_15");
  const [when, setWhen] = useState("");
  const [stars, setStars] = useState(5);
  const [rated, setRated] = useState(false);

  if (!trainer || !user) {
    return (
      <Screen>
        <AppText>Unavailable</AppText>
      </Screen>
    );
  }

  const confirmed = sessions.filter(
    (s) =>
      s.trainerId === trainerId &&
      s.memberId === user.uid &&
      s.paymentStatus === "confirmed"
  );

  const onBook = () => {
    const threadId =
      existingThreadId ||
      getOrCreateThread({
        memberId: user.uid,
        memberName: `${user.firstName} ${user.lastName}`,
        trainer,
      });
    const session = bookSession({
      threadId,
      memberId: user.uid,
      trainerId: trainer.id,
      packageId: pkg,
      scheduledAt: when.trim() || undefined,
    });
    if (!session) {
      notify("Could not book");
      return;
    }
    notify("Booked", "Pay offline, then mark I paid in chat.");
    navigation.replace("GuidanceChat", { threadId });
  };

  return (
    <Screen scroll>
      <AppText variant="label">SESSION</AppText>
      <AppText variant="title" style={{ marginVertical: spacing.sm }}>
        {trainer.firstName} {trainer.lastName}
      </AppText>
      <AppText variant="caption" style={{ marginBottom: spacing.md }}>
        {PLATFORM_PAYMENT_HINT}
      </AppText>

      {GUIDANCE_PACKAGES.map((p) => {
        if (p.id === "whatsapp_voice" && !trainer.acceptsWhatsAppVoice) return null;
        return (
          <Card
            key={p.id}
            style={{
              marginBottom: spacing.sm,
              borderColor: pkg === p.id ? colors.accent : colors.border,
            }}
          >
            <Chip
              label={p.title}
              selected={pkg === p.id}
              onPress={() => setPkg(p.id)}
            />
            <AppText variant="caption" style={{ marginTop: 6 }}>
              {p.blurb}
            </AppText>
          </Card>
        );
      })}

      {(pkg === "whatsapp_voice" || pkg === "form_check_15" || pkg === "form_check_30") && (
        <TextField
          label="Preferred time (optional note)"
          value={when}
          onChangeText={setWhen}
          placeholder="e.g. Sat 7pm PKT"
        />
      )}

      <Button title="Request session" onPress={onBook} />

      {confirmed.length && !rated ? (
        <Card style={{ marginTop: spacing.lg }}>
          <AppText variant="label">RATE LAST CONFIRMED SESSION</AppText>
          <View style={{ flexDirection: "row", gap: 8, marginVertical: spacing.sm }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Chip
                key={n}
                label={`${n}★`}
                selected={stars === n}
                onPress={() => setStars(n)}
              />
            ))}
          </View>
          <Button
            title="Submit rating"
            variant="secondary"
            onPress={() => {
              const s = confirmed[0]!;
              rateTrainer({
                sessionId: s.id,
                trainerId: trainer.id,
                memberId: user.uid,
                stars,
              });
              setRated(true);
              notify("Thanks", "Rating saved");
            }}
          />
        </Card>
      ) : null}
    </Screen>
  );
}
