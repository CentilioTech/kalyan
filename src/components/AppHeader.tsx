import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Info } from "lucide-react-native";
import { colors, spacing } from "../theme";

export function AppHeader() {
  return (
    <View style={styles.bar}>
      <View style={styles.mark}>
        <Text style={styles.markText}>i</Text>
      </View>
      <View style={styles.titles}>
        <Text style={styles.brand}>HM Intel</Text>
        <Text style={styles.sub}>Isolation Distance Tool</Text>
      </View>
      <View style={styles.info}>
        <Info size={17} color={colors.slate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: spacing.lg,
    paddingVertical: 11,
    backgroundColor: colors.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  mark: { width: 30, height: 30, borderRadius: 8, backgroundColor: colors.hmRed, alignItems: "center", justifyContent: "center" },
  markText: { color: colors.paper, fontWeight: "800", fontSize: 16, fontStyle: "italic" },
  titles: { flex: 1 },
  brand: { fontSize: 15, fontWeight: "800", color: colors.ink, letterSpacing: -0.2 },
  sub: { fontSize: 10.5, fontWeight: "500", color: colors.muted, marginTop: 1 },
  info: { width: 32, height: 32, borderRadius: 9, backgroundColor: colors.canvas, alignItems: "center", justifyContent: "center" },
});
