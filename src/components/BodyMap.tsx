import React, { useMemo, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Svg, { Circle, G, Line, Rect, Text as SvgText } from "react-native-svg";
import Animated, { FadeIn } from "react-native-reanimated";
import { colors, radii, spacing, typography } from "../theme";
import { AppText } from "./AppText";

type BodyView = "front" | "back";

export type BodyRegion =
  | "Chest"
  | "Back"
  | "Shoulders"
  | "Arms"
  | "Core"
  | "Glutes"
  | "Legs";

type MuscleHotspot = {
  id: string;
  region: BodyRegion;
  name: string;
  aka: string;
  does: string;
  view: BodyView;
  /** Anchor on body (viewBox matches PNG aspect 200×267) */
  ax: number;
  ay: number;
  /** Label side: left labels sit on left margin */
  side: "left" | "right";
  ly: number;
};

const FIGURE = {
  front: require("../../assets/anatomy/front.png"),
  back: require("../../assets/anatomy/back.png"),
};

/**
 * Callouts for the transparent muscular anatomy PNGs.
 * Leader lines end at the pill edge so text never sits under the stroke.
 */
const MUSCLES: MuscleHotspot[] = [
  // Front — figure centered, head ~y22, feet ~y258
  {
    id: "front-delt",
    region: "Shoulders",
    name: "Anterior deltoid",
    aka: "Front shoulder",
    does: "Raises the arm forward (presses, front raises).",
    view: "front",
    ax: 68,
    ay: 72,
    side: "left",
    ly: 52,
  },
  {
    id: "pecs",
    region: "Chest",
    name: "Pectoralis major",
    aka: "Chest / pecs",
    does: "Pushes arms forward & together (push-ups, bench).",
    view: "front",
    ax: 92,
    ay: 92,
    side: "left",
    ly: 88,
  },
  {
    id: "biceps",
    region: "Arms",
    name: "Biceps brachii",
    aka: "Biceps",
    does: "Bends the elbow (curls, chin-ups).",
    view: "front",
    ax: 52,
    ay: 108,
    side: "left",
    ly: 118,
  },
  {
    id: "forearm-f",
    region: "Arms",
    name: "Forearm flexors",
    aka: "Forearms",
    does: "Grip strength & wrist flexion.",
    view: "front",
    ax: 42,
    ay: 148,
    side: "left",
    ly: 152,
  },
  {
    id: "side-delt",
    region: "Shoulders",
    name: "Lateral deltoid",
    aka: "Side delt",
    does: "Raises the arm out to the side.",
    view: "front",
    ax: 132,
    ay: 72,
    side: "right",
    ly: 52,
  },
  {
    id: "serratus",
    region: "Chest",
    name: "Serratus anterior",
    aka: "Boxer’s muscle",
    does: "Stabilizes the shoulder blade on pushes.",
    view: "front",
    ax: 128,
    ay: 108,
    side: "right",
    ly: 98,
  },
  {
    id: "abs",
    region: "Core",
    name: "Rectus abdominis",
    aka: "Abs / six-pack",
    does: "Flexes the spine (crunches, hollow holds).",
    view: "front",
    ax: 100,
    ay: 128,
    side: "right",
    ly: 128,
  },
  {
    id: "obliques",
    region: "Core",
    name: "Obliques",
    aka: "Side abs",
    does: "Twist & side-bend the torso.",
    view: "front",
    ax: 120,
    ay: 132,
    side: "right",
    ly: 148,
  },
  {
    id: "quads",
    region: "Legs",
    name: "Quadriceps",
    aka: "Quads",
    does: "Straighten the knee (squats, lunges).",
    view: "front",
    ax: 84,
    ay: 188,
    side: "left",
    ly: 188,
  },
  {
    id: "hip-flex",
    region: "Legs",
    name: "Hip flexors",
    aka: "Iliopsoas area",
    does: "Lift the thigh toward the torso.",
    view: "front",
    ax: 112,
    ay: 162,
    side: "right",
    ly: 172,
  },
  {
    id: "tibialis",
    region: "Legs",
    name: "Tibialis anterior",
    aka: "Shin",
    does: "Lifts the foot (dorsiflexion).",
    view: "front",
    ax: 86,
    ay: 232,
    side: "left",
    ly: 238,
  },

  // Back
  {
    id: "traps",
    region: "Back",
    name: "Trapezius",
    aka: "Traps",
    does: "Shrugs & stabilizes the neck/shoulders.",
    view: "back",
    ax: 100,
    ay: 68,
    side: "right",
    ly: 52,
  },
  {
    id: "rear-delt",
    region: "Shoulders",
    name: "Posterior deltoid",
    aka: "Rear delt",
    does: "Pulls the arm backward (face pulls, rows).",
    view: "back",
    ax: 68,
    ay: 76,
    side: "left",
    ly: 62,
  },
  {
    id: "lats",
    region: "Back",
    name: "Latissimus dorsi",
    aka: "Lats",
    does: "Pulls elbows down/back (pull-ups, rows).",
    view: "back",
    ax: 72,
    ay: 118,
    side: "left",
    ly: 112,
  },
  {
    id: "midback",
    region: "Back",
    name: "Rhomboids / mid-back",
    aka: "Upper back",
    does: "Squeeze shoulder blades together.",
    view: "back",
    ax: 100,
    ay: 98,
    side: "right",
    ly: 92,
  },
  {
    id: "triceps",
    region: "Arms",
    name: "Triceps brachii",
    aka: "Triceps",
    does: "Straightens the elbow (presses, pushdowns).",
    view: "back",
    ax: 142,
    ay: 112,
    side: "right",
    ly: 118,
  },
  {
    id: "erectors",
    region: "Back",
    name: "Erector spinae",
    aka: "Low-back muscles",
    does: "Keeps the spine tall (hinges, deadlifts).",
    view: "back",
    ax: 100,
    ay: 140,
    side: "right",
    ly: 145,
  },
  {
    id: "glutes",
    region: "Glutes",
    name: "Gluteus maximus",
    aka: "Glutes",
    does: "Extends the hip (squats, hinges, thrusts).",
    view: "back",
    ax: 100,
    ay: 162,
    side: "left",
    ly: 162,
  },
  {
    id: "hams",
    region: "Legs",
    name: "Hamstrings",
    aka: "Back of thigh",
    does: "Bend the knee & help hinge (RDLs, curls).",
    view: "back",
    ax: 84,
    ay: 195,
    side: "left",
    ly: 198,
  },
  {
    id: "calves",
    region: "Legs",
    name: "Gastrocnemius",
    aka: "Calves",
    does: "Point the foot / push off (calf raises).",
    view: "back",
    ax: 86,
    ay: 235,
    side: "right",
    ly: 238,
  },
];

/** Matches anatomy PNG 720×960 (3:4) */
const BOX_W = 200;
const BOX_H = 267;
const LABEL_PAD_X = 5;
const LABEL_H = 15;
const CHAR_W = 3.4;
/** Extra space so leader never enters the pill */
const LINE_GAP = 4;

const W = Math.min(Dimensions.get("window").width - spacing.lg * 2 - 8, 420);
const H = Math.round(W * (BOX_H / BOX_W));

function labelWidth(name: string) {
  return Math.min(92, Math.max(46, name.length * CHAR_W + LABEL_PAD_X * 2));
}

export function BodyMap({
  selected,
  onSelect,
  onTrainRegion,
}: {
  selected?: string | null;
  onSelect: (muscle: string | null) => void;
  /** Optional CTA when a region is focused — e.g. Train mini-path */
  onTrainRegion?: (region: BodyRegion) => void;
}) {
  const [view, setView] = useState<BodyView>("front");
  const [focusId, setFocusId] = useState<string | null>(null);

  const visible = useMemo(
    () => MUSCLES.filter((m) => m.view === view),
    [view]
  );
  const focused = MUSCLES.find((m) => m.id === focusId) || null;

  const onTapMuscle = (m: MuscleHotspot) => {
    if (focusId === m.id) {
      setFocusId(null);
      onSelect(null);
      return;
    }
    setFocusId(m.id);
    onSelect(m.region);
  };

  const isLit = (m: MuscleHotspot) =>
    focusId === m.id || selected === m.region;

  return (
    <View style={styles.wrap}>
      <AppText variant="label">ANATOMY BODY MAP</AppText>
      <AppText variant="caption" style={{ marginBottom: spacing.sm }}>
        Real muscular anatomy — tap a name to learn it. Filters Academy by region.
      </AppText>

      <View style={styles.toggleRow}>
        {(["front", "back"] as BodyView[]).map((v) => (
          <Pressable
            key={v}
            onPress={() => {
              setView(v);
              setFocusId(null);
            }}
            style={[styles.toggle, view === v && styles.toggleOn]}
          >
            <AppText
              variant="caption"
              color={view === v ? colors.accentInk : colors.textSecondary}
              style={styles.toggleText}
            >
              {v === "front" ? "Front view" : "Back view"}
            </AppText>
          </Pressable>
        ))}
      </View>

      <View style={styles.stage}>
        <ImageBackground
          key={view}
          source={FIGURE[view]}
          style={styles.figure}
          imageStyle={styles.figureImg}
          resizeMode="contain"
        />
        {/* Lines first; opaque pills + text last so labels never sit under strokes */}
        <Svg
          width={W}
          height={H}
          viewBox={`0 0 ${BOX_W} ${BOX_H}`}
          style={styles.overlay}
          pointerEvents="box-none"
        >
          {visible.map((m) => {
            const lit = isLit(m);
            const lw = labelWidth(m.name);
            const lx = m.side === "left" ? 3 : BOX_W - 3 - lw;
            const ly = m.ly;
            // Stop short of the pill edge (never cross into text)
            const lineEndX =
              m.side === "left" ? lx + lw + LINE_GAP : lx - LINE_GAP;
            const stroke = lit ? colors.accent : "rgba(242,245,243,0.5)";

            return (
              <G key={`line-${m.id}`}>
                <Line
                  x1={m.ax}
                  y1={m.ay}
                  x2={lineEndX}
                  y2={ly}
                  stroke={stroke}
                  strokeWidth={lit ? 1.6 : 1.1}
                />
                <Circle
                  cx={m.ax}
                  cy={m.ay}
                  r={lit ? 4.4 : 3.2}
                  fill={lit ? colors.accent : colors.info}
                  stroke={colors.bg}
                  strokeWidth={1}
                  onPress={() => onTapMuscle(m)}
                />
              </G>
            );
          })}

          {visible.map((m) => {
            const lit = isLit(m);
            const lw = labelWidth(m.name);
            const lx = m.side === "left" ? 3 : BOX_W - 3 - lw;
            const ly = m.ly;
            const pillY = ly - LABEL_H / 2;

            return (
              <G key={`label-${m.id}`} onPress={() => onTapMuscle(m)}>
                <Rect
                  x={lx}
                  y={pillY}
                  width={lw}
                  height={LABEL_H}
                  rx={3}
                  ry={3}
                  fill={lit ? colors.accent : "rgba(8,12,11,0.96)"}
                  stroke={lit ? colors.accentDim : "rgba(242,245,243,0.4)"}
                  strokeWidth={0.8}
                />
                <SvgText
                  x={lx + lw / 2}
                  y={ly + 2.6}
                  fill={lit ? colors.accentInk : colors.text}
                  fontSize="6.4"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {m.name}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>

      {focused ? (
        <Animated.View entering={FadeIn.duration(220)} style={styles.info}>
          <AppText variant="label">{focused.region.toUpperCase()}</AppText>
          <AppText variant="subtitle" style={{ marginTop: 4 }}>
            {focused.name}
          </AppText>
          <AppText variant="caption" color={colors.accent}>
            Also called: {focused.aka}
          </AppText>
          <AppText style={{ marginTop: 6 }}>{focused.does}</AppText>
          {onTrainRegion ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Train this region ${focused.region}`}
              onPress={() => onTrainRegion(focused.region)}
              style={styles.trainCta}
            >
              <AppText variant="caption" color={colors.accentInk} style={styles.trainCtaText}>
                Train this region · ~10 min
              </AppText>
            </Pressable>
          ) : null}
          <Pressable
            onPress={() => {
              setFocusId(null);
              onSelect(null);
            }}
            style={styles.clear}
          >
            <AppText variant="caption" color={colors.accent}>
              Clear selection
            </AppText>
          </Pressable>
        </Animated.View>
      ) : (
        <View style={styles.hint}>
          <AppText variant="caption">
            Tip: switch Front / Back — chest & quads vs lats, glutes & hamstrings.
          </AppText>
        </View>
      )}

      <View style={styles.regionRow}>
        {(
          [
            "Chest",
            "Back",
            "Shoulders",
            "Arms",
            "Core",
            "Glutes",
            "Legs",
          ] as BodyRegion[]
        ).map((r) => (
          <Pressable
            key={r}
            accessibilityRole="button"
            accessibilityLabel={`Select ${r} region`}
            onPress={() => {
              const next = selected === r ? null : r;
              onSelect(next);
              if (!next) {
                setFocusId(null);
                return;
              }
              const first =
                MUSCLES.find((m) => m.region === r && m.view === view) ||
                MUSCLES.find((m) => m.region === r);
              if (first && first.view !== view) setView(first.view);
              setFocusId(first?.id ?? null);
            }}
            style={[styles.pill, selected === r && styles.pillOn]}
          >
            <AppText
              variant="caption"
              color={selected === r ? colors.accentInk : colors.textSecondary}
              style={styles.pillText}
            >
              {r}
            </AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  toggleRow: { flexDirection: "row", gap: 8, marginBottom: spacing.sm },
  toggle: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  toggleText: { fontFamily: typography.bodyBold },
  stage: {
    width: W,
    height: H,
    alignSelf: "center",
    backgroundColor: colors.bg,
    borderRadius: radii.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  figure: {
    ...StyleSheet.absoluteFillObject,
    width: W,
    height: H,
  },
  figureImg: {
    width: W,
    height: H,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  info: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hint: { marginTop: spacing.sm },
  clear: { marginTop: spacing.sm },
  trainCta: {
    marginTop: spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.md,
    backgroundColor: colors.accent,
    alignItems: "center",
  },
  trainCtaText: { fontFamily: typography.bodyBold },
  regionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.md,
    gap: 6,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  pillText: { fontFamily: typography.bodyMedium, fontSize: 11 },
});
