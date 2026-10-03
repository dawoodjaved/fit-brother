import type { ImageSourcePropType } from "react-native";

export type GifKey =
  | "push-up"
  | "squat"
  | "rdl"
  | "lunge"
  | "row"
  | "ohp"
  | "plank"
  | "pull-up"
  | "bench"
  | "dead-bug";

type FormPhase = {
  id: string;
  title: string;
  watchFor: string;
};

/** Bundled looping form GIFs (only keys used by seed/catalog). */
export const GIF_ASSETS: Record<GifKey, ImageSourcePropType> = {
  "push-up": require("../../assets/gifs/push-up.gif"),
  squat: require("../../assets/gifs/squat.gif"),
  rdl: require("../../assets/gifs/rdl.gif"),
  lunge: require("../../assets/gifs/lunge.gif"),
  row: require("../../assets/gifs/row.gif"),
  ohp: require("../../assets/gifs/ohp.gif"),
  plank: require("../../assets/gifs/plank.gif"),
  "pull-up": require("../../assets/gifs/pull-up.gif"),
  bench: require("../../assets/gifs/bench.gif"),
  "dead-bug": require("../../assets/gifs/dead-bug.gif"),
};

/** Approximate loop length (ms) — used to sync form-phase callouts with the GIF */
export const GIF_LOOP_MS: Record<GifKey, number> = {
  "push-up": 2800,
  squat: 3200,
  rdl: 3000,
  lunge: 3400,
  row: 2600,
  ohp: 2800,
  plank: 2400,
  "pull-up": 3000,
  bench: 2800,
  "dead-bug": 3200,
};

export const GIF_FORM_PHASES: Record<GifKey, FormPhase[]> = {
  "push-up": [
    { id: "set", title: "Set plank", watchFor: "Wrists under shoulders · body in one straight line" },
    { id: "down", title: "Lower", watchFor: "Elbows ~45° · chest drops as one unit · hips don’t sag" },
    { id: "press", title: "Press", watchFor: "Push floor away · lockout without shrugging traps" },
  ],
  squat: [
    { id: "brace", title: "Brace", watchFor: "Feet planted · ribs stacked · weight over mid-foot" },
    { id: "sit", title: "Sit", watchFor: "Hips & knees bend together · knees track over toes" },
    { id: "drive", title: "Drive", watchFor: "Push floor away · stand tall · don’t pitch forward" },
  ],
  rdl: [
    { id: "set", title: "Soft knees", watchFor: "Slight knee bend · bar/DBs against thighs" },
    { id: "hinge", title: "Hinge", watchFor: "Hips back · spine neutral · feel hamstrings stretch" },
    { id: "stand", title: "Stand", watchFor: "Drive hips forward · squeeze glutes · finish tall" },
  ],
  lunge: [
    { id: "step", title: "Step", watchFor: "Long controlled step · torso stays tall" },
    { id: "drop", title: "Drop", watchFor: "Front knee tracks toes · both knees ~90°" },
    { id: "drive", title: "Drive", watchFor: "Push through front mid-foot · return without wobble" },
  ],
  row: [
    { id: "hinge", title: "Flat back", watchFor: "Hinge set · core braced · arm hangs long" },
    { id: "pull", title: "Pull", watchFor: "Elbow to hip · squeeze mid-back · no shrug" },
    { id: "lower", title: "Lower", watchFor: "Control the eccentric · don’t rotate the torso" },
  ],
  ohp: [
    { id: "rack", title: "Rack", watchFor: "Weights at shoulders · ribs down · glutes tight" },
    { id: "press", title: "Press", watchFor: "Press straight up · head clears path · no back arch" },
    { id: "lock", title: "Lockout", watchFor: "Biceps by ears · stacked joints · controlled lower" },
  ],
  plank: [
    { id: "line", title: "Long line", watchFor: "Ears–hips–heels aligned · squeeze glutes" },
    { id: "brace", title: "Brace", watchFor: "Ribs down · breathe without collapsing hips" },
    { id: "hold", title: "Hold quality", watchFor: "Shoulders packed · neck long · no sagging" },
  ],
  "pull-up": [
    { id: "hang", title: "Dead hang", watchFor: "Shoulders packed · legs quiet · full stretch" },
    { id: "pull", title: "Pull", watchFor: "Elbows down & back · chest toward bar" },
    { id: "lower", title: "Lower", watchFor: "Full controlled descent · no kipping swing" },
  ],
  bench: [
    { id: "set", title: "Set", watchFor: "Feet planted · shoulders packed · slight arch" },
    { id: "lower", title: "Lower", watchFor: "Bar to lower chest · elbows ~45–70°" },
    { id: "press", title: "Press", watchFor: "Drive up & slightly back · lockout stacked" },
  ],
  "dead-bug": [
    { id: "brace", title: "Pin the back", watchFor: "Low back pressed to floor · ribs down" },
    { id: "reach", title: "Opposite reach", watchFor: "Slow arm/leg extend · no arching" },
    { id: "return", title: "Return", watchFor: "Bring limbs back with control · switch sides" },
  ],
};

/** Map academy exercise ids → bundled GIF */
export const EXERCISE_GIF_KEY: Record<string, GifKey> = {
  "ex-pushup": "push-up",
  "ex-knee-pushup": "push-up",
  "ex-box-squat": "squat",
  "ex-goblet-squat": "squat",
  "ex-back-squat": "squat",
  "ex-rdl": "rdl",
  "ex-hip-hinge": "rdl",
  "ex-lunge": "lunge",
  "ex-worlds-greatest": "lunge",
  "ex-row": "row",
  "ex-band-pullapart": "row",
  "ex-ohp": "ohp",
  "ex-dead-bug": "dead-bug",
  "ex-pullup": "pull-up",
  "ex-bench": "bench",
};

export function resolveGifKey(exerciseId: string, pattern?: string): GifKey {
  if (EXERCISE_GIF_KEY[exerciseId]) return EXERCISE_GIF_KEY[exerciseId]!;
  switch (pattern) {
    case "squat":
      return "squat";
    case "hinge":
      return "rdl";
    case "push":
      return "push-up";
    case "pull":
      return "row";
    case "lunge":
      return "lunge";
    case "core":
      return "plank";
    default:
      return "squat";
  }
}
