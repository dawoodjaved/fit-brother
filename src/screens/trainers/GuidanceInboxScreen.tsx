import React, { useMemo } from "react";
import { Pressable, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { format, parseISO } from "date-fns";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { StatusPip } from "../../components/charts/VisualMeter";
import { BrandLogo } from "../../components/BrandLogo";
import { useAppStore } from "../../store/appStore";
import { useGuidanceStore } from "../../store/guidanceStore";
import { colors, spacing } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "GuidanceInbox">;

export function GuidanceInboxScreen({ navigation }: Props) {
  const user = useAppStore((s) => s.user);
  const threads = useGuidanceStore((s) => s.threads);

  const mine = useMemo(() => {
    if (!user) return [];
    return threads
      .filter((t) => t.memberId === user.uid || t.trainerId === user.uid)
      .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
  }, [threads, user]);

  return (
    <Screen scroll>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: spacing.md }}>
        <BrandLogo variant="header" />
        <View style={{ flex: 1 }}>
          <AppText variant="label">FITBROTHER GUIDANCE</AppText>
          <AppText variant="title" style={{ marginTop: 4 }}>
            Chats
          </AppText>
        </View>
      </View>

      {!mine.length ? (
        <Card>
          <AppText>No chats yet.</AppText>
          <AppText variant="caption" style={{ marginTop: 6 }}>
            Find a Pakistan trainer and tap Ask for guidance.
          </AppText>
        </Card>
      ) : (
        mine.map((t) => {
          const other =
            user?.uid === t.memberId ? t.trainerName : t.memberName;
          return (
            <Pressable
              key={t.id}
              onPress={() => navigation.navigate("GuidanceChat", { threadId: t.id })}
            >
              <Card style={{ marginBottom: spacing.sm }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <StatusPip
                    tone={
                      t.status === "blocked"
                        ? "danger"
                        : t.status === "open"
                          ? "accent"
                          : "muted"
                    }
                  />
                  <View style={{ flex: 1 }}>
                    <AppText variant="subtitle">{other}</AppText>
                    <AppText variant="caption">{t.lastMessage}</AppText>
                    <AppText variant="caption" color={colors.textMuted}>
                      {format(parseISO(t.lastMessageAt), "MMM d · HH:mm")}
                    </AppText>
                  </View>
                </View>
              </Card>
            </Pressable>
          );
        })
      )}
    </Screen>
  );
}
