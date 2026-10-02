import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, {
  Circle,
  Path,
  Rect,
  Line,
  G,
} from "react-native-svg";
import type { MovementPattern } from "../../types";
import { colors } from "../../theme";

const PATTERN_COLOR: Record<MovementPattern, string> = {
  squat: colors.accent,
  hinge: colors.chartTertiary,
  push: colors.chartSecondary,
  pull: "#7DD3C0",
  lunge: colors.accentDim,
  core: colors.warning,
  mobility: colors.info,
  carry: colors.textSecondary,
};

/** Tiny SVG “form hint” glyph per movement pattern — shown beside exercise names. */
export function PatternIcon({
  pattern,
  size = 28,
  active,
}: {
  pattern: MovementPattern;
  size?: number;
  active?: boolean;
}) {
  const stroke = active ? colors.accentInk : PATTERN_COLOR[pattern] || colors.accent;
  const bg = active ? colors.accent : colors.surface;
  const border = active ? colors.accent : colors.border;

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size + 8,
          height: size + 8,
          borderRadius: (size + 8) / 2,
          backgroundColor: bg,
          borderColor: border,
        },
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 32 32">
        {glyph(pattern, stroke)}
      </Svg>
    </View>
  );
}

function glyph(pattern: MovementPattern, stroke: string) {
  const s = stroke;
  switch (pattern) {
    case "squat":
      return (
        <G>
          {/* torso + bent knees silhouette hint */}
          <Circle cx="16" cy="7" r="3" stroke={s} strokeWidth="1.8" fill="none" />
          <Path
            d="M11 12 L16 14 L21 12 M12 14 L10 24 M20 14 L22 24 M10 24 L14 22 L18 22 L22 24"
            stroke={s}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
      );
    case "hinge":
      return (
        <G>
          <Circle cx="10" cy="9" r="2.6" stroke={s} strokeWidth="1.8" fill="none" />
          <Path
            d="M12 11 L18 16 L26 14 M18 16 L16 26 M18 16 L24 24"
            stroke={s}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
      );
    case "push":
      return (
        <G>
          <Circle cx="16" cy="8" r="2.6" stroke={s} strokeWidth="1.8" fill="none" />
          <Path
            d="M8 14 L24 14 M10 14 L8 24 M22 14 L24 24 M16 14 L16 22"
            stroke={s}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
          <Path d="M6 12 L8 14 L6 16" stroke={s} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <Path d="M26 12 L24 14 L26 16" stroke={s} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </G>
      );
    case "pull":
      return (
        <G>
          <Circle cx="16" cy="8" r="2.6" stroke={s} strokeWidth="1.8" fill="none" />
          <Path
            d="M10 13 L22 13 M12 13 L10 24 M20 13 L22 24"
            stroke={s}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
          <Path d="M8 16 L4 16 M24 16 L28 16" stroke={s} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </G>
      );
    case "lunge":
      return (
        <G>
          <Circle cx="14" cy="7" r="2.6" stroke={s} strokeWidth="1.8" fill="none" />
          <Path
            d="M14 10 L15 16 M15 16 L10 26 M15 16 L24 22 M24 22 L26 26"
            stroke={s}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>
      );
    case "core":
      return (
        <G>
          <EllipseHint s={s} />
          <Path
            d="M16 10 L16 22 M12 14 L20 14 M13 18 L19 18"
            stroke={s}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        </G>
      );
    case "mobility":
      return (
        <G>
          <Circle cx="16" cy="16" r="9" stroke={s} strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
          <Path
            d="M16 8 A8 8 0 0 1 24 16"
            stroke={s}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <Circle cx="24" cy="16" r="2" fill={s} />
        </G>
      );
    case "carry":
      return (
        <G>
          <Circle cx="16" cy="7" r="2.6" stroke={s} strokeWidth="1.8" fill="none" />
          <Path
            d="M16 10 L16 22 M12 14 L8 18 M20 14 L24 18 M12 22 L20 22"
            stroke={s}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
          <Rect x="6" y="17" width="4" height="5" rx="1" stroke={s} strokeWidth="1.4" fill="none" />
          <Rect x="22" y="17" width="4" height="5" rx="1" stroke={s} strokeWidth="1.4" fill="none" />
        </G>
      );
    default:
      return <Circle cx="16" cy="16" r="8" stroke={s} strokeWidth="1.8" fill="none" />;
  }
}

function EllipseHint({ s }: { s: string }) {
  return (
    <Path
      d="M16 6 C22 6 26 10 26 16 C26 22 22 26 16 26 C10 26 6 22 6 16 C6 10 10 6 16 6"
      stroke={s}
      strokeWidth="1.5"
      fill="none"
    />
  );
}

/** Dashed “form scan” mark — unique FitBrother motif (not a typical gym badge). */
export function FormScanMark({ size = 36, color = colors.accent }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36">
      <Circle
        cx="18"
        cy="18"
        r="14"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4 3"
      />
      <Circle cx="18" cy="18" r="5" stroke={color} strokeWidth="1.5" fill="none" />
      <Line x1="18" y1="2" x2="18" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="18" y1="28" x2="18" y2="34" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="2" y1="18" x2="8" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="28" y1="18" x2="34" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
