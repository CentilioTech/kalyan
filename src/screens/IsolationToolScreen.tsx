import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Move, Crosshair, Check, X, Search, ChevronRight, ChevronsDown, ChevronUp, TriangleAlert, Wind as WindIcon } from "lucide-react-native";
import { AppHeader } from "../components/AppHeader";
import { ProductSelector } from "../components/ProductSelector";
import { InfoPanel } from "../components/InfoPanel";
import { MapControls } from "../components/MapControls";
import { IsolationMap } from "../components/IsolationMap";
import { WindBadge } from "../components/WindBadge";
import { LockBadge } from "../components/LockBadge";
import { Glass } from "../components/Glass";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useLocation } from "../hooks/useLocation";
import { useWind } from "../hooks/useWind";
import { useZoneAlarm } from "../hooks/useZoneAlarm";
import { writeArmedConfig, disarm } from "../services/zoneStore";
import { startBackgroundZone, stopBackgroundZone } from "../services/backgroundZone";
import { resetZoneThrottle } from "../services/zoneAlert";
import { DangerousGood, LatLng, Units, WindStatus } from "../types";
import { conePolygon, coneLengthFor, windStatus } from "../utils/wind";
import { colors, radius, shadow, spacing } from "../theme";

// Platform-neutral region type (the native map maps it onto react-native-maps' Region).
type Region = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };

