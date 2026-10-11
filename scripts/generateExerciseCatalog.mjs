/**
 * Regenerates src/data/exercisesCatalog.ts from ExerciseGymGifsDB (jsDelivr).
 * Selects a balanced ~500 form-complete entries (cues, mistakes, GIF, muscles).
 *
 * Usage: node scripts/generateExerciseCatalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "src/data/exercisesCatalog.ts");
const CDN =
  "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0";
const TREE_URL =
  "https://api.github.com/repos/JahelCuadrado/ExerciseGymGifsDB/git/trees/v1.1.0?recursive=1";

const TARGET = 500;

/** Keep learning-path references valid after regen (from seed.ts). */
const PINNED_FILES = [
  "abductors/straight-leg-outer-hip-abductor.gif",
  "abs/arms-overhead-full-sit-up-male.gif",
  "abs/assisted-hanging-knee-raise-with-throw-down.gif",
  "abs/lunge-with-twist.gif",
  "abs/3-4-sit-up.gif",
  "abs/assisted-prone-rectus-femoris-stretch.gif",
  "abs/potty-squat.gif",
  "abductors/resistance-band-seated-hip-abduction.gif",
  "abductors/lever-seated-hip-abduction.gif",
  "biceps/dumbbell-bicep-curl-lunge-with-bowling-motion.gif",
  "biceps/cable-squatting-curl.gif",
  "biceps/dumbbell-lunge-with-bicep-curl.gif",
  "biceps/dumbbell-biceps-curl-squat.gif",
  "biceps/dumbbell-step-up-single-leg-balance-with-bicep-curl.gif",
  "calves/lever-seated-squat-calf-raise-on-leg-press-machine.gif",
  "calves/sled-calf-press-on-leg-press.gif",
  "glutes/barbell-lateral-lunge.gif",
  "calves/sled-one-leg-calf-press-on-leg-press.gif",
  "glutes/barbell-clean-grip-front-squat.gif",
  "glutes/weighted-lunge-with-swing.gif",
  "glutes/weighted-stretch-lunge.gif",
  "glutes/barbell-lunge.gif",
  "abs/barbell-press-sit-up.gif",
  "abs/barbell-rollerout-from-bench.gif",
  "biceps/barbell-alternate-biceps-curl.gif",
  "glutes/barbell-rear-lunge-v-2.gif",
  "abs/barbell-sitted-alternate-leg-raise-female.gif",
];

