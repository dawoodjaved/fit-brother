import React, { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

type MotionProps = {
  children: React.ReactNode;
  index?: number;
  style?: StyleProp<ViewStyle>;
  delay?: number;
};

export function FadeInItem({ children, index = 0, style, delay = 0 }: MotionProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay + index * 55)
        .duration(420)
        .easing(Easing.out(Easing.cubic))}
      layout={Layout.springify().damping(18)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

export function FadeInHeader({ children, style }: Omit<MotionProps, "index">) {
  return (
    <Animated.View entering={FadeInUp.duration(450)} style={style}>
      {children}
    </Animated.View>
  );
}

export function PopIn({ children, style, delay = 0 }: Omit<MotionProps, "index">) {
  return (
    <Animated.View entering={ZoomIn.delay(delay).springify().damping(14)} style={style}>
      {children}
    </Animated.View>
  );
}

export function Pulse({
  children,
  style,
  active = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  active?: boolean;
}) {
  const scale = useSharedValue(1);
  useEffect(() => {
    if (!active) {
      scale.value = 1;
      return;
    }
    scale.value = withRepeat(
      withTiming(1.04, { duration: 900, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [active, scale]);

  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <Animated.View style={[anim, style]}>{children}</Animated.View>;
}
