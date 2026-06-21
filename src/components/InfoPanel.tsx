import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Shield, Phone, TriangleAlert, ChevronDown, Wind as WindIcon } from "lucide-react-native";
import { DangerousGood, Units, Wind } from "../types";
import { colors, radius, spacing } from "../theme";
import { compass8 } from "../utils/wind";
import { HazardPlacard } from "./HazardPlacard";

type Props = { good: DangerousGood; units: Units; wind?: Wind | null; collapsed?: boolean; locked?: boolean; onChangeProduct?: () => void; onExpand?: () => void };

const fmt = (m: number, units: Units) => (units === "km" ? `${(m / 1000).toFixed(m % 1000 === 0 ? 0 : 2)} km` : `${m} m`);

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.kv}>
      <Text style={styles.k}>{label}</Text>
      <Text style={styles.v}>{value}</Text>
    </View>
  );
}

/** Dangerous-goods information panel shown once a product is selected. */
export function InfoPanel({ good, units, wind, collapsed, locked, onChangeProduct, onExpand }: Props) {
  // Converged state: show only the header strip (placard · UN/name · ERG); tap to expand.
  if (collapsed) {
    return (
      <Pressable
        style={[styles.card, styles.cardCollapsed]}
        onPress={onExpand}
        accessibilityRole="button"
        accessibilityLabel={`${good.un} ${good.name}. Tap for details`}
      >
        <View style={[styles.header, styles.headerCollapsed]}>
          {/* UN number on the LEFT */}
          <View style={styles.collapsedLeft}>
            <HazardPlacard hazardClass={good.hazardClass} size={34} />
            <View style={styles.collapsedId}>
              <Text style={styles.un} numberOfLines={1}>{good.un}</Text>
              <Text style={styles.name} numberOfLines={1}>{good.name}</Text>
            </View>
          </View>
          {/* Isolation (red shield) + protective (broken circle) distances — side by side, centered, no words. */}
          <View style={styles.collapsedMid}>
            <View style={styles.collapsedMetric}>
              <Shield size={14} color={colors.hmRed} />
              <Text style={styles.collapsedIso}>{fmt(good.isolationM, units)}</Text>
            </View>
            <View style={styles.collapsedMetric}>
              <View style={styles.collapsedDot} />
              <Text style={styles.collapsedProt}>{fmt(good.protectiveM, units)}</Text>
            </View>
          </View>
          {/* ERG number on the RIGHT */}
          <View style={styles.collapsedRight}>
            <View style={styles.erg}>
              <Text style={styles.ergLabel}>ERG</Text>
              <Text style={styles.ergNum}>{good.ergGuide}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={locked ? undefined : onChangeProduct} disabled={locked}>
        <HazardPlacard hazardClass={good.hazardClass} size={38} />
        <View style={{ flex: 1 }}>
          <Text style={styles.un}>{good.un}</Text>
          <Text style={styles.name}>{good.name}</Text>
        </View>
        <View style={styles.erg}>
          <Text style={styles.ergLabel}>ERG</Text>
          <Text style={styles.ergNum}>{good.ergGuide}</Text>
        </View>
        {/* The chevron is the "change product" affordance — hidden while locked. */}
        {!locked && <ChevronDown size={18} color={colors.muted} />}
      </Pressable>

      <View style={styles.distBar}>
        <View style={[styles.dist, styles.distIso]}>
          <View style={styles.distLbl}>
            <Shield size={11} color={colors.hmRedDeep} />
            <Text style={styles.distLblIso}>ISOLATION</Text>
          </View>
          <Text style={styles.distNumIso}>{fmt(good.isolationM, units)}</Text>
        </View>
        <View style={[styles.dist, styles.distProt]}>
          <View style={styles.distLbl}>
            <View style={styles.dotProt} />
            <Text style={styles.distLblProt}>PROTECTIVE</Text>
          </View>
          <Text style={styles.distNumProt}>{fmt(good.protectiveM, units)}</Text>
          <Text style={styles.distFt}>all directions</Text>
        </View>
      </View>

      {wind && (
        <>
          <View style={styles.windRow}>
            <WindIcon size={14} color={colors.steel} />
            <Text style={styles.windLabel}>Wind (at incident)</Text>
            <Text style={styles.windVal}>
              {wind.calm ? "Calm · <3 km/h" : `From ${compass8(wind.fromDeg)} · ${Math.round(wind.speedKmh)} km/h`}
            </Text>
          </View>
          <Text style={styles.windCaption}>Modeled (Open-Meteo) · confirm on scene</Text>
        </>
      )}

      <Row label="Hazard class" value={good.hazardClass} />
      <Row label="Shipping name" value={good.name} />
      <Row label="Emergency contact" value="CANUTEC" />

      <Pressable style={styles.call} onPress={() => Linking.openURL("tel:18882268832")}>
        <Phone size={15} color={colors.paper} />
        <Text style={styles.callText}>Call CANUTEC · *666</Text>
      </Pressable>

      <View style={styles.disc}>
        <TriangleAlert size={13} color={colors.hmRedDeep} />
        <Text style={styles.discText}>Placeholder data — always verify against the current ERG on scene.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.paper, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: spacing.lg },
  cardCollapsed: { paddingVertical: spacing.md },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.md },
  headerCollapsed: { marginBottom: 0 },
  collapsedLeft: { flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 1, minWidth: 0 },
  collapsedId: { flexShrink: 1, minWidth: 0 },
  collapsedMid: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 },
  collapsedRight: { flexShrink: 0, alignItems: "flex-end" },
  collapsedMetric: { flexDirection: "row", alignItems: "center", gap: 5 },
  collapsedIso: { fontSize: 14, fontWeight: "800", color: colors.hmRed },
  collapsedProt: { fontSize: 14, fontWeight: "800", color: colors.steel },
  collapsedDot: { width: 13, height: 13, borderRadius: 7, borderWidth: 2, borderColor: colors.steel, borderStyle: "dashed" },
  un: { fontSize: 16, fontWeight: "800", color: colors.ink, letterSpacing: -0.2 },
  name: { fontSize: 12, color: colors.steel, marginTop: 1 },
  erg: { backgroundColor: colors.ink, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, alignItems: "center" },
  ergLabel: { fontSize: 7.5, letterSpacing: 1, color: "rgba(255,255,255,0.7)", fontWeight: "700" },
  ergNum: { fontSize: 13, fontWeight: "800", color: colors.paper },
  distBar: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.sm },
  dist: { flex: 1, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: spacing.md },
  distIso: { backgroundColor: colors.redWash, borderColor: "#F3CFCF" },
  distProt: { backgroundColor: "#EEF1F4", borderColor: "#D9DEE5" },
  distLbl: { flexDirection: "row", alignItems: "center", gap: 5 },
  distLblIso: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5, color: colors.hmRedDeep },
  distLblProt: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5, color: colors.steel },
  dotProt: { width: 9, height: 9, borderRadius: 5, borderWidth: 1.5, borderColor: colors.steel, borderStyle: "dashed" },
  distNumIso: { fontSize: 21, fontWeight: "800", color: colors.hmRed, marginTop: 3 },
  distNumProt: { fontSize: 21, fontWeight: "800", color: colors.steel, marginTop: 3 },
  distFt: { fontSize: 8.5, color: colors.muted, marginTop: 2 },
  legend: { flexDirection: "row", gap: spacing.lg, marginBottom: spacing.sm, paddingVertical: 2 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  sw: { width: 12, height: 12, borderRadius: 3 },
  swProt: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.steel, borderStyle: "dashed" },
  legendText: { fontSize: 11, color: colors.slate, fontWeight: "600" },
  windRow: { flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: colors.canvas, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 10, paddingVertical: 9, marginTop: spacing.sm },
  windLabel: { fontSize: 11.5, color: colors.slate, fontWeight: "600" },
  windVal: { marginLeft: "auto", fontSize: 12, fontWeight: "800", color: colors.ink },
  windCaption: { fontSize: 9, color: colors.muted, textAlign: "right", marginTop: 4 },
  kv: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.canvas },
  k: { fontSize: 12, color: colors.muted },
  v: { fontSize: 12.5, fontWeight: "700", color: colors.ink },
  call: { marginTop: spacing.md, height: 44, borderRadius: radius.md, backgroundColor: colors.ink, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  callText: { color: colors.paper, fontSize: 13, fontWeight: "700" },
  disc: { flexDirection: "row", gap: 7, alignItems: "flex-start", backgroundColor: colors.redWash, borderRadius: radius.sm, padding: 10, marginTop: spacing.md },
  discText: { flex: 1, fontSize: 10.5, lineHeight: 15, color: colors.hmRedDeep },
});
