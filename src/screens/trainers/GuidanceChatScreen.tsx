import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { format, parseISO } from "date-fns";
import { Audio } from "expo-av";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { useAppStore } from "../../store/appStore";
import { useGuidanceStore } from "../../store/guidanceStore";
import { colors, radii, spacing, typography } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";
import { notify } from "../../utils/notify";
import { subscribeMessagesRemote } from "../../services/guidance";

type Props = NativeStackScreenProps<RootStackParamList, "GuidanceChat">;

export function GuidanceChatScreen({ route, navigation }: Props) {
  const { threadId } = route.params;
  const user = useAppStore((s) => s.user);
  const thread = useGuidanceStore((s) => s.threads.find((t) => t.id === threadId));
  const localMsgs = useGuidanceStore((s) => s.messagesByThread[threadId] || []);
  const [remoteMsgs, setRemoteMsgs] = useState<typeof localMsgs | null>(null);
  const sendText = useGuidanceStore((s) => s.sendTextMessage);
  const sendVoice = useGuidanceStore((s) => s.sendVoiceMessage);
  const blockThread = useGuidanceStore((s) => s.blockThread);
  const reportThread = useGuidanceStore((s) => s.reportThread);
  const trainers = useGuidanceStore((s) => s.trainers);
  const sessions = useGuidanceStore((s) => s.sessions);
  const markPaid = useGuidanceStore((s) => s.markSessionPaid);
  const confirmPaid = useGuidanceStore((s) => s.confirmSessionPayment);
  const openWhatsApp = useGuidanceStore((s) => s.openWhatsAppVoice);

  const [text, setText] = useState("");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const messages = remoteMsgs ?? localMsgs;
  const trainer = trainers.find((t) => t.id === thread?.trainerId);
  const openSession = sessions.find(
    (s) => s.threadId === threadId && s.paymentStatus !== "confirmed"
  );

  useEffect(() => {
    const unsub = subscribeMessagesRemote(threadId, setRemoteMsgs);
    return () => {
      unsub?.();
      soundRef.current?.unloadAsync().catch(() => {});
    };
  }, [threadId]);

  if (!thread || !user) {
    return (
      <Screen>
        <AppText>Chat unavailable</AppText>
      </Screen>
    );
  }

  const blocked = thread.status === "blocked";

  const onSend = () => {
    sendText(threadId, user.uid, text);
    setText("");
  };

  const startRec = async () => {
    if (Platform.OS === "web") {
      notify("Voice notes", "Use a device build for recording; web uses text for now.");
      return;
    }
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(rec);
    } catch {
      notify("Mic unavailable");
    }
  };

  const stopRec = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (uri) sendVoice(threadId, user.uid, uri);
    } catch {
      setRecording(null);
      notify("Could not save voice note");
    }
  };

  const playVoice = async (uri?: string) => {
    if (!uri) return;
    try {
      await soundRef.current?.unloadAsync();
      const { sound } = await Audio.Sound.createAsync({ uri });
      soundRef.current = sound;
      await sound.playAsync();
    } catch {
      notify("Playback failed");
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="subtitle">
          {user.uid === thread.memberId ? thread.trainerName : thread.memberName}
        </AppText>
        <AppText variant="caption" color={colors.textMuted}>
          Form guidance · not medical advice
        </AppText>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
          <Button
            title="Book session"
            variant="ghost"
            onPress={() =>
              navigation.navigate("GuidanceSessionBook", {
                trainerId: thread.trainerId,
                threadId,
              })
            }
          />
          {trainer?.acceptsWhatsAppVoice ? (
            <Button
              title="WhatsApp voice"
              variant="ghost"
              onPress={() => openWhatsApp(trainer)}
            />
          ) : null}
          <Button
            title="Report"
            variant="ghost"
            onPress={() => {
              reportThread(threadId, user.uid, "User reported from chat");
              notify("Reported");
            }}
          />
          <Button
            title="Block"
            variant="ghost"
            onPress={() => {
              blockThread(threadId, user.uid);
              notify("Blocked");
            }}
          />
        </View>
      </View>

      {openSession ? (
        <Card style={{ marginBottom: spacing.sm, borderColor: colors.accent }}>
          <AppText variant="caption">
            Session {openSession.packageId} · PKR {openSession.feePkr} ·{" "}
            {openSession.paymentStatus}
          </AppText>
          {openSession.paymentStatus === "unpaid" &&
          user.uid === openSession.memberId ? (
            <Button
              title="I paid (JazzCash / EasyPaisa)"
              style={{ marginTop: 8 }}
              onPress={() => markPaid(openSession.id)}
            />
          ) : null}
          {openSession.paymentStatus === "marked_paid" &&
          (user.uid === openSession.trainerId || user.role === "admin") ? (
            <Button
              title="Confirm payment"
              style={{ marginTop: 8 }}
              onPress={() => confirmPaid(openSession.id)}
            />
          ) : null}
          {(trainer?.jazzcashHint || trainer?.easypaisaHint) &&
          openSession.paymentStatus === "unpaid" ? (
            <AppText variant="caption" style={{ marginTop: 6 }}>
              {trainer.jazzcashHint ? `JazzCash: ${trainer.jazzcashHint}` : ""}
              {trainer.easypaisaHint ? `\nEasyPaisa: ${trainer.easypaisaHint}` : ""}
            </AppText>
          ) : null}
        </Card>
      ) : null}

      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: spacing.md }}
        renderItem={({ item }) => {
          const mine = item.senderId === user.uid;
          if (item.type === "system") {
            return (
              <AppText
                variant="caption"
                color={colors.textMuted}
                style={styles.system}
              >
                {item.text}
              </AppText>
            );
          }
          return (
            <View
              style={[
                styles.bubble,
                mine ? styles.mine : styles.theirs,
              ]}
            >
              {item.type === "voice" ? (
                <Pressable onPress={() => playVoice(item.voiceUri)}>
                  <AppText color={mine ? colors.accentInk : colors.text}>
                    ▶ Voice note
                  </AppText>
                </Pressable>
              ) : (
                <AppText color={mine ? colors.accentInk : colors.text}>
                  {item.text}
                </AppText>
              )}
              <AppText
                variant="caption"
                color={mine ? colors.accentInk : colors.textMuted}
                style={{ marginTop: 4, opacity: 0.7 }}
              >
                {format(parseISO(item.createdAt), "HH:mm")}
              </AppText>
            </View>
          );
        }}
      />

      {blocked ? (
        <AppText variant="caption" color={colors.danger} style={{ marginTop: 8 }}>
          This chat is blocked.
        </AppText>
      ) : (
        <View style={styles.composer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Ask about form…"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            onSubmitEditing={onSend}
          />
          <Pressable
            onPressIn={startRec}
            onPressOut={stopRec}
            style={[styles.mic, recording && { backgroundColor: colors.danger }]}
          >
            <AppText color={colors.accentInk} style={{ fontSize: 12 }}>
              {recording ? "…" : "MIC"}
            </AppText>
          </Pressable>
          <Pressable onPress={onSend} style={styles.send}>
            <AppText color={colors.accentInk} style={{ fontFamily: typography.bodyBold }}>
              Send
            </AppText>
          </Pressable>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.sm },
  system: {
    textAlign: "center",
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  bubble: {
    maxWidth: "82%",
    padding: 12,
    borderRadius: radii.md,
    marginBottom: 8,
  },
  mine: {
    alignSelf: "flex-end",
    backgroundColor: colors.accent,
  },
  theirs: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  composer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: typography.body,
  },
  mic: {
    backgroundColor: colors.chartSecondary,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  send: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
});
