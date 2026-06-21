import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LocateFixed, MapPinPlus, CircleDashed, CircleDot, RotateCcw, LucideIcon } from "lucide-react-native";
import { Units } from "../types";
import { colors, radius, spacing } from "../theme";

type Props = {
  onUseCurrent: () => void;
  onSetIncident: () => void;
  onToggleZone: () => void;
  onReset: () => void;
  settingIncident: boolean;
  zoneVisible: boolean;
  zoneEnabled: boolean;
  units: Units;
  onToggleUnits: () => void;
  /** When the setup is locked, editing the incident or resetting is frozen. */
  locked?: boolean;
};

function Tool({ Icon, label, onPress, active = false, disabled = false }: { Icon: LucideIcon; label: string; onPress: () => void; active?: boolean; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.tool, pressed && !disabled && styles.pressed]}>
      <View style={[styles.tile, active && styles.tileActive, disabled && styles.tileDisabled]}>
        <Icon size={19} color={active ? colors.paper : disabled ? colors.muted : colors.slate} />
      </View>
      <Text style={[styles.toolLabel, active && styles.toolLabelActive, disabled && styles.toolLabelDisabled]}>{label}</Text>
    </Pressable>
  );
}

export function MapControls(p: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.unitsRow}>
        <Text style={[styles.unitsLabel, p.locked && styles.unitsLabelLocked]}>Distance units</Text>
        <View style={[styles.seg, p.locked && styles.segLocked]}>
          <Pressable disabled={p.locked} onPress={() => p.units !== "m" && p.onToggleUnits()} style={[styles.segBtn, p.units === "m" && styles.segOn]}>
            <Text style={[styles.segText, p.units === "m" && styles.segTextOn]}>m</Text>
          </Pressable>
          <Pressable disabled={p.locked} onPress={() => p.units !== "km" && p.onToggleUnits()} style={[styles.segBtn, p.units === "km" && styles.segOn]}>
            <Text style={[styles.segText, p.units === "km" && styles.segTextOn]}>km</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.toolbar}>
        <Tool Icon={LocateFixed} label="Locate" onPress={p.onUseCurrent} active />
        <Tool Icon={MapPinPlus} label="Incident" onPress={p.onSetIncident} active={p.settingIncident} disabled={p.locked} />
        <Tool Icon={p.zoneVisible ? CircleDot : CircleDashed} label="Zone" onPress={p.onToggleZone} disabled={p.locked || !p.zoneEnabled} />
        <Tool Icon={RotateCcw} label="Reset" onPress={p.onReset} disabled={p.locked} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  unitsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  unitsLabel: { fontSize: 12, color: colors.slate, fontWeight: "600" },
  unitsLabelLocked: { color: colors.muted, opacity: 0.6 },
  seg: { flexDirection: "row", borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, overflow: "hidden" },
  segLocked: { opacity: 0.4 },
  segBtn: { paddingHorizontal: 16, paddingVertical: 6 },
  segOn: { backgroundColor: colors.hmRed },
  segText: { fontSize: 12, fontWeight: "700", color: colors.muted },
  segTextOn: { color: colors.paper },
  toolbar: { flexDirection: "row", justifyContent: "space-between" },
  tool: { flex: 1, alignItems: "center", gap: 6 },
  pressed: { opacity: 0.75 },
  tile: { width: 52, height: 52, borderRadius: 14, backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  tileActive: { backgroundColor: colors.hmRed, borderColor: colors.hmRed },
  tileDisabled: { opacity: 0.6 },
  toolLabel: { fontSize: 11, fontWeight: "600", color: colors.slate },
  toolLabelActive: { color: colors.hmRed },
  toolLabelDisabled: { color: colors.muted },
});
