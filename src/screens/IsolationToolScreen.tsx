import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Move, Crosshair, Check, Search, ChevronRight, TriangleAlert } from "lucide-react-native";
import { AppHeader } from "../components/AppHeader";
import { ProductSelector } from "../components/ProductSelector";
import { InfoPanel } from "../components/InfoPanel";
import { MapControls } from "../components/MapControls";
import { IsolationMap } from "../components/IsolationMap";
import { useLocation } from "../hooks/useLocation";
import { DangerousGood, LatLng, Units } from "../types";
import { colors, radius, shadow, spacing } from "../theme";

// Platform-neutral region type (the native map maps it onto react-native-maps' Region).
type Region = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };

// Sensible default view (London, Ontario) until we have a location or incident.
const DEFAULT_REGION: Region = { latitude: 42.9849, longitude: -81.2453, latitudeDelta: 0.08, longitudeDelta: 0.08 };

// Great-circle distance in metres between two coordinates (Haversine).
function distanceM(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

type ScreenProps = { locationApi: ReturnType<typeof useLocation> };

export function IsolationToolScreen({ locationApi }: ScreenProps) {
  const { location, error, requestLocation } = locationApi;

  const [selected, setSelected] = useState<DangerousGood | null>(null);
  const [incident, setIncident] = useState<LatLng | null>(null);
  const [settingIncident, setSettingIncident] = useState(false);
  const [zoneVisible, setZoneVisible] = useState(true);
  const [units, setUnits] = useState<Units>("m");
  const [focus, setFocus] = useState<{ center: LatLng; radiusM: number; key: number } | null>(null);
  // Current map centre, kept in sync so "Confirm incident" can drop the pin under the crosshair.
  const [mapCenter, setMapCenter] = useState<LatLng>({ latitude: DEFAULT_REGION.latitude, longitude: DEFAULT_REGION.longitude });
  const [pickerOpen, setPickerOpen] = useState(false);

  const centerOn = useCallback((c: LatLng, radiusM = 600) => {
    setFocus({ center: c, radiusM, key: Date.now() });
  }, []);

  // On the first location fix, fly to the user so a nearby incident (100–300 m) is already in view.
  const centeredOnce = useRef(false);
  useEffect(() => {
    if (location && !centeredOnce.current) {
      centeredOnce.current = true;
      centerOn(location, 250);
    }
  }, [location, centerOn]);

  const handleUseCurrent = useCallback(async () => {
    const loc = location ?? (await requestLocation());
    if (!loc) return;
    setSettingIncident(false);
    if (incident) {
      // An incident is already placed — never move it. Just recenter the map to
      // show the responder relative to the incident (fit both points in view).
      const d = distanceM(loc, incident);
      const mid = { latitude: (loc.latitude + incident.latitude) / 2, longitude: (loc.longitude + incident.longitude) / 2 };
      centerOn(mid, Math.max(d / 2 + 100, selected?.protectiveM ?? selected?.isolationM ?? 250));
    } else {
      // No incident yet — "Use current location" sets the incident here.
      setIncident(loc);
      centerOn(loc, selected?.protectiveM ?? selected?.isolationM ?? 250);
    }
  }, [location, requestLocation, centerOn, selected, incident]);

  // Tapping the map while placing also drops the incident there.
  const handleMapPress = useCallback(
    (c: LatLng) => {
      if (!settingIncident) return;
      setIncident(c);
      setSettingIncident(false);
      centerOn(c, selected?.protectiveM ?? selected?.isolationM ?? 250);
    },
    [settingIncident, centerOn, selected]
  );

  const handleConfirmIncident = useCallback(() => {
    setIncident(mapCenter);
    setSettingIncident(false);
    centerOn(mapCenter, selected?.protectiveM ?? selected?.isolationM ?? 250);
  }, [mapCenter, centerOn, selected]);

  const handleReset = useCallback(() => {
    // Return the screen to its first-open state.
    setSelected(null);
    setIncident(null);
    setSettingIncident(false);
    setZoneVisible(true);
    setUnits("m");
    setFocus({ center: { latitude: DEFAULT_REGION.latitude, longitude: DEFAULT_REGION.longitude }, radiusM: 4000, key: Date.now() });
  }, []);

  const onSelectGood = useCallback(
    (g: DangerousGood) => {
      setSelected(g);
      if (incident) centerOn(incident, g.protectiveM ?? g.isolationM);
    },
    [incident, centerOn]
  );

  const showCircle = useMemo(() => !!(incident && selected && zoneVisible), [incident, selected, zoneVisible]);
  const zoneEnabled = !!(incident && selected);

  // Safety check: is the responder's own GPS position inside a hazard zone?
  const zoneAlert = useMemo<null | "isolation" | "protective">(() => {
    if (!location || !incident || !selected) return null;
    const d = distanceM(location, incident);
    if (d <= selected.isolationM) return "isolation";
    if (d <= selected.protectiveM) return "protective";
    return null;
  }, [location, incident, selected]);

  return (
    <View style={styles.root}>
      <AppHeader />

      <View style={styles.mapWrap}>
        <IsolationMap
          initialRegion={DEFAULT_REGION}
          incident={incident}
          userLocation={location}
          selected={selected}
          showCircle={showCircle}
          onMapPress={handleMapPress}
          onCenterChange={setMapCenter}
          focus={focus}
        />

        {zoneAlert && !settingIncident && (
          <View style={[styles.alert, zoneAlert === "isolation" ? styles.alertCritical : styles.alertWarn]}>
            <TriangleAlert size={20} color={colors.paper} />
            <View style={styles.alertBody}>
              <Text style={styles.alertTitle}>
                {zoneAlert === "isolation" ? "You are inside the isolation zone" : "You are inside the protective-action zone"}
              </Text>
              <Text style={styles.alertText}>
                {zoneAlert === "isolation"
                  ? "Leave now — move away from the incident, upwind, to safe distance."
                  : "Move away from the area and follow responder direction."}
              </Text>
            </View>
          </View>
        )}

        {settingIncident ? (
          <>
            <View style={styles.setBanner}>
              <Move size={13} color={colors.paper} />
              <Text style={styles.setBannerText}>Drag the map so the crosshair sits on the incident</Text>
            </View>
            <View style={styles.crosshairWrap} pointerEvents="none">
              <Crosshair size={42} color={colors.ink} />
            </View>
            <View style={styles.confirmWrap}>
              <Pressable style={({ pressed }) => [styles.confirmBtn, pressed && styles.pressed]} onPress={handleConfirmIncident}>
                <Check size={16} color={colors.paper} />
                <Text style={styles.confirmText}>Confirm incident location</Text>
              </Pressable>
            </View>
          </>
        ) : null}

        {!selected && !settingIncident && (
          <Pressable style={({ pressed }) => [styles.selectBanner, pressed && styles.pressed]} onPress={() => setPickerOpen(true)}>
            <Search size={14} color={colors.paper} />
            <Text style={styles.selectBannerText}>Select a dangerous good to draw its isolation zone</Text>
            <ChevronRight size={16} color={colors.paper} />
          </Pressable>
        )}

        {error && !settingIncident && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{error}</Text>
          </View>
        )}
      </View>

      <View style={styles.sheet}>
        <ScrollView style={styles.sheetScroll} contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
          {selected ? (
            <InfoPanel good={selected} units={units} onChangeProduct={() => setPickerOpen(true)} />
          ) : (
            <Text style={styles.help}>Tap “Select a dangerous good” above, then set the incident to draw the isolation zone.</Text>
          )}
        </ScrollView>

        {/* Toolbar stays pinned and always visible — Locate/Incident/Zone/Reset must be reachable. */}
        <View style={styles.toolbarWrap}>
          <MapControls
            onUseCurrent={handleUseCurrent}
            onSetIncident={() => setSettingIncident((s) => !s)}
            onToggleZone={() => setZoneVisible((z) => !z)}
            onReset={handleReset}
            settingIncident={settingIncident}
            zoneVisible={zoneVisible}
            zoneEnabled={zoneEnabled}
            units={units}
            onToggleUnits={() => setUnits((u) => (u === "m" ? "km" : "m"))}
          />
        </View>
      </View>

      <ProductSelector visible={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={onSelectGood} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  mapWrap: { flex: 1, overflow: "hidden" },
  setBanner: { position: "absolute", top: spacing.md, left: spacing.md, right: spacing.md, backgroundColor: colors.ink, flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 11, paddingVertical: 9, borderRadius: radius.md, zIndex: 1000 },
  setBannerText: { color: colors.paper, fontSize: 11.5, fontWeight: "600", flex: 1 },
  crosshairWrap: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", zIndex: 1000 },
  confirmWrap: { position: "absolute", bottom: spacing.md, left: spacing.md, right: spacing.md, zIndex: 1001 },
  confirmBtn: { height: 46, borderRadius: radius.md, backgroundColor: colors.ink, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  confirmText: { color: colors.paper, fontSize: 14, fontWeight: "700" },
  pressed: { opacity: 0.85 },
  banner: { position: "absolute", bottom: spacing.md, left: spacing.md, right: spacing.md, backgroundColor: colors.redWash, borderColor: colors.hmRed, borderWidth: 1, borderRadius: radius.sm, padding: spacing.md, zIndex: 1000 },
  bannerText: { color: colors.hmRedDeep, fontSize: 13 },
  selectBanner: { position: "absolute", top: spacing.md, left: spacing.md, right: spacing.md, backgroundColor: colors.ink, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 11, borderRadius: radius.md, zIndex: 1000, ...shadow },
  selectBannerText: { color: colors.paper, fontSize: 12, fontWeight: "600", flex: 1 },
  alert: { position: "absolute", top: spacing.md, left: spacing.md, right: spacing.md, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 13, paddingVertical: 11, borderRadius: radius.md, zIndex: 1002, ...shadow },
  alertCritical: { backgroundColor: colors.hmRed },
  alertWarn: { backgroundColor: colors.warn },
  alertBody: { flex: 1 },
  alertTitle: { color: colors.paper, fontSize: 13.5, fontWeight: "800" },
  alertText: { color: colors.paper, fontSize: 11.5, fontWeight: "500", marginTop: 1, opacity: 0.95 },
  sheet: { maxHeight: "55%", backgroundColor: colors.canvas, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, marginTop: -radius.lg, ...shadow },
  sheetScroll: { flexShrink: 1 },
  sheetContent: { padding: spacing.lg, gap: spacing.md },
  toolbarWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.canvas },
  help: { fontSize: 13, color: colors.muted, lineHeight: 19 },
});
