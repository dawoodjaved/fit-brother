import React from "react";
import { StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Button } from "../../components/Button";
import { BrandLogo } from "../../components/BrandLogo";
import { colors, spacing } from "../../theme";
import type { AuthStackParamList } from "../../navigation/types";
import { DEMO_ADMIN_EMAIL, DEMO_MEMBER_EMAIL, DEMO_PASSWORD } from "../../data/seed";
import { APP_PITCH } from "../../brand";

type Props = NativeStackScreenProps<AuthStackParamList, "GetStarted">;

export function GetStartedScreen({ navigation }: Props) {
  return (
    <Screen>
      <View style={styles.hero}>
        <BrandLogo variant="hero" showCaption />
        <AppText
          style={{ marginTop: spacing.md, textAlign: "center" }}
          color={colors.textSecondary}
        >
          {APP_PITCH}
        </AppText>
      </View>
      <View style={styles.actions}>
        <Button title="Sign in" onPress={() => navigation.navigate("SignIn")} />
        <Button
          title="Create account"
          variant="secondary"
          onPress={() => navigation.navigate("SignUp")}
          style={{ marginTop: spacing.sm }}
        />
        <AppText variant="caption" style={{ marginTop: spacing.lg, textAlign: "center" }}>
          Demo · Member {DEMO_MEMBER_EMAIL} / Admin {DEMO_ADMIN_EMAIL} · password {DEMO_PASSWORD}
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, justifyContent: "center", alignItems: "center" },
  actions: { marginBottom: spacing.lg },
});
