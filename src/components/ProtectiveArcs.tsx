import React from "react";
import Svg, { Path } from "react-native-svg";
import { colors } from "../theme";

/**
 * Protective-zone glyph: three concentric curved arcs radiating outward, in the
 * protective steel colour. Used (without a label) beside the protective distance
 * in the collapsed strip and the expanded distance bar.
 */
export function ProtectiveArcs({ size = 14, color = colors.steel }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round">
      <Path d="M3.5 13a12 12 0 0 1 17 0" />
      <Path d="M7 16a7 7 0 0 1 10 0" />
      <Path d="M10.6 19a2.2 2.2 0 0 1 2.8 0" />
    </Svg>
  );
}
