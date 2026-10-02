import { jargonGlossary } from "../data/seed";
import type { Booking, GymClass, JargonTerm } from "../types";

/** Stable daily cue from jargon glossary (rotates by date). */
export function cueOfTheDay(date = new Date()): JargonTerm {
  const list = jargonGlossary;
  const day = Math.floor(date.getTime() / 86_400_000);
  return list[Math.abs(day) % list.length]!;
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/** Yesterday key for streak continuity. */
export function yesterdayKey(date = new Date()) {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Waitlist place (1 = first). Only counts other waitlisted members
 * who joined before this booking.
 */
export function waitlistPosition(
  booking: Booking,
  allBookings: Booking[]
): number {
  if (booking.status !== "waitlisted") return 0;
  const ahead = allBookings.filter(
    (b) =>
      b.classId === booking.classId &&
      b.status === "waitlisted" &&
      b.createdAt <= booking.createdAt &&
      b.id !== booking.id
  ).length;
  return ahead + 1;
}

export function waitlistHint(position: number, klass?: GymClass): string {
  if (position <= 0) return "";
  if (position === 1) {
    return "You’re #1 on the waitlist — usually get in if someone cancels within ~30 min of class.";
  }
  if (position === 2) {
    return "You’re #2 — solid odds if there’s a late cancel before start.";
  }
  return `You’re #${position} of ${(klass?.waitlistCount || position)} waiting — check back closer to class.`;
}

export function muscleFolder(primary: string[]): string {
  const m = (primary[0] || "General").toLowerCase();
  if (m.includes("quad") || m.includes("glute") || m.includes("ham") || m.includes("calf"))
    return "Legs";
  if (m.includes("pec") || m.includes("chest")) return "Chest";
  if (m.includes("lat") || m.includes("rhomb") || m.includes("trap") || m.includes("back"))
    return "Back";
  if (m.includes("delt") || m.includes("shoulder")) return "Shoulders";
  if (m.includes("bicep") || m.includes("tricep") || m.includes("forearm")) return "Arms";
  if (m.includes("ab") || m.includes("oblique") || m.includes("core")) return "Core";
  return "Full body";
}

export const FORM_FEEL_COPY = {
  great: "Form felt solid",
  ok: "Form was okay",
  needs_work: "Need more form work",
} as const;