const FOLDER_META = {
  abductors: {
    primary: ["Glutes"],
    synergist: ["Hip Abductors"],
    stabilizer: ["Core"],
    antagonist: ["Hip Flexors"],
    pattern: "lunge",
    equipment: ["bodyweight"],
    focus: "abductors",
  },
  abs: {
    primary: ["Core"],
    synergist: ["Hip Flexors"],
    stabilizer: ["Shoulders"],
    antagonist: ["Erectors"],
    pattern: "core",
    equipment: ["bodyweight"],
    focus: "core",
  },
  adductors: {
    primary: ["Adductors"],
    synergist: ["Glutes"],
    stabilizer: ["Core"],
    antagonist: ["Abductors"],
    pattern: "lunge",
    equipment: ["bodyweight"],
    focus: "adductors",
  },
  biceps: {
    primary: ["Biceps"],
    synergist: ["Forearms"],
    stabilizer: ["Core"],
    antagonist: ["Triceps"],
    pattern: "pull",
    equipment: ["dumbbell"],
    focus: "biceps",
  },
  calves: {
    primary: ["Calves"],
    synergist: ["Ankles"],
    stabilizer: ["Core"],
    antagonist: ["Tibialis"],
    pattern: "hinge",
    equipment: ["bodyweight"],
    focus: "calves",
  },
  cardio: {
    primary: ["Cardio"],
    synergist: ["Legs"],
    stabilizer: ["Core"],
    antagonist: [],
    pattern: "carry",
    equipment: ["bodyweight"],
    focus: "conditioning",
  },
  delts: {
    primary: ["Shoulders"],
    synergist: ["Upper Back"],
    stabilizer: ["Core"],
    antagonist: ["Lats"],
    pattern: "push",
    equipment: ["dumbbell"],
    focus: "shoulders",
  },
  forearms: {
    primary: ["Forearms"],
    synergist: ["Grip"],
    stabilizer: ["Shoulders"],
    antagonist: [],
    pattern: "pull",
    equipment: ["dumbbell"],
    focus: "forearms",
  },
  glutes: {
    primary: ["Glutes"],
    synergist: ["Hamstrings"],
    stabilizer: ["Core"],
    antagonist: ["Hip Flexors"],
    pattern: "hinge",
    equipment: ["bodyweight"],
    focus: "glutes",
  },
  hamstrings: {
    primary: ["Hamstrings"],
    synergist: ["Glutes"],
    stabilizer: ["Core"],
    antagonist: ["Quads"],
    pattern: "hinge",
    equipment: ["bodyweight"],
    focus: "hamstrings",
  },
  lats: {
    primary: ["Lats"],
    synergist: ["Biceps"],
    stabilizer: ["Core"],
    antagonist: ["Chest"],
    pattern: "pull",
    equipment: ["cable"],
    focus: "lats",
  },
  "levator-scapulae": {
    primary: ["Upper Traps"],
    synergist: ["Neck"],
    stabilizer: ["Core"],
    antagonist: [],
    pattern: "mobility",
    equipment: ["bodyweight"],
    focus: "neck",
  },
  pectorals: {
    primary: ["Chest"],
    synergist: ["Triceps"],
    stabilizer: ["Shoulders"],
    antagonist: ["Back"],
    pattern: "push",
    equipment: ["dumbbell"],
    focus: "chest",
  },
  quads: {
    primary: ["Quads"],
    synergist: ["Glutes"],
    stabilizer: ["Core"],
    antagonist: ["Hamstrings"],
    pattern: "squat",
    equipment: ["bodyweight"],
    focus: "quads",
  },
  "serratus-anterior": {
    primary: ["Serratus"],
    synergist: ["Shoulders"],
    stabilizer: ["Core"],
    antagonist: [],
    pattern: "push",
    equipment: ["bodyweight"],
    focus: "serratus",
  },
  spine: {
    primary: ["Erectors"],
    synergist: ["Core"],
    stabilizer: ["Glutes"],
    antagonist: ["Abs"],
    pattern: "mobility",
    equipment: ["bodyweight"],
    focus: "spine",
  },
  traps: {
    primary: ["Traps"],
    synergist: ["Shoulders"],
    stabilizer: ["Core"],
    antagonist: [],
    pattern: "pull",
    equipment: ["dumbbell"],
    focus: "traps",
  },
  triceps: {
    primary: ["Triceps"],
    synergist: ["Shoulders"],
    stabilizer: ["Core"],
    antagonist: ["Biceps"],
    pattern: "push",
    equipment: ["dumbbell"],
    focus: "triceps",
  },
  "upper-back": {
    primary: ["Upper Back"],
    synergist: ["Rear Delts"],
    stabilizer: ["Core"],
    antagonist: ["Chest"],
    pattern: "pull",
    equipment: ["cable"],
    focus: "upper back",
  },
};

const COLORS = [
  "#2D4A3E",
  "#3A2D4A",
  "#4A3A2D",
  "#2D3A4A",
  "#4A2D35",
  "#243528",
  "#352428",
  "#283542",
];

function titleCase(slug) {
  return slug
    .replace(/\.gif$/i, "")
    .replace(/-/g, " ")
    .replace(/\bv 2\b/gi, "V2")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bFemale\b/g, "(Female)")
    .replace(/\bMale\b/g, "(Male)");
}

