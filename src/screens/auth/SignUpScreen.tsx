import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Button } from "../../components/Button";
import { TextField } from "../../components/Inputs";
import { useAppStore } from "../../store/appStore";
import { spacing, colors } from "../../theme";
import type { AuthStackParamList } from "../../navigation/types";
import { notify } from "../../utils/notify";
import { BrandLogo } from "../../components/BrandLogo";
import { APP_EYEBROW, APP_NAME } from "../../brand";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

export function SignUpScreen({ navigation }: Props) {
  const signup = useAppStore((s) => s.signup);
  const authError = useAppStore((s) => s.authError);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    const ok = await signup({ firstName, lastName, email, password, phoneNumber });
    setLoading(false);
    if (!ok) notify("Sign up failed", authError || "Try again");
  };

  return (
    <Screen scroll>
      <BrandLogo variant="auth" showCaption />
      <AppText variant="label" style={{ marginTop: spacing.lg }}>
        {APP_EYEBROW}
      </AppText>
      <AppText variant="title" style={{ marginVertical: spacing.sm }}>
        Join {APP_NAME}
      </AppText>
      <TextField label="First name" value={firstName} onChangeText={setFirstName} />
      <TextField label="Last name" value={lastName} onChangeText={setLastName} />
      <TextField label="Phone" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhone} />
      <TextField
        label="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextField label="Password" secureTextEntry value={password} onChangeText={setPassword} />
      {authError ? (
        <AppText color={colors.danger} style={{ marginBottom: spacing.md }}>
          {authError}
        </AppText>
      ) : null}
      <Button title="Create account" onPress={onSubmit} loading={loading} />
      <Button
        title="Already have an account?"
        variant="ghost"
        onPress={() => navigation.navigate("SignIn")}
        style={{ marginTop: spacing.sm }}
      />
    </Screen>
  );
}
