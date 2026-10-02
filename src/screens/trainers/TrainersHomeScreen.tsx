import React, { useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { Chip } from "../../components/Inputs";
import { Button } from "../../components/Button";
import { CapacityRing } from "../../components/charts/VisualMeter";
import { BrandLogo } from "../../components/BrandLogo";
import { FadeInHeader, FadeInItem } from "../../components/motion";
import { SPECIALTY_LABEL } from "../../data/trainersSeed";
import { useGuidanceStore } from "../../store/guidanceStore";
import { colors, spacing } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";
import type { TrainerCity, TrainerSpecialty } from "../../types";
import { APP_TAGLINE } from "../../brand";

type Props = NativeStackScreenProps<RootStackParamList, "TrainersHome">;

const CITIES: (TrainerCity | "All")[] = [
  "All",
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Other",
];

const SPECS: (TrainerSpecialty | "all")[] = [
  "all",
  "beginner_form",
  "strength",
  "women_only",
  "rehab_aware",
  "hypertrophy",
  "general",
];

export function TrainersHomeScreen({ navigation }: Props) {
  const trainers = useGuidanceStore((s) => s.trainers);
  const [city, setCity] = useState<(typeof CITIES)[number]>("All");
  const [spec, setSpec] = useState<(typeof SPECS)[number]>("all");

  const list = useMemo(() => {
    return trainers
      .filter((t) => t.status === "approved")
      .filter((t) => (city === "All" ? true : t.city === city))
      .filter((t) =>
        spec === "all" ? true : t.specialties.includes(spec)
      )
      .slice(0, 40);
  }, [trainers, city, spec]);

  return (
    <Screen scroll>
      <FadeInHeader>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <BrandLogo variant="header" />
          <View style={{ flex: 1 }}>
            <AppText variant="label">PAKISTAN TRAINERS</AppText>
            <AppText variant="title" style={{ marginTop: 4 }}>
              Get form guidance
            </AppText>
            <AppText variant="caption" color={colors.accent} style={{ marginTop: 2 }}>
              {APP_TAGLINE}
            </AppText>
          </View>
        </View>
        <AppText variant="caption" style={{ marginVertical: spacing.md }}>
          Verified coaches · chat & voice notes · WhatsApp voice when offered
        </AppText>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: spacing.md }}>
          <Button
            title="My chats"
            variant="secondary"
            style={{ flex: 1 }}
            onPress={() => navigation.navigate("GuidanceInbox")}
          />
          <Button
            title="Become a trainer"
            variant="secondary"
            style={{ flex: 1 }}
            onPress={() => navigation.navigate("TrainerApply")}
          />
        </View>
      </FadeInHeader>

      <AppText variant="label" style={{ marginBottom: spacing.sm }}>
        CITY
      </AppText>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: spacing.md }}>
        {CITIES.map((c) => (
          <Chip key={c} label={c} selected={city === c} onPress={() => setCity(c)} />
        ))}
      </View>

      <AppText variant="label" style={{ marginBottom: spacing.sm }}>
        SPECIALTY
      </AppText>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: spacing.md }}>
        {SPECS.map((s) => (
          <Chip
            key={s}
            label={s === "all" ? "All" : SPECIALTY_LABEL[s] || s}
            selected={spec === s}
            onPress={() => setSpec(s)}
          />
        ))}
      </View>

      <AppText variant="caption" style={{ marginBottom: spacing.sm }}>
        {list.length} trainers
      </AppText>

      {list.map((t, i) => (
        <FadeInItem key={t.id} index={i}>
          <Pressable onPress={() => navigation.navigate("TrainerProfile", { trainerId: t.id })}>
            <Card style={{ marginBottom: spacing.sm }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: t.photoColor,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppText variant="subtitle" color={colors.accentInk}>
                    {t.firstName[0]}
                    {t.lastName[0]}
                  </AppText>
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="subtitle">
                    {t.firstName} {t.lastName}
                    {t.verified ? " ✓" : ""}
                  </AppText>
                  <AppText variant="caption">
                    {t.city} · {t.experienceYears}y · PKR {t.feePkr}
                  </AppText>
                  <AppText variant="caption" color={colors.textMuted}>
                    {t.specialties
                      .slice(0, 2)
                      .map((s) => SPECIALTY_LABEL[s])
                      .join(" · ")}
                  </AppText>
                </View>
                <CapacityRing
                  progress={t.ratingAvg / 5}
                  size={44}
                  label={t.ratingAvg ? t.ratingAvg.toFixed(1) : "—"}
                />
              </View>
            </Card>
          </Pressable>
        </FadeInItem>
      ))}
    </Screen>
  );
}