// Default map view until we have a location or incident (8 Connaught Ave, London, ON).
const DEFAULT_REGION: Region = { latitude: 43.000076, longitude: -81.220613, latitudeDelta: 0.05, longitudeDelta: 0.05 };

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
  const { location, error, gpsStale, requestLocation } = locationApi;

  const [selected, setSelected] = useState<DangerousGood | null>(null);
  const [incident, setIncident] = useState<LatLng | null>(null);
  const [settingIncident, setSettingIncident] = useState(false);
  const [zoneVisible, setZoneVisible] = useState(true);
  const [units, setUnits] = useState<Units>("m");
  const [focus, setFocus] = useState<{ center: LatLng; radiusM: number; key: number } | null>(null);
  // Current map centre, kept in sync so "Confirm incident" can drop the pin under the crosshair.
  const [mapCenter, setMapCenter] = useState<LatLng>({ latitude: DEFAULT_REGION.latitude, longitude: DEFAULT_REGION.longitude });
  const [pickerOpen, setPickerOpen] = useState(false);

  // Lock the setup so the incident, product and zone can't be changed by accident
  // once a responder has it dialed in. Locking commits the zone to the map, then
  // freezes Set-incident / Zone / Reset / units / change-product; only Locate
  // (recenter), the panel collapse, viewing and map zoom stay live.
  const [locked, setLocked] = useState(false);
  const toggleLock = useCallback(() => {
    setLocked((wasLocked) => {
      if (!wasLocked) setZoneVisible(true); // locking always draws/commits the product's zone
      return !wasLocked;
    });
  }, []);

  // Collapsible info panel ("converged" banner). Expanded by default; remembers its
  // last state as the responder moves around so it stays out of the way once collapsed.
  const [panelExpanded, setPanelExpanded] = useState(true);
  const panelExpandedRef = useRef(true);
  panelExpandedRef.current = panelExpanded;
  // Instant (no LayoutAnimation): a snap toggle is 100% reliable — animating the
  // floating sheet's resize was crash-prone on Android, and snappy is fine in the field.
  const setPanelAnimated = useCallback((v: boolean) => {
    setPanelExpanded(v);
  }, []);
  // Plain tap toggle on the handle — a Pressable, so it works reliably every time
  // (the previous PanResponder could get stuck after a toggle or two).
  const togglePanel = useCallback(() => setPanelAnimated(!panelExpandedRef.current), [setPanelAnimated]);

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
    const loc = (await requestLocation()) ?? location; // take a FRESH GPS fix on Locate so the incident matches the live position, not a stale watch value
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
    setLocked(false);
    setUnits("m");
    setFocus({ center: { latitude: DEFAULT_REGION.latitude, longitude: DEFAULT_REGION.longitude }, radiusM: 4000, key: Date.now() });
  }, []);

  // Reset is destructive — confirm with a high-contrast in-app dialog first.
  const [resetAsk, setResetAsk] = useState(false);
  const confirmReset = useCallback(() => setResetAsk(true), []);

  const onSelectGood = useCallback(
    (g: DangerousGood) => {
      setSelected(g);
      setPanelExpanded(true); // a freshly chosen product always opens expanded
      if (incident) centerOn(incident, g.protectiveM ?? g.isolationM);
    },
    [incident, centerOn]
  );

  // While re-placing the incident, show ONLY the crosshair — no zone, no old pin.
  // The zone is (re)drawn at the confirmed crosshair position once the user confirms.
  const showCircle = useMemo(() => !!(incident && selected && zoneVisible && !settingIncident), [incident, selected, zoneVisible, settingIncident]);
  const zoneEnabled = !!(incident && selected);

  // Live wind read at the INCIDENT (Open-Meteo); drives the downwind cone + status.
  const { wind } = useWind(incident);
  const coneLengthM = useMemo(() => (selected ? coneLengthFor(selected) : 0), [selected]);

  // Downwind hazard cone — only when the zone is shown, wind is present, and not calm.
  const conePoints = useMemo(() => {
    if (!showCircle || !incident || !selected || !wind || wind.calm) return null;
    return conePolygon(incident, wind, coneLengthM);
  }, [showCircle, incident, selected, wind, coneLengthM]);

  // Responder status by priority: danger › protective › downwind › clear.
  const status = useMemo<WindStatus | null>(
    () => windStatus({ user: location, incident, selected, wind, coneLengthM }),
    [location, incident, selected, wind, coneLengthM]
  );
  // Banners are only shown for actionable states (not "clear").
  const alertStatus = status === "clear" ? null : status;

  // Foreground alarm: buzz + notify "move out" while on screen and in a hazard zone.
  useZoneAlarm(alertStatus);

  // Arm the background hazard monitor whenever there's an active incident + product.
  // Persists the zone config and starts background location updates so the "move out"
  // alert fires even when the app is backgrounded or the screen is off.
  useEffect(() => {
    if (incident && selected) {
      writeArmedConfig({
        lat: incident.latitude,
        lng: incident.longitude,
        isolationM: selected.isolationM,
        protectiveM: selected.protectiveM,
        coneLengthM,
        wind: wind ? { fromDeg: wind.fromDeg, speedKmh: wind.speedKmh, calm: wind.calm } : null,
      });
      startBackgroundZone();
    } else {
      disarm();
      stopBackgroundZone();
      resetZoneThrottle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incident?.latitude, incident?.longitude, selected, coneLengthM, wind]);

  return (
    <View style={styles.root}>
      <AppHeader />

      {/* Full-height map — the floating sheet below frosts it for the glass effect. */}
      <View style={styles.mapWrap}>
        <IsolationMap
          initialRegion={DEFAULT_REGION}
          incident={settingIncident ? null : incident}
          settingIncident={settingIncident}
          userLocation={location}
          selected={selected}
          showCircle={showCircle}
          conePoints={conePoints}
          onMapPress={handleMapPress}
          onCenterChange={setMapCenter}
          focus={focus}
        />

        {alertStatus && !settingIncident && (
          <View
            style={[
              styles.alert,
              alertStatus === "danger" ? styles.alertCritical : alertStatus === "protective" ? styles.alertProtective : styles.alertDownwind,
            ]}
          >
            {alertStatus === "downwind" ? <WindIcon size={20} color={colors.paper} /> : <TriangleAlert size={20} color={colors.paper} />}
            <View style={styles.alertBody}>
              <Text style={styles.alertTitle}>
                {alertStatus === "danger"
                  ? "DANGER — inside the isolation zone"
                  : alertStatus === "protective"
                  ? "Inside the protective-action zone"
                  : "Downwind — in the wind path"}
              </Text>
              <Text style={styles.alertText}>
                {gpsStale
                  ? "GPS unavailable — based on your last known location. Move out of the area, upwind, immediately."
                  : alertStatus === "danger"
                  ? "Leave now — move away from the incident, upwind, to safe distance."
                  : alertStatus === "protective"
                  ? "Move out of the area and upwind; follow responder direction."
                  : "You're downwind of the incident. Move crosswind, out of the wind line."}
              </Text>
            </View>
          </View>
        )}

        {/* GPS lost while not (currently) flagged — disclaimer based on the last known fix. */}
        {gpsStale && !alertStatus && !settingIncident && location && (
          <View style={[styles.alert, styles.alertInfo]}>
            <TriangleAlert size={18} color={colors.paper} />
            <View style={styles.alertBody}>
              <Text style={styles.alertTitle}>GPS unavailable — using last known location</Text>
              <Text style={styles.alertText}>
                {incident && selected
                  ? "Showing information from your last GPS fix. You appear to be clear of the zones; this updates when GPS returns."
                  : "Showing information from your last GPS fix; this updates when GPS returns."}
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
              <Pressable style={({ pressed }) => [styles.cancelSetBtn, pressed && styles.pressed]} onPress={() => setSettingIncident(false)}>
                <X size={15} color={colors.ink} />
                <Text style={styles.cancelSetText}>Cancel</Text>
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
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      {/* Floating frosted-glass sheet over the map. Hidden while placing the incident
          so the crosshair + confirm own the full map. */}
      {!settingIncident && (
        <View style={styles.sheetWrap} pointerEvents="box-none">
          {/* Lock (left) + Wind compass (right) — both float on the same line just above the sheet, over the map. */}
          {incident && selected && (
            <View style={styles.badgeRow} pointerEvents="box-none">
              <View pointerEvents="auto">
                <LockBadge locked={locked} onToggle={toggleLock} />
              </View>
              {wind ? (
                <View pointerEvents="none">
                  <WindBadge wind={wind} />
                </View>
              ) : (
                <View />
              )}
            </View>
          )}

          {selected && (
            <View style={styles.collapseTabWrap} pointerEvents="box-none">
              <Pressable
                onPress={togglePanel}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={panelExpanded ? "Collapse details" : "Expand details"}
                style={({ pressed }) => [styles.collapseTab, pressed && styles.pressed]}
              >
                {panelExpanded ? <ChevronsDown size={13} color={colors.paper} /> : <ChevronUp size={13} color={colors.paper} />}
                <Text style={styles.collapseTabText}>{panelExpanded ? "Tap to collapse" : "Tap for details"}</Text>
              </Pressable>
            </View>
          )}

          <Glass style={styles.sheetGlass} intensity={50} overlay="rgba(255,255,255,0.62)" />

          <ScrollView style={styles.sheetScroll} contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
            {selected ? (
              <InfoPanel
                good={selected}
                units={units}
                wind={wind}
                collapsed={!panelExpanded}
                locked={locked}
                onChangeProduct={() => { if (!locked) setPickerOpen(true); }}
                onExpand={() => setPanelAnimated(true)}
              />
            ) : (
              <Text style={styles.help}>Tap “Select a dangerous good” above, then set the incident to draw the isolation zone.</Text>
            )}
          </ScrollView>

          {/* Toolbar stays pinned and always visible — Locate/Incident/Zone/Reset must be reachable. */}
          <View style={styles.toolbarWrap}>
            <MapControls
              onUseCurrent={handleUseCurrent}
              onSetIncident={() => { if (!locked) setSettingIncident((s) => !s); }}
              onToggleZone={() => setZoneVisible((z) => !z)}
              onReset={confirmReset}
              settingIncident={settingIncident}
              zoneVisible={zoneVisible}
              zoneEnabled={zoneEnabled}
              units={units}
              onToggleUnits={() => setUnits((u) => (u === "m" ? "km" : "m"))}
              locked={locked}
            />
          </View>
        </View>
      )}

      <ProductSelector visible={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={onSelectGood} />

      <ConfirmDialog
        visible={resetAsk}
        title="Reset?"
        message="Are you sure you want to reset? This clears the incident, product and zone."
        confirmLabel="Reset"
        cancelLabel="Cancel"
        destructive
        onCancel={() => setResetAsk(false)}
        onConfirm={() => {
          setResetAsk(false);
          handleReset();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  mapWrap: { flex: 1, overflow: "hidden" },
  setBanner: { position: "absolute", top: spacing.md, left: spacing.md, right: spacing.md, backgroundColor: colors.ink, flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 11, paddingVertical: 9, borderRadius: radius.md, zIndex: 1000 },
  setBannerText: { color: colors.paper, fontSize: 11.5, fontWeight: "600", flex: 1 },
  crosshairWrap: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", zIndex: 1000 },
  confirmWrap: { position: "absolute", bottom: spacing.xl, left: spacing.md, right: spacing.md, gap: spacing.sm, zIndex: 1001 },
  confirmBtn: { height: 46, borderRadius: radius.md, backgroundColor: colors.ink, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, ...shadow },
  confirmText: { color: colors.paper, fontSize: 14, fontWeight: "700" },
  cancelSetBtn: { height: 42, borderRadius: radius.md, backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, ...shadow },
  cancelSetText: { color: colors.ink, fontSize: 14, fontWeight: "700" },
  pressed: { opacity: 0.85 },
  errorBanner: { position: "absolute", bottom: spacing.xl, left: spacing.md, right: spacing.md, backgroundColor: colors.redWash, borderColor: colors.hmRed, borderWidth: 1, borderRadius: radius.sm, padding: spacing.md, zIndex: 1000 },
  errorText: { color: colors.hmRedDeep, fontSize: 13 },
  selectBanner: { position: "absolute", top: spacing.md, left: spacing.md, right: spacing.md, backgroundColor: colors.ink, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 11, borderRadius: radius.md, zIndex: 1000, ...shadow },
  selectBannerText: { color: colors.paper, fontSize: 12, fontWeight: "600", flex: 1 },
  alert: { position: "absolute", top: spacing.md, left: spacing.md, right: spacing.md, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 13, paddingVertical: 11, borderRadius: radius.md, zIndex: 1002, ...shadow },
  alertCritical: { backgroundColor: colors.hmRed },
  alertProtective: { backgroundColor: colors.orange },
  alertDownwind: { backgroundColor: colors.warn },
  alertInfo: { backgroundColor: colors.steel },
  alertBody: { flex: 1 },
  alertTitle: { color: colors.paper, fontSize: 13.5, fontWeight: "800" },
  alertText: { color: colors.paper, fontSize: 11.5, fontWeight: "500", marginTop: 1, opacity: 0.95 },

  // Floating sheet
  sheetWrap: { position: "absolute", left: 0, right: 0, bottom: 0, maxHeight: "55%", ...shadow },
  sheetGlass: { ...StyleSheet.absoluteFillObject, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, borderTopWidth: 1, borderColor: "rgba(255,255,255,0.5)" },
  // Lock + wind badges share one row floating just above the sheet's top edge, with
  // alignItems:flex-end so they sit on the same baseline regardless of height. Uses a
  // fixed negative top (NOT a percentage) — a percentage offset crashes Android's
  // LayoutAnimation when the sheet resizes on collapse/expand.
  badgeRow: { position: "absolute", left: spacing.md, right: spacing.md, top: -62, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", zIndex: 1001 },
  collapseTabWrap: { position: "absolute", top: -13, left: 0, right: 0, alignItems: "center", zIndex: 1003 },
  collapseTab: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.ink, paddingHorizontal: 13, paddingVertical: 6, borderRadius: radius.pill, ...shadow },
  collapseTabText: { color: colors.paper, fontSize: 11, fontWeight: "700" },
  sheetScroll: { flexShrink: 1 },
  sheetContent: { padding: spacing.lg, gap: spacing.md },
  toolbarWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
  help: { fontSize: 13, color: colors.slate, lineHeight: 19 },
});
