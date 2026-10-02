import React, { useState } from "react";
import { View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Screen } from "../../components/Screen";
import { AppText } from "../../components/AppText";
import { Button } from "../../components/Button";
import { Chip, TextField } from "../../components/Inputs";
import { BrandLogo } from "../../components/BrandLogo";
import { useAppStore } from "../../store/appStore";
import { useGuidanceStore } from "../../store/guidanceStore";
import { colors, spacing } from "../../theme";
import type { RootStackParamList } from "../../navigation/types";
import type {
  TrainerCity,
  TrainerLanguage,
  TrainerSpecialty,
} from "../../types";
import { notify } from "../../utils/notify";
import { APP_NAME } from "../../brand";

type Props = NativeStackScreenProps<RootStackParamList, "TrainerApply">;

const CITIES: TrainerCity[] = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Other",
];
const SPECS: TrainerSpecialty[] = [
  "beginner_form",
  "strength",
  "women_only",
  "rehab_aware",
  "hypertrophy",
  "general",
];
const LANGS: TrainerLanguage[] = ["Urdu", "English"];

export function TrainerApplyScreen({ navigation }: Props) {
  const user = useAppStore((s) => s.user);
  const submit = useGuidanceStore((s) => s.submitTrainerApplication);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [city, setCity] = useState<TrainerCity>("Lahore");
  const [bio, setBio] = useState("");
  const [years, setYears] = useState("3");
  const [fee, setFee] = useState("1500");
  const [whatsapp, setWhatsapp] = useState("");
  const [acceptsWa, setAcceptsWa] = useState(true);
  const [specialties, setSpecialties] = useState<TrainerSpecialty[]>([
    "beginner_form",
  ]);
  const [languages, setLanguages] = useState<TrainerLanguage[]>(["Urdu"]);
  const [busy, setBusy] = useState(false);

  const toggleSpec = (s: TrainerSpecialty) => {
    setSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };
  const toggleLang = (l: TrainerLanguage) => {
    setLanguages((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
    );
  };

  const onSubmit = async () => {
    if (!user) {
      notify("Sign in required");
      return;
    }
    if (!firstName.trim() || !email.trim() || !phone.trim() || !bio.trim()) {
      notify("Fill required fields");
      return;
    }
    if (!specialties.length || !languages.length) {
      notify("Pick specialty and language");
      return;
    }
    setBusy(true);
    const res = await submit({
      uid: user.uid,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      city,
      bio: bio.trim(),
      experienceYears: Number(years) || 1,
      specialties,
      languages,
      feePkr: Number(fee) || 1000,
      whatsappE164: whatsapp.replace(/\D/g, "") || undefined,
      acceptsWhatsAppVoice: acceptsWa,
    });
    setBusy(false);
    notify(res.ok ? "Submitted" : "Error", res.message);
    if (res.ok) navigation.goBack();
  };

  return (
    <Screen scroll>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <BrandLogo variant="header" />
        <View style={{ flex: 1 }}>
          <AppText variant="label">REGISTER AS TRAINER</AppText>
          <AppText variant="title" style={{ marginTop: 4 }}>
            Join {APP_NAME}
          </AppText>
        </View>
      </View>
      <AppText variant="caption" style={{ marginVertical: spacing.md }}>
        Your application is saved and emailed to admin. You’ll appear after approval
        (Firestore on free tier — no Cloud Functions).
      </AppText>

      <TextField label="First name" value={firstName} onChangeText={setFirstName} />
      <TextField label="Last name" value={lastName} onChangeText={setLastName} />
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextField
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextField
        label="WhatsApp (92…)"
        value={whatsapp}
        onChangeText={setWhatsapp}
        keyboardType="phone-pad"
      />
      <TextField
        label="Experience (years)"
        value={years}
        onChangeText={setYears}
        keyboardType="numeric"
      />
      <TextField
        label="Session fee (PKR)"
        value={fee}
        onChangeText={setFee}
        keyboardType="numeric"
      />
      <TextField label="Bio" value={bio} onChangeText={setBio} multiline />

      <AppText variant="label" style={{ marginTop: spacing.md }}>
        CITY
      </AppText>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: spacing.sm }}>
        {CITIES.map((c) => (
          <Chip key={c} label={c} selected={city === c} onPress={() => setCity(c)} />
        ))}
      </View>

      <AppText variant="label">SPECIALTIES</AppText>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: spacing.sm }}>
        {SPECS.map((s) => (
          <Chip
            key={s}
            label={s.replace(/_/g, " ")}
            selected={specialties.includes(s)}
            onPress={() => toggleSpec(s)}
          />
        ))}
      </View>

      <AppText variant="label">LANGUAGES</AppText>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: spacing.sm }}>
        {LANGS.map((l) => (
          <Chip
            key={l}
            label={l}
            selected={languages.includes(l)}
            onPress={() => toggleLang(l)}
          />
        ))}
      </View>

      <Chip
        label={acceptsWa ? "WhatsApp voice: ON" : "WhatsApp voice: OFF"}
        selected={acceptsWa}
        onPress={() => setAcceptsWa((v) => !v)}
      />

      <Button
        title="Submit application"
        loading={busy}
        style={{ marginTop: spacing.lg }}
        onPress={onSubmit}
      />
      <AppText variant="caption" color={colors.textMuted} style={{ marginTop: spacing.sm }}>
        Admin reviews in-app or in Firebase console — Spark free tier safe.
      </AppText>
    </Screen>
  );
}
