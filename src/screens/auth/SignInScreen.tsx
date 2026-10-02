import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Button } from "../../components/Button";
import { TextField } from "../../components/Inputs";
import { useAppStore } from "../../store/appStore";
import { colors, spacing } from "../../theme";
import type { AuthStackParamList } from "../../navigation/types";
import { DEMO_MEMBER_EMAIL, DEMO_PASSWORD } from "../../data/seed";
import { notify } from "../../utils/notify";
import { BrandLogo } from "../../components/BrandLogo";
import { APP_EYEBROW } from "../../brand";

type Props = NativeStackScreenProps<AuthStackParamList, "SignIn">;

export function SignInScreen({ navigation }: Props) {
  const login = useAppStore((s) => s.login);
  const authError = useAppStore((s) => s.authError);
  const [email, setEmail] = useState(DEMO_MEMBER_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) notify("Sign in failed", authError || "Try again");
  };

  return (
    <Screen scroll>
      <BrandLogo variant="auth" showCaption />
      <AppText variant="label" style={{ marginTop: spacing.lg }}>
        {APP_EYEBROW}
      </AppText>
      <AppText variant="title" style={{ marginVertical: spacing.sm }}>
        Welcome back
      </AppText>
      <TextField
        label="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextField
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {authError ? (
        <AppText color={colors.danger} style={{ marginBottom: spacing.md }}>
          {authError}
        </AppText>
      ) : null}
      <Button title="Sign in" onPress={onSubmit} loading={loading} />
      <Button
        title="Forgot password"
        variant="ghost"
        onPress={() => navigation.navigate("ForgotPassword")}
        style={{ marginTop: spacing.sm }}
      />
      <Button
        title="Need an account? Sign up"
        variant="secondary"
        onPress={() => navigation.navigate("SignUp")}
        style={{ marginTop: spacing.sm }}
      />
    </Screen>
  );
}
