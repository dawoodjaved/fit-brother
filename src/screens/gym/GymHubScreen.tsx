import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { FormScanMark } from "../../components/icons/PatternIcon";
import { gymInfo } from "../../data/seed";
import { APP_TAGLINE } from "../../brand";
import { BrandLogo } from "../../components/BrandLogo";
import { colors, spacing } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";

export function GymHubScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen scroll>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <BrandLogo variant="header" />
        <View style={{ flex: 1 }}>
          <AppText variant="display" style={{ marginTop: 0 }}>
            {gymInfo.name}
          </AppText>
          <AppText variant="caption" color={colors.accent} style={{ marginTop: 2 }}>
            {APP_TAGLINE}
          </AppText>
        </View>
        <FormScanMark size={28} />
      </View>
      <AppText
        variant="caption"
        style={{ marginVertical: spacing.md }}
        color={colors.textSecondary}
      >
        {gymInfo.tagline}
      </AppText>

      <Card style={{ marginBottom: spacing.md, borderColor: colors.accent }}>
        <AppText variant="label">PAKISTAN TRAINERS</AppText>
        <AppText style={{ marginTop: 6, marginBottom: spacing.sm }}>
          Chat, voice notes, and WhatsApp form guidance from verified coaches.
        </AppText>
        <Button title="Find trainers" onPress={() => navigation.navigate("TrainersHome")} />
        <Button
          title="My guidance chats"
          variant="secondary"
          style={{ marginTop: spacing.sm }}
          onPress={() => navigation.navigate("GuidanceInbox")}
        />
        <Button
          title="Register as trainer"
          variant="ghost"
          style={{ marginTop: spacing.sm }}
          onPress={() => navigation.navigate("TrainerApply")}
        />
      </Card>

      <Card>
        <AppText variant="label">HOURS</AppText>
        {gymInfo.hours.map((h) => (
          <AppText key={h.day} style={{ marginTop: 4 }}>
            {h.day}: {h.open} – {h.close}
          </AppText>
        ))}
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <AppText variant="label">LOCATION</AppText>
        <AppText style={{ marginTop: 6 }}>{gymInfo.address}</AppText>
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <AppText variant="label">TRAINERS</AppText>
        {gymInfo.trainers.map((t) => (
          <AppText key={t.name} style={{ marginTop: 6 }}>
            {t.name} — {t.specialty}
          </AppText>
        ))}
      </Card>

      <Card style={{ marginTop: spacing.md }}>
        <AppText variant="label">HOUSE RULES</AppText>
        {gymInfo.rules.map((r) => (
          <AppText key={r} style={{ marginTop: 6 }}>
            · {r}
          </AppText>
        ))}
      </Card>
    </Screen>
  );
}
