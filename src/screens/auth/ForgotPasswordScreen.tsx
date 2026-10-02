import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Button } from "../../components/Button";
import { TextField } from "../../components/Inputs";
import { spacing } from "../../theme";
import type { AuthStackParamList } from "../../navigation/types";
import { notify } from "../../utils/notify";
import { BrandLogo } from "../../components/BrandLogo";
import { APP_EYEBROW } from "../../brand";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");

  return (
    <Screen>
      <BrandLogo variant="mark" />
      <AppText variant="label" style={{ marginTop: spacing.md }}>
        {APP_EYEBROW}
      </AppText>
      <AppText variant="title" style={{ marginVertical: spacing.sm }}>
        Reset access
      </AppText>
      <AppText style={{ marginBottom: spacing.lg }}>
        In demo mode we show a confirmation only. Wire Firebase Auth reset when you disable
        useDemoMode.
      </AppText>
      <TextField
        label="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Button
        title="Send reset link"
        onPress={() => {
          notify("Check your inbox", `Reset link simulated for ${email || "your email"}`);
          navigation.goBack();
        }}
      />
    </Screen>
  );
}
