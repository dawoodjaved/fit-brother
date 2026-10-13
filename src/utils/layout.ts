import { useMemo } from "react";
import { PixelRatio, useWindowDimensions } from "react-native";
import { spacing } from "../theme";

/** Responsive layout tokens for all Android / phone sizes. */
export function useLayout() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const shortest = Math.min(width, height);
    const isCompact = shortest < 360;
    const isTablet = shortest >= 600;
    const contentPad = isCompact ? spacing.md : spacing.lg;
    const contentWidth = Math.max(280, width - contentPad * 2);
    const mediaWidth = Math.min(contentWidth, isTablet ? 480 : 420);
    const gifHeight = Math.min(mediaWidth * (isCompact ? 0.95 : 1), isCompact ? 280 : 380);
    const bodyMapWidth = Math.min(contentWidth - 8, isTablet ? 460 : 420);
    const tabBarHeight = isCompact ? 56 : 64;
    const fontScale = Math.min(PixelRatio.getFontScale(), 1.35);

    return {
      width,
      height,
      shortest,
      isCompact,
      isTablet,
      contentPad,
      contentWidth,
      mediaWidth,
      gifHeight,
      bodyMapWidth,
      tabBarHeight,
      fontScale,
    };
  }, [width, height]);
}
