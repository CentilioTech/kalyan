import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Maps a DG hazard class to a placard colour, echoing the real diamond placards:
// flammable = red, corrosive = dark, toxic/oxidiser = light/amber.
export function placardStyle(hazardClass: string): { bg: string; fg: string; border?: string } {
  const c = hazardClass.split("/")[0];
  if (c.startsWith("3") || c.startsWith("2.1")) return { bg: "#E22B2B", fg: "#FFFFFF" };
  if (c.startsWith("8")) return { bg: "#222A33", fg: "#FFFFFF" };
  if (c.startsWith("2.3") || c.startsWith("6")) return { bg: "#EEF1F4", fg: "#14181F", border: "#CDD3DA" };
  if (c.startsWith("5")) return { bg: "#9A6A00", fg: "#FFFFFF" };
  return { bg: "#5B6B7B", fg: "#FFFFFF" };
}

/** A rotated hazard-class diamond placard with the class number upright inside. */
export function HazardPlacard({ hazardClass, size = 34 }: { hazardClass: string; size?: number }) {
  const s = placardStyle(hazardClass);
  const num = hazardClass.split("/")[0].split(".")[0];
  const inner = size * 0.76;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={[
          styles.diamond,
          { width: inner, height: inner, backgroundColor: s.bg, borderRadius: Math.max(5, size * 0.16) },
          s.border ? { borderWidth: 1, borderColor: s.border } : null,
        ]}
      >
        <Text style={{ transform: [{ rotate: "-45deg" }], color: s.fg, fontWeight: "800", fontSize: size * 0.36 }}>{num}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  diamond: { transform: [{ rotate: "45deg" }], alignItems: "center", justifyContent: "center" },
});
