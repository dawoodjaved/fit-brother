import type { FitnessLevel } from "../types";

export type AuthStackParamList = {
  Onboarding: undefined;
  GetStarted: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Classes: undefined;
  Academy: undefined;
  Bookings: undefined;
  Train: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined | { screen?: keyof MainTabParamList };
  ClassDetail: { classId: string };
  ExerciseDetail: { exerciseId: string; pathId?: string };
  PathDetail: { pathId: string };
  WorkoutLogger: { exerciseId: string; sessionIds?: string[] };
  AdminDashboard: undefined;
  GymHub: undefined;
  RegionTrain: { region: string };
  TrainersHome: undefined;
  TrainerProfile: { trainerId: string };
  TrainerApply: undefined;
  GuidanceInbox: undefined;
  GuidanceChat: { threadId: string };
  GuidanceSessionBook: { trainerId: string; threadId?: string };
};

export type { FitnessLevel };
