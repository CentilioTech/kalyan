import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Lock, LockOpen } from "lucide-react-native";
import { colors, radius } from "../theme";
import { Glass } from "./Glass";

/**
 * Lock control on the map (bottom-left, mirroring the wind badge). White frosted
 * pill = unlocked (tap to lock); frosted red = locked (tap to unlock).
 */
export function LockBadge({ locked, onToggle }: { locked: boolean; onToggle: () => void }) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={locked ? "Setup locked. Tap to unlock." : "Tap to lock the setup."}
      style={({ pressed }) => (pressed ? styles.pressed : undefined)}
    >
      <Glass
        style={[styles.badge, locked && styles.badgeOn]}
        intensity={45}
        overlay={locked ? "rgba(192,23,24,0.85)" : "rgba(255,255,255,0.62)"}
      >
        {locked ? <Lock size={15} color={colors.paper} /> : <LockOpen size={15} color={colors.slate} />}
        <Text style={[styles.label, locked && styles.labelOn]}>{locked ? "Locked" : "Lock"}</Text>
      </Glass>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 11, paddingVertical: 8 },
  badgeOn: { borderColor: colors.hmRed },
  pressed: { opacity: 0.85 },
  label: { fontSize: 11, fontWeight: "800", color: colors.ink, letterSpacing: 0.2 },
  labelOn: { color: colors.paper },
});
