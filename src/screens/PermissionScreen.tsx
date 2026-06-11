import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { MapPin, Navigation, Crosshair } from "lucide-react-native";
import { AppHeader } from "../components/AppHeader";
import { colors, radius, spacing } from "../theme";

// Screen 01 — location permission (rationale before the OS prompt), exactly per the hi-fi.
type Props = { onAllow: () => void; onManual: () => void; busy?: boolean };

export function PermissionScreen({ onAllow, onManual, busy = false }: Props) {
  return (
    <View style={styles.root}>
      <AppHeader />

      <View style={styles.hero}>
        <View style={styles.permIc}>
          <MapPin size={34} color={colors.hmRed} />
        </View>
        <Text style={styles.h3}>Use your location?</Text>
        <Text style={styles.p}>
          HM Intel uses your position to centre the map and draw the isolation zone around the incident. You can also set the incident by hand.
        </Text>
      </View>

      <View style={styles.cta}>
        <Pressable style={({ pressed }) => [styles.btn, styles.primary, pressed && styles.pressed]} onPress={onAllow} disabled={busy}>
          {busy ? (
            <ActivityIndicator color={colors.paper} size="small" />
          ) : (
            <>
              <Navigation size={16} color={colors.paper} />
              <Text style={styles.primaryText}>Allow location</Text>
            </>
          )}
        </Pressable>
        <Pressable style={({ pressed }) => [styles.btn, styles.ghost, styles.mt, pressed && styles.pressed]} onPress={onManual} disabled={busy}>
          <Crosshair size={16} color={colors.slate} />
          <Text style={styles.ghostText}>Set incident manually</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  hero: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28, gap: 16 },
  permIc: { width: 74, height: 74, borderRadius: 22, backgroundColor: colors.redWash, alignItems: "center", justifyContent: "center" },
  h3: { fontSize: 20, fontWeight: "800", color: colors.ink },
  p: { fontSize: 13.5, lineHeight: 20, color: colors.steel, textAlign: "center" },
  cta: { padding: spacing.lg, paddingBottom: spacing.xl },
  btn: { height: 50, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1 },
  primary: { backgroundColor: colors.hmRed, borderColor: colors.hmRed },
  primaryText: { color: colors.paper, fontSize: 15, fontWeight: "700" },
  ghost: { backgroundColor: colors.paper, borderColor: colors.line },
  ghostText: { color: colors.slate, fontSize: 15, fontWeight: "600" },
  mt: { marginTop: 10 },
  pressed: { opacity: 0.85 },
});
