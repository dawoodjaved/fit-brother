import React from "react";
import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { CapacityRing, ProgressBar } from "../../components/charts/VisualMeter";
import { FormScanMark } from "../../components/icons/PatternIcon";
import { SPECIALTY_LABEL } from "../../data/trainersSeed";
import { useAppStore } from "../../store/appStore";
import { useGuidanceStore } from "../../store/guidanceStore";
import { colors, spacing } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";
import { notify } from "../../utils/notify";

type Props = NativeStackScreenProps<RootStackParamList, "TrainerProfile">;

export function TrainerProfileScreen({ route, navigation }: Props) {
  const trainer = useGuidanceStore((s) =>
    s.trainers.find((t) => t.id === route.params.trainerId)
  );
  const user = useAppStore((s) => s.user);
  const getOrCreateThread = useGuidanceStore((s) => s.getOrCreateThread);
  const openWhatsAppVoice = useGuidanceStore((s) => s.openWhatsAppVoice);

  if (!trainer) {
    return (
      <Screen>
        <AppText>Trainer not found</AppText>
      </Screen>
    );
  }

  const startChat = () => {
    if (!user) {
      notify("Sign in required");
      return;
    }
    const threadId = getOrCreateThread({
      memberId: user.uid,
      memberName: `${user.firstName} ${user.lastName}`,
      trainer,
    });
    navigation.navigate("GuidanceChat", { threadId });
  };

  return (
    <Screen scroll>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: trainer.photoColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppText variant="title" color={colors.accentInk}>
            {trainer.firstName[0]}
            {trainer.lastName[0]}
          </AppText>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <AppText variant="title" style={{ flex: 1 }}>
              {trainer.firstName} {trainer.lastName}
            </AppText>
            {trainer.verified ? <FormScanMark size={28} /> : null}
          </View>
          <AppText variant="caption">
            {trainer.city} · {trainer.experienceYears} years
          </AppText>
          <AppText variant="caption" color={colors.accent}>
            From PKR {trainer.feePkr} / session
          </AppText>
        </View>
        <CapacityRing
          progress={trainer.ratingAvg / 5}
          size={52}
          label={trainer.ratingAvg ? trainer.ratingAvg.toFixed(1) : "new"}
        />
      </View>

      <ProgressBar progress={Math.min(1, trainer.ratingCount / 40)} height={4} />
      <AppText variant="caption" style={{ marginTop: 4 }}>
        {trainer.ratingCount} ratings
        {trainer.responseHoursHint ? ` · ${trainer.responseHoursHint}` : ""}
      </AppText>

      <Card style={{ marginVertical: spacing.md }}>
        <AppText>{trainer.bio}</AppText>
        <AppText variant="caption" style={{ marginTop: spacing.sm }}>
          {trainer.specialties.map((s) => SPECIALTY_LABEL[s]).join(" · ")}
        </AppText>
        <AppText variant="caption">
          Languages: {trainer.languages.join(", ")}
        </AppText>
      </Card>

      <AppText variant="caption" color={colors.textMuted} style={{ marginBottom: spacing.md }}>
        Form coaching only — not medical or physiotherapy advice.
      </AppText>

      <Button title="Ask for guidance" onPress={startChat} />
      <Button
        title="Book a session"
        variant="secondary"
        style={{ marginTop: spacing.sm }}
        onPress={() =>
          navigation.navigate("GuidanceSessionBook", { trainerId: trainer.id })
        }
      />
      {trainer.acceptsWhatsAppVoice && trainer.whatsappE164 ? (
        <Button
          title="Voice call on WhatsApp"
          variant="secondary"
          style={{ marginTop: spacing.sm }}
          onPress={() => openWhatsAppVoice(trainer)}
        />
      ) : null}
    </Screen>
  );
}
