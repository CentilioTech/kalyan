import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ArrowUp, Minus } from "lucide-react-native";
import { Wind } from "../types";
import { colors, radius, shadow } from "../theme";
import { compass8, downwindBearing } from "../utils/wind";

/**
 * Compact compass badge showing the wind read at the incident.
 * The arrow points DOWNWIND (the way a plume travels); the label shows where it's FROM.
 */
export function WindBadge({ wind }: { wind: Wind | null }) {
  if (!wind) return null;
  return (
    <View style={styles.badge}>
      {wind.calm ? (
        <Minus size={18} color={colors.steel} />
      ) : (
        <ArrowUp size={18} color={colors.hmRed} style={{ transform: [{ rotate: `${downwindBearing(wind)}deg` }] }} />
      )}
      <Text style={styles.dir}>{wind.calm ? "CALM" : `${compass8(wind.fromDeg)}→`}</Text>
      <Text style={styles.spd}>{wind.calm ? "<3 km/h" : `${Math.round(wind.speedKmh)} km/h`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 56,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    paddingVertical: 7,
    gap: 1,
    ...shadow,
  },
  dir: { fontSize: 11, fontWeight: "800", color: colors.ink, marginTop: 2 },
  spd: { fontSize: 8, fontWeight: "600", color: colors.muted, letterSpacing: 0.2 },
});
