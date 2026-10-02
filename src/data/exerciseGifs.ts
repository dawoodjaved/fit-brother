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
  | "dead-bug"
  | "goblet"
  | "lateral-raise"
  | "leg-curl"
  | "triceps-pushdown"
  | "incline-bench"
  | "good-morning"
  | "trap"
  | "chin-up";

export type FormPhase = {
  id: string;
  title: string;
  watchFor: string;
};

/** Bundled looping form GIFs */
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
  goblet: require("../../assets/gifs/goblet.gif"),
  "lateral-raise": require("../../assets/gifs/lateral-raise.gif"),
  "leg-curl": require("../../assets/gifs/leg-curl.gif"),
  "triceps-pushdown": require("../../assets/gifs/triceps-pushdown.gif"),
  "incline-bench": require("../../assets/gifs/incline-bench.gif"),
  "good-morning": require("../../assets/gifs/good-morning.gif"),
  trap: require("../../assets/gifs/trap.gif"),
  "chin-up": require("../../assets/gifs/chin-up.gif"),
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
  goblet: 3000,
  "lateral-raise": 2600,
  "leg-curl": 2800,
  "triceps-pushdown": 2600,
  "incline-bench": 2800,
  "good-morning": 3000,
  trap: 2400,
  "chin-up": 3000,
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
  goblet: [
    { id: "hold", title: "Hold close", watchFor: "DB at chest · elbows under · feet planted" },
    { id: "sit", title: "Sit", watchFor: "Elbows inside knees · heels down · tall chest" },
    { id: "drive", title: "Drive", watchFor: "Push mid-foot · stand without pitching forward" },
  ],
  "lateral-raise": [
    { id: "set", title: "Soft elbows", watchFor: "Slight bend · wrists neutral · ribs down" },
    { id: "raise", title: "Raise", watchFor: "Lead with elbows to shoulder height · no shrug" },
    { id: "lower", title: "Lower", watchFor: "Control the eccentric · don’t swing" },
  ],
  "leg-curl": [
    { id: "set", title: "Pad set", watchFor: "Hips pinned · pad on lower calves" },
    { id: "curl", title: "Curl", watchFor: "Pull heels toward glutes · squeeze hamstrings" },
    { id: "lower", title: "Lower", watchFor: "Slow return · keep hips from lifting" },
  ],
  "triceps-pushdown": [
    { id: "set", title: "Elbows pinned", watchFor: "Ribs down · upper arms quiet by sides" },
    { id: "press", title: "Press down", watchFor: "Extend elbows fully · squeeze triceps" },
    { id: "return", title: "Return", watchFor: "Control up · don’t flare elbows" },
  ],
  "incline-bench": [
    { id: "set", title: "Incline set", watchFor: "Shoulders packed · feet planted · slight arch" },
    { id: "lower", title: "Lower", watchFor: "Bar to upper chest · elbows ~45–70°" },
    { id: "press", title: "Press", watchFor: "Drive up · lockout stacked · no bounce" },
  ],
  "good-morning": [
    { id: "brace", title: "Soft knees", watchFor: "Bar on traps · brace · soft knee bend" },
    { id: "hinge", title: "Hinge", watchFor: "Hips back · spine neutral · feel hamstrings" },
    { id: "stand", title: "Stand", watchFor: "Drive hips forward · finish tall" },
  ],
  trap: [
    { id: "hold", title: "Hang tall", watchFor: "Arms long · ribs down · grip firm" },
    { id: "shrug", title: "Shrug", watchFor: "Elevate shoulders straight up · no roll" },
    { id: "lower", title: "Lower", watchFor: "Slow drop · keep neck long" },
  ],
  "chin-up": [
    { id: "hang", title: "Dead hang", watchFor: "Underhand grip · shoulders packed" },
    { id: "pull", title: "Pull", watchFor: "Elbows down · chest to bar · no kip" },
    { id: "lower", title: "Lower", watchFor: "Full controlled descent" },
  ],
};

/** Map academy exercise ids → bundled GIF */
export const EXERCISE_GIF_KEY: Record<string, GifKey> = {
  "ex-pushup": "push-up",
  "ex-knee-pushup": "push-up",
  "ex-box-squat": "squat",
  "ex-goblet-squat": "goblet",
  "ex-back-squat": "squat",
  "ex-rdl": "rdl",
  "ex-hip-hinge": "good-morning",
  "ex-lunge": "lunge",
  "ex-worlds-greatest": "lunge",
  "ex-row": "row",
  "ex-band-pullapart": "row",
  "ex-ohp": "ohp",
  "ex-dead-bug": "dead-bug",
  "ex-pullup": "chin-up",
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
