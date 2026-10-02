import React from "react";
import { Image, ImageStyle, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { APP_LOGO, APP_MOTTO, APP_NAME, APP_TAGLINE } from "../brand";
import { colors, spacing } from "../theme";
import { AppText } from "./AppText";

type Variant = "hero" | "header" | "mark" | "auth";

const SIZES: Record<Variant, number> = {
  hero: 168,
  auth: 112,
  header: 44,
  mark: 36,
};

type Props = {
  variant?: Variant;
  /** Show tagline / motto under the mark (hero & auth). */
  showCaption?: boolean;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

/**
 * FitBrother brand mark — always use this instead of raw text labels for recognition.
 * The asset already includes the wordmark; captions reinforce the unique tagline.
 */
export function BrandLogo({
  variant = "header",
  showCaption,
  style,
  imageStyle,
}: Props) {
  const size = SIZES[variant];
  const caption = showCaption ?? (variant === "hero" || variant === "auth");

  return (
    <View
      style={[
        styles.wrap,
        variant === "hero" || variant === "auth" ? styles.centered : null,
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={APP_NAME}
    >
      <Image
        source={APP_LOGO}
        style={[
          {
            width: size,
            height: size,
            borderRadius: variant === "mark" || variant === "header" ? size * 0.22 : spacing.md,
          },
          styles.image,
          imageStyle,
        ]}
        resizeMode="cover"
      />
      {caption ? (
        <View style={styles.caption}>
          {variant === "hero" ? (
            <>
              <AppText variant="label" style={styles.eyebrow}>
                {APP_NAME.toUpperCase()}
              </AppText>
              <AppText
                variant="caption"
                color={colors.accent}
                style={{ marginTop: 4, textAlign: "center" }}
              >
                {APP_TAGLINE}
              </AppText>
            </>
          ) : (
            <AppText
              variant="caption"
              color={colors.textMuted}
              style={{ marginTop: spacing.sm, textAlign: "center" }}
            >
              {APP_MOTTO}
            </AppText>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "flex-start",
  },
  centered: {
    alignItems: "center",
    alignSelf: "center",
  },
  image: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    backgroundColor: colors.bgElevated,
  },
  caption: {
    alignItems: "center",
    marginTop: spacing.sm,
    maxWidth: 280,
  },
  eyebrow: {
    letterSpacing: 1.2,
  },
});
