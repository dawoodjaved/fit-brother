import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Syne_600SemiBold,
  Syne_700Bold,
} from "@expo-google-fonts/syne";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import * as Notifications from "expo-notifications";
import { AuthNavigator, RootNavigator } from "./src/navigation/RootNavigator";
import { useAppStore } from "./src/store/appStore";
import { colors } from "./src/theme";
import { getFirebase } from "./src/services/firebase";
import { APP_LOGO } from "./src/brand";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bgElevated,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
  },
};

export default function App() {
  const user = useAppStore((s) => s.user);
  const flushOfflineQueue = useAppStore((s) => s.flushOfflineQueue);
  const [ready, setReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Syne_600SemiBold,
    Syne_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  const boot = useCallback(async () => {
    getFirebase();
    flushOfflineQueue();
    if (Platform.OS !== "web") {
      try {
        await Promise.race([
          Notifications.requestPermissionsAsync(),
          new Promise((resolve) => setTimeout(resolve, 1500)),
        ]);
      } catch {
        // notifications optional on simulators
      }
    }
    setReady(true);
  }, [flushOfflineQueue]);

  useEffect(() => {
    boot();
  }, [boot]);

  if (!fontsLoaded || !ready) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <Image
          source={APP_LOGO}
          style={{ width: 128, height: 128, borderRadius: 24 }}
          resizeMode="cover"
        />
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="light" />
          {user ? <RootNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
