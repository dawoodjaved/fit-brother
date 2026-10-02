export type UserRole = "member" | "admin" | "trainer";
export type FitnessLevel = "beginner" | "intermediate" | "advanced";
export type Goal = "fat_loss" | "strength" | "muscle" | "general";
export type BookingStatus = "booked" | "waitlisted" | "cancelled" | "attended";
export type MovementPattern =
  | "squat"
  | "hinge"
  | "push"
  | "pull"
  | "lunge"
  | "core"
  | "mobility"
  | "carry";
export type ViewAngle = "front" | "side" | "rear";
export type Equipment =
  | "bodyweight"
  | "dumbbell"
  | "barbell"
  | "cable"
  | "machine"
  | "kettlebell"
  | "band"
  | "bench"
  | "pullup_bar";

export type Limitation =
  | "knee_sensitive"
  | "shoulder_sensitive"
  | "lower_back_sensitive"
  | "wrist_sensitive";

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  gender?: string;
  role: UserRole;
  level: FitnessLevel;
  goals: Goal[];
  equipmentPreferences: Equipment[];
  limitations: Limitation[];
  initials: string;
  membershipStatus: "active" | "trial" | "expired";
  onboardingComplete: boolean;
  assessmentComplete: boolean;
  pathProgress: Record<string, number>;
  completedLessons: string[];
  favorites: string[];
  /** Consecutive days the user studied form (GIF / understood / lesson) */
  formStreak: number;
  /** yyyy-MM-dd of last form-study activity */
  lastFormDate: string | null;
  /** Exercises marked “I understand this form” */
  formUnderstood: string[];
  /** Post-class form feel keyed by booking id */
  formFeelByBooking: Record<string, "great" | "ok" | "needs_work">;
  /** Multi-exercise train session builder */
  sessionExerciseIds: string[];
  /** Last learning path the user was on */
  activePathId?: string;
  createdAt: string;
}

export interface GymClass {
  id: string;
  title: string;
  description: string;
  trainer: string;
  category: string;
  level: FitnessLevel;
  capacity: number;
  bookedCount: number;
  waitlistCount: number;
  date: string;
  time: string;
  durationMin: number;
  imageKey?: string;
  relatedExerciseIds: string[];
  status: "open" | "full" | "cancelled";
  cancelWindowHours: number;
}

export interface Booking {
  id: string;
  userId: string;
  classId: string;
  status: BookingStatus;
  createdAt: string;
  userName?: string;
  classTitle?: string;
  classDate?: string;
  classTime?: string;
}

export interface MuscleRoles {
  primary: string[];
  synergist: string[];
  stabilizer: string[];
  antagonist: string[];
}

export interface CommonMistake {
  title: string;
  whyItMatters: string;
  fix: string;
  visibleFromAngle: ViewAngle;
}

export interface Exercise {
  id: string;
  name: string;
  level: FitnessLevel;
  equipment: Equipment[];
  pattern: MovementPattern;
  muscles: MuscleRoles;
  cues: string[];
  setupSteps: string[];
  executionSteps: string[];
  commonMistakes: CommonMistake[];
  breathing: string;
  tempo: string;
  /** Bundled form GIF key under assets/gifs */
  gifKey?: string;
  /** Optional CDN GIF (preferred when present for catalog accuracy) */
  gifUrl?: string;
  regressions: string[];
  progressions: string[];
  thumbnailColor: string;
  jargonTerms?: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: FitnessLevel;
  weeks: number;
  exerciseIds: string[];
  milestones: string[];
}

export interface WorkoutSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutLogEntry {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
  date: string;
  notes?: string;
  synced: boolean;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

export interface GymInfo {
  name: string;
  tagline: string;
  hours: { day: string; open: string; close: string }[];
  address: string;
  trainers: { name: string; specialty: string }[];
  rules: string[];
}

export interface JargonTerm {
  term: string;
  definition: string;
}

export interface AssessmentAnswer {
  questionId: string;
  value: string;
}

/** Pakistan-focused trainer marketplace */
export type TrainerCity =
  | "Karachi"
  | "Lahore"
  | "Islamabad"
  | "Rawalpindi"
  | "Faisalabad"
  | "Multan"
  | "Other";

export type TrainerSpecialty =
  | "beginner_form"
  | "strength"
  | "women_only"
  | "rehab_aware"
  | "hypertrophy"
  | "general";

export type TrainerLanguage = "English" | "Urdu";

export type TrainerApplicationStatus = "pending" | "approved" | "rejected";

export type GuidanceThreadStatus = "open" | "closed" | "blocked";

export type GuidanceMessageType = "text" | "voice" | "system";

export type GuidancePackage =
  | "form_check_15"
  | "form_check_30"
  | "chat_pack_5"
  | "whatsapp_voice";

export type GuidancePaymentStatus = "unpaid" | "marked_paid" | "confirmed";

export interface TrainerProfile {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: TrainerCity;
  bio: string;
  experienceYears: number;
  specialties: TrainerSpecialty[];
  languages: TrainerLanguage[];
  feePkr: number;
  ratingAvg: number;
  ratingCount: number;
  photoColor: string;
  verified: boolean;
  status: "approved" | "suspended";
  whatsappE164?: string;
  acceptsWhatsAppVoice: boolean;
  responseHoursHint?: string;
  jazzcashHint?: string;
  easypaisaHint?: string;
  createdAt: string;
}

export interface TrainerApplication {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: TrainerCity;
  bio: string;
  experienceYears: number;
  specialties: TrainerSpecialty[];
  languages: TrainerLanguage[];
  feePkr: number;
  whatsappE164?: string;
  acceptsWhatsAppVoice: boolean;
  status: TrainerApplicationStatus;
  createdAt: string;
}

export interface GuidanceThread {
  id: string;
  memberId: string;
  memberName: string;
  trainerId: string;
  trainerName: string;
  status: GuidanceThreadStatus;
  lastMessage: string;
  lastMessageAt: string;
  blockedBy?: string;
  createdAt: string;
}

export interface GuidanceMessage {
  id: string;
  threadId: string;
  senderId: string;
  type: GuidanceMessageType;
  text?: string;
  /** Local URI (demo) or Firebase Storage download URL / path */
  voiceUri?: string;
  createdAt: string;
}

export interface GuidanceSession {
  id: string;
  threadId: string;
  memberId: string;
  trainerId: string;
  packageId: GuidancePackage;
  feePkr: number;
  paymentStatus: GuidancePaymentStatus;
  scheduledAt?: string;
  createdAt: string;
}

export interface GuidanceRating {
  id: string;
  sessionId: string;
  trainerId: string;
  memberId: string;
  stars: number;
  comment?: string;
  createdAt: string;
}

export interface GuidanceReport {
  id: string;
  threadId: string;
  reporterId: string;
  reason: string;
  createdAt: string;
}

export const GUIDANCE_PACKAGES: {
  id: GuidancePackage;
  title: string;
  minutes?: number;
  replies?: number;
  blurb: string;
}[] = [
  {
    id: "form_check_15",
    title: "15-min form check",
    minutes: 15,
    blurb: "Quick squat / hinge / press review",
  },
  {
    id: "form_check_30",
    title: "30-min form deep dive",
    minutes: 30,
    blurb: "Full movement breakdown + cues",
  },
  {
    id: "chat_pack_5",
    title: "5 voice replies",
    replies: 5,
    blurb: "Async voice guidance pack",
  },
  {
    id: "whatsapp_voice",
    title: "WhatsApp voice call",
    minutes: 15,
    blurb: "Live voice on WhatsApp (free-tier)",
  },
];