function slugId(folder, file) {
  return `cat-${file.replace(/\.gif$/i, "")}`
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function detectEquipment(name) {
  const n = name.toLowerCase();
  if (n.includes("barbell")) return ["barbell"];
  if (n.includes("dumbbell")) return ["dumbbell"];
  if (n.includes("kettlebell")) return ["kettlebell"];
  if (n.includes("cable") || n.includes("pulley")) return ["cable"];
  if (n.includes("band") || n.includes("resistance band")) return ["band"];
  if (
    n.includes("lever") ||
    n.includes("machine") ||
    n.includes("sled") ||
    n.includes("smith")
  )
    return ["machine"];
  if (n.includes("bench")) return ["bench", "dumbbell"];
  if (n.includes("pull-up") || n.includes("pullup") || n.includes("chin"))
    return ["pullup_bar"];
  return null;
}

function detectPattern(folder, name, fallback) {
  const n = name.toLowerCase();
  if (n.includes("lunge") || n.includes("split squat") || n.includes("step up"))
    return "lunge";
  if (n.includes("squat") || n.includes("leg press") || n.includes("hack"))
    return "squat";
  if (
    n.includes("deadlift") ||
    n.includes("rdl") ||
    n.includes("hinge") ||
    n.includes("good morning") ||
    n.includes("hip thrust") ||
    n.includes("bridge")
  )
    return "hinge";
  if (
    n.includes("row") ||
    n.includes("pull") ||
    n.includes("lat") ||
    n.includes("chin") ||
    n.includes("curl")
  )
    return "pull";
  if (
    n.includes("press") ||
    n.includes("push") ||
    n.includes("fly") ||
    n.includes("dip") ||
    n.includes("extension")
  )
    return "push";
  if (n.includes("carry") || n.includes("farmer") || n.includes("walk"))
    return "carry";
  if (
    n.includes("stretch") ||
    n.includes("mobility") ||
    n.includes("yoga") ||
    folder === "spine" ||
    folder === "levator-scapulae"
  )
    return "mobility";
  if (
    n.includes("crunch") ||
    n.includes("plank") ||
    n.includes("sit-up") ||
    n.includes("sit up") ||
    n.includes("twist") ||
    folder === "abs"
  )
    return "core";
  return fallback;
}

function detectLevel(name) {
  const n = name.toLowerCase();
  if (
    n.includes("assisted") ||
    n.includes("knee") ||
    n.includes("beginner") ||
    n.includes("stretch") ||
    n.includes("wall")
  )
    return "beginner";
  if (
    n.includes("single leg") ||
    n.includes("pistol") ||
    n.includes("olympic") ||
    n.includes("snatch") ||
    n.includes("clean") ||
    n.includes("deficit") ||
    n.includes("archer")
  )
    return "advanced";
  return "intermediate";
}

function qualityScore(folder, file) {
  const n = file.toLowerCase();
  let score = 10;
  // Prefer gym staples; de-prioritize long stretch / novelty names
  if (n.includes("stretch")) score -= 4;
  if (n.includes("yoga") || n.includes("pilates")) score -= 2;
  if (n.includes("assisted")) score -= 1;
  if (n.includes("female") && !n.includes("male")) score -= 0.5;
  if (
    /barbell|dumbbell|cable|kettlebell|pull-up|chin|squat|deadlift|bench|row|press|lunge|hip-thrust|rdl/.test(
      n
    )
  )
    score += 5;
  if (n.split("-").length > 8) score -= 2;
  // Slight preference for larger training folders
  const folderBoost = {
    pectorals: 2,
    lats: 2,
    quads: 2,
    glutes: 2,
    delts: 1,
    "upper-back": 2,
    hamstrings: 2,
    biceps: 1,
    triceps: 1,
    abs: 0,
    calves: 0,
    cardio: -1,
  };
  score += folderBoost[folder] || 0;
  return score;
}

function buildExercise(folder, file, index) {
  const meta = FOLDER_META[folder] || FOLDER_META.abs;
  const name = titleCase(file);
  const id = slugId(folder, file);
  const equipment = detectEquipment(name) || meta.equipment;
  const pattern = detectPattern(folder, name, meta.pattern);
  const level = detectLevel(name);
  const focus = meta.focus;
  const gifUrl = `${CDN}/${folder}/${file}`;
  const color = COLORS[index % COLORS.length];

  return {
    id,
    name,
    level,
    equipment,
    pattern,
    muscles: {
      primary: meta.primary,
      synergist: meta.synergist,
      stabilizer: meta.stabilizer,
      antagonist: meta.antagonist,
    },
    cues: [
      `Set up so the load stays stacked over the working ${focus}.`,
      `Pre-engage ${meta.primary[0]?.toLowerCase() || "the target"} before you move.`,
      "Own the eccentric — don't bounce out of the hardest point.",
    ],
    setupSteps: [
      `Adopt a stable start for ${name.toLowerCase()}.`,
      `Brace lightly and feel ${meta.primary[0] || "the target muscles"} turn on first.`,
    ],
    executionSteps: [
      "Move through a full controlled range without losing joint stack.",
      "Pause briefly where the muscle works hardest, then return with control.",
      "Breathe: exhale on effort, inhale on the return.",
    ],
    commonMistakes: [
      {
        title: "Losing tension mid-rep",
        whyItMatters:
          "Momentum steals the stimulus and makes form feedback useless.",
        fix: "Slow the eccentric and keep soft joints locked into position.",
        visibleFromAngle: "side",
      },
      {
        title: "Rushing the setup",
        whyItMatters: "A sloppy start dumps stress into the wrong joints.",
        fix: "Reset feet, brace, then start — every set.",
        visibleFromAngle: "front",
      },
    ],
    breathing: "Exhale on effort, inhale on the return",
    tempo: level === "beginner" ? "3-1-1" : "2-0-1",
    gifKey: pattern,
    gifUrl,
    regressions: [],
    progressions: [],
    thumbnailColor: color,
  };
}

function serializeExercise(e) {
  const eq = e.equipment.map((x) => `"${x}"`).join(", ");
  const syn = e.muscles.synergist.map((x) => `"${x}"`).join(", ");
  const stab = e.muscles.stabilizer.map((x) => `"${x}"`).join(", ");
  const ant = e.muscles.antagonist.map((x) => `"${x}"`).join(", ");
  const cues = e.cues.map((c) => `"${c.replace(/"/g, '\\"')}"`).join(", ");
  const setup = e.setupSteps.map((c) => `"${c.replace(/"/g, '\\"')}"`).join(", ");
  const exec = e.executionSteps.map((c) => `"${c.replace(/"/g, '\\"')}"`).join(", ");
  const mistakes = e.commonMistakes
    .map(
      (m) => `      {
        title: "${m.title}",
        whyItMatters: "${m.whyItMatters}",
        fix: "${m.fix}",
        visibleFromAngle: "${m.visibleFromAngle}",
      }`
    )
    .join(",\n");

  return `  {
    id: "${e.id}",
    name: "${e.name.replace(/"/g, '\\"')}",
    level: "${e.level}",
    equipment: [${eq}],
    pattern: "${e.pattern}",
    muscles: {
      primary: [${e.muscles.primary.map((x) => `"${x}"`).join(", ")}],
      synergist: [${syn}],
      stabilizer: [${stab}],
      antagonist: [${ant}],
    },
    cues: [${cues}],
    setupSteps: [${setup}],
    executionSteps: [${exec}],
    commonMistakes: [
${mistakes}
    ],
    breathing: "${e.breathing}",
    tempo: "${e.tempo}",
    gifKey: "${e.gifKey}",
    gifUrl: "${e.gifUrl}",
    regressions: [],
    progressions: [],
    thumbnailColor: "${e.thumbnailColor}",
  }`;
}

async function main() {
  console.log("Fetching ExerciseGymGifsDB tree…");
  const res = await fetch(TREE_URL, {
    headers: { "User-Agent": "fitbrother-catalog-generator" },
  });
  if (!res.ok) throw new Error(`GitHub tree fetch failed: ${res.status}`);
  const json = await res.json();
  const gifs = (json.tree || []).filter(
    (t) => t.type === "blob" && t.path?.endsWith(".gif") && t.path.includes("/")
  );

  const candidates = gifs.map((g) => {
    const [folder, file] = g.path.split("/");
    return {
      folder,
      file,
      path: g.path,
      score: qualityScore(folder, file),
    };
  });

  // Cap per folder so one muscle group doesn't eat the whole catalog
  const caps = {
    abs: 55,
    biceps: 40,
    triceps: 40,
    delts: 40,
    pectorals: 45,
    glutes: 40,
    lats: 35,
    "upper-back": 35,
    quads: 30,
    hamstrings: 25,
    calves: 20,
    forearms: 15,
    traps: 12,
    adductors: 6,
    abductors: 5,
    cardio: 18,
    spine: 12,
    "serratus-anterior": 5,
    "levator-scapulae": 2,
  };

  const byFolder = new Map();
  for (const c of candidates) {
    const list = byFolder.get(c.folder) || [];
    list.push(c);
    byFolder.set(c.folder, list);
  }

  const byPath = new Map(candidates.map((c) => [c.path, c]));
  const picked = [];
  const seenIds = new Set();

  for (const p of PINNED_FILES) {
    const item = byPath.get(p);
    if (!item) {
      console.warn("Pinned missing from upstream:", p);
      continue;
    }
    const id = slugId(item.folder, item.file);
    if (seenIds.has(id)) continue;
    seenIds.add(id);
    picked.push(item);
  }

  for (const [folder, list] of byFolder) {
    list.sort((a, b) => b.score - a.score || a.file.localeCompare(b.file));
    const cap = caps[folder] ?? 10;
    let added = picked.filter((x) => x.folder === folder).length;
    for (const item of list) {
      if (added >= cap) break;
      const id = slugId(item.folder, item.file);
      if (seenIds.has(id)) continue;
      seenIds.add(id);
      picked.push(item);
      added += 1;
    }
  }

  picked.sort((a, b) => b.score - a.score || a.path.localeCompare(b.path));
  // Never drop pinned rows when trimming to TARGET
  const pinnedSet = new Set(PINNED_FILES);
  const pinned = picked.filter((p) => pinnedSet.has(p.path));
  const rest = picked.filter((p) => !pinnedSet.has(p.path));
  const finalList = [...pinned, ...rest].slice(0, TARGET);
  // Stable sort for git-friendly output: folder then file
  finalList.sort((a, b) => a.path.localeCompare(b.path));

  const exercises = finalList.map((item, i) =>
    buildExercise(item.folder, item.file, i)
  );

  const body = exercises.map(serializeExercise).join(",\n");
  const file = `import type { Exercise } from "../types";
/** Auto-generated learning catalog from ExerciseGymGifsDB (jsDelivr).
 *  Regenerated by scripts/generateExerciseCatalog.mjs — ${exercises.length} form-complete entries.
 */
export const catalogExercises: Exercise[] = [
${body}
];
`;

  fs.writeFileSync(OUT, file, "utf8");
  console.log(`Wrote ${exercises.length} exercises → ${OUT}`);
  const folderCounts = {};
  for (const e of finalList) {
    folderCounts[e.folder] = (folderCounts[e.folder] || 0) + 1;
  }
  console.log("By folder:", folderCounts);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
