import React from "react";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";

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
 * Mostly solid with just a hint of glass — deliberately understated so a responder
 * can never misread safety-critical text.
 */
export function Glass({ intensity = 45, overlay = "rgba(255,255,255,0.7)", style, children }: Props) {
  return (
    <View style={[styles.clip, style]}>
      <BlurView
        intensity={intensity}
        tint="light"
        experimentalBlurMethod={Platform.OS === "android" ? "dimezisBlurView" : undefined}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: overlay }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ clip: { overflow: "hidden" } });
