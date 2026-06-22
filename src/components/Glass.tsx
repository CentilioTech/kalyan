import React from "react";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";

const isWeb = Platform.OS === "web";

type Props = {
  /** Blur strength. Keep modest so the surface stays mostly solid and readable. */
  intensity?: number;
  /** Tint fill painted over the blur — controls how solid (readable) the surface is. */
  overlay?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/**
 * A subtle frosted-glass surface, like an iOS notification banner: a real blur of
 * whatever is behind it, plus a light tint so the content stays clearly readable.
 *
 * Stacking: on native, children added after the blur/overlay naturally paint on
 * top. On web (react-native-web), absolutely-positioned siblings paint ABOVE
 * in-flow content, so a raw SVG icon would be hidden behind the blur tint (the
 * lock badge symptom). We fix this on web by making the container a stacking
 * context and pushing the blur + tint behind the content (zIndex -1).
 */
export function Glass({ intensity = 45, overlay = "rgba(255,255,255,0.7)", style, children }: Props) {
  return (
    <View style={[styles.clip, isWeb && styles.webContext, style]}>
      <BlurView
        intensity={intensity}
        tint="light"
        experimentalBlurMethod={Platform.OS === "android" ? "dimezisBlurView" : undefined}
        style={[StyleSheet.absoluteFill, isWeb && styles.webBehind]}
      />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, isWeb && styles.webBehind, { backgroundColor: overlay }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: "hidden" },
  // Web only: establish a stacking context so the blur/tint can sit behind content.
  webContext: { position: "relative", zIndex: 0 },
  webBehind: { zIndex: -1 },
});
