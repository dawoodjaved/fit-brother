import type { Exercise } from "../types";
import { exercises } from "../data/seed";
import { muscleFolder } from "./engagement";

const REGION_KEYS: Record<string, string[]> = {
  Chest: ["Chest", "Pectoralis", "Serratus"],
  Back: ["Back", "Lats", "Mid Back", "Traps", "Erectors", "Rhomboid"],
  Shoulders: ["Delts", "Rear Delts", "Front Delts", "Deltoid"],
  Arms: ["Biceps", "Triceps", "Forearms"],
  Core: ["Core", "Deep Core", "Abs", "Oblique"],
  Glutes: ["Glutes"],
  Legs: [
    "Quadriceps",
    "Hamstrings",
    "Calves",
    "Adductors",
    "Hip Flexors",
    "Quads",
    "Tibialis",
  ],
};

/** Exercises matching a Body Map region (primary/synergist). */
export function exercisesForRegion(region: string, limit = 6): Exercise[] {
  const keys = REGION_KEYS[region] || [region];
  return exercises
    .filter((e) => {
      const all = [...e.muscles.primary, ...e.muscles.synergist].join(" ");
      return keys.some((k) => all.includes(k));
    })
    .slice(0, limit);
}

/** 10-min mini-path: 2 form GIFs + logger entry points. */
export function miniPathForRegion(region: string): Exercise[] {
  return exercisesForRegion(region, 2);
}

export function groupFavoritesByMuscle(favIds: string[]): Record<string, Exercise[]> {
  const map: Record<string, Exercise[]> = {};
  favIds.forEach((id) => {
    const ex = exercises.find((e) => e.id === id);
    if (!ex) return;
    const folder = muscleFolder(ex.muscles.primary);
    if (!map[folder]) map[folder] = [];
    map[folder].push(ex);
  });
  return map;
}

/** Academy suggestion from latest form-feel feedback. */
export function academySuggestionFromFeel(
  feelByBooking: Record<string, "great" | "ok" | "needs_work"> | undefined,
  bookings: { id: string; classId: string; classTitle?: string }[],
  classes: { id: string; relatedExerciseIds: string[] }[]
): { title: string; exerciseIds: string[] } | null {
  if (!feelByBooking) return null;
  const needs = Object.entries(feelByBooking)
    .filter(([, v]) => v === "needs_work" || v === "ok")
    .map(([id]) => id);
  if (!needs.length) return null;
  const bookingId = needs[needs.length - 1]!;
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return null;
  const klass = classes.find((c) => c.id === booking.classId);
  const ids = klass?.relatedExerciseIds?.slice(0, 3) || [];
  if (!ids.length) return null;
  return {
    title:
      feelByBooking[bookingId] === "needs_work"
        ? `Form focus after ${booking.classTitle || "class"}`
        : `Brush-up after ${booking.classTitle || "class"}`,
    exerciseIds: ids,
  };
}
