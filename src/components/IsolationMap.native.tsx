import React, { useEffect, useRef } from "react";
import { Platform, StyleSheet } from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

// Android -> Google Maps (needs a key); iOS -> native Apple Maps (no key/pods needed).
const MAP_PROVIDER = Platform.OS === "android" ? PROVIDER_GOOGLE : undefined;
import { DangerousGood, LatLng } from "../types";
import { colors } from "../theme";

// Native map (iOS + Android) using react-native-maps with the Google provider.
// On a real device this is the proper native Google map; the web build uses
// IsolationMap.web.tsx instead (Metro resolves the platform extension).
export interface IsolationMapProps {
  initialRegion: Region;
  incident: LatLng | null;
  userLocation: LatLng | null;
  selected: DangerousGood | null;
  showCircle: boolean;
  onMapPress: (c: LatLng) => void;
  onCenterChange?: (c: LatLng) => void;
  focus: { center: LatLng; radiusM: number; key: number } | null;
}

export function IsolationMap({ initialRegion, incident, selected, showCircle, onMapPress, onCenterChange, focus }: IsolationMapProps) {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!focus) return;
    const delta = Math.max(0.004, (focus.radiusM * 2.5) / 111000);
    mapRef.current?.animateToRegion(
      { ...focus.center, latitudeDelta: delta, longitudeDelta: delta },
      500
    );
  }, [focus]);

  return (
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      provider={MAP_PROVIDER}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton={false}
      onPress={(e) => onMapPress(e.nativeEvent.coordinate)}
      onRegionChangeComplete={(r) => onCenterChange?.({ latitude: r.latitude, longitude: r.longitude })}
    >
      {incident && (
        <Marker
          coordinate={incident}
          title="Incident"
          description={selected ? `${selected.un} · ${selected.name}` : "Tap a product to assess"}
          pinColor={colors.hmRed}
        />
      )}
      {showCircle && incident && selected && (
        <Circle
          center={incident}
          radius={selected.protectiveM}
          strokeColor={colors.steel}
          strokeWidth={2}
          lineDashPattern={[6, 6]}
          fillColor="rgba(91,107,123,0.07)"
        />
      )}
      {showCircle && incident && selected && (
        <Circle
          center={incident}
          radius={selected.isolationM}
          strokeColor={colors.hmRed}
          strokeWidth={2}
          fillColor="rgba(192,23,24,0.16)"
        />
      )}
    </MapView>
  );
}
