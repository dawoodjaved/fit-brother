import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import type { AuthStackParamList, MainTabParamList, RootStackParamList } from "./types";
import { colors, typography } from "../theme";
import { useAppStore } from "../store/appStore";

import { OnboardingScreen } from "../screens/auth/OnboardingScreen";
import { GetStartedScreen } from "../screens/auth/GetStartedScreen";
import { SignInScreen } from "../screens/auth/SignInScreen";
import { SignUpScreen } from "../screens/auth/SignUpScreen";
import { ForgotPasswordScreen } from "../screens/auth/ForgotPasswordScreen";
import { QuickOnboardingScreen } from "../screens/onboarding/QuickOnboardingScreen";
import { AssessmentScreen } from "../screens/onboarding/AssessmentScreen";
import { HomeClassesScreen } from "../screens/classes/HomeClassesScreen";
import { ClassDetailScreen } from "../screens/classes/ClassDetailScreen";
import { MyBookingsScreen } from "../screens/classes/MyBookingsScreen";
import { AcademyHomeScreen } from "../screens/academy/AcademyHomeScreen";
import { ExerciseDetailScreen } from "../screens/academy/ExerciseDetailScreen";
import { PathDetailScreen } from "../screens/academy/PathDetailScreen";
import { WorkoutLoggerScreen } from "../screens/workout/WorkoutLoggerScreen";
import { TrainHubScreen } from "../screens/workout/TrainHubScreen";
import { RegionTrainScreen } from "../screens/workout/RegionTrainScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { GymHubScreen } from "../screens/gym/GymHubScreen";
import { AdminDashboardScreen } from "../screens/admin/AdminDashboardScreen";
import { DashboardScreen } from "../screens/home/DashboardScreen";
import { TrainersHomeScreen } from "../screens/trainers/TrainersHomeScreen";
import { TrainerProfileScreen } from "../screens/trainers/TrainerProfileScreen";
import { TrainerApplyScreen } from "../screens/trainers/TrainerApplyScreen";
import { GuidanceInboxScreen } from "../screens/trainers/GuidanceInboxScreen";
import { GuidanceChatScreen } from "../screens/trainers/GuidanceChatScreen";
import { GuidanceSessionBookScreen } from "../screens/trainers/GuidanceSessionBookScreen";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgElevated,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: typography.bodyMedium, fontSize: 11 },
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: "grid-outline",
            Classes: "calendar-outline",
            Academy: "body-outline",
            Bookings: "bookmark-outline",
            Train: "barbell-outline",
            Profile: "person-outline",
          };
          return <Ionicons name={map[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ title: "Home" }} />
      <Tab.Screen name="Classes" component={HomeClassesScreen} />
      <Tab.Screen name="Academy" component={AcademyHomeScreen} />
      <Tab.Screen name="Bookings" component={MyBookingsScreen} />
      <Tab.Screen name="Train" component={TrainHubScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false, animation: "fade" }}>
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="GetStarted" component={GetStartedScreen} />
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

export function RootNavigator() {
  const user = useAppStore((s) => s.user);

  if (user && !user.onboardingComplete) {
    return <QuickOnboardingScreen />;
  }
  if (user && !user.assessmentComplete) {
    return <AssessmentScreen />;
  }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.accent,
        headerTitleStyle: { fontFamily: typography.heading, color: colors.text },
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <RootStack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="ClassDetail"
        component={ClassDetailScreen}
        options={{ title: "Class" }}
      />
      <RootStack.Screen
        name="ExerciseDetail"
        component={ExerciseDetailScreen}
        options={{ title: "Form guide" }}
      />
      <RootStack.Screen
        name="PathDetail"
        component={PathDetailScreen}
        options={{ title: "Learning path" }}
      />
      <RootStack.Screen
        name="WorkoutLogger"
        component={WorkoutLoggerScreen}
        options={{ title: "Log workout" }}
      />
      <RootStack.Screen
        name="RegionTrain"
        component={RegionTrainScreen}
        options={{ title: "Train region" }}
      />
      <RootStack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: "Admin" }}
      />
      <RootStack.Screen
        name="GymHub"
        component={GymHubScreen}
        options={{ title: "Gym hub" }}
      />
      <RootStack.Screen
        name="TrainersHome"
        component={TrainersHomeScreen}
        options={{ title: "Trainers" }}
      />
      <RootStack.Screen
        name="TrainerProfile"
        component={TrainerProfileScreen}
        options={{ title: "Trainer" }}
      />
      <RootStack.Screen
        name="TrainerApply"
        component={TrainerApplyScreen}
        options={{ title: "Apply as trainer" }}
      />
      <RootStack.Screen
        name="GuidanceInbox"
        component={GuidanceInboxScreen}
        options={{ title: "Guidance chats" }}
      />
      <RootStack.Screen
        name="GuidanceChat"
        component={GuidanceChatScreen}
        options={{ title: "Chat" }}
      />
      <RootStack.Screen
        name="GuidanceSessionBook"
        component={GuidanceSessionBookScreen}
        options={{ title: "Book session" }}
      />
    </RootStack.Navigator>
  );
}
