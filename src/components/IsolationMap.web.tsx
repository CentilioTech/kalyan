import React, { useEffect } from "react";
import { MapContainer, TileLayer, Circle, CircleMarker, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { DangerousGood, LatLng } from "../types";

// Web map (Chrome preview) using Leaflet + OpenStreetMap tiles — keyless, so the
// browser preview needs no Google Maps key. The native build never imports this
// file; Metro picks IsolationMap.native.tsx on iOS/Android.

// Load Leaflet's stylesheet once (from CDN, avoids a Metro CSS step).
if (typeof document !== "undefined" && !document.getElementById("leaflet-css")) {
  const link = document.createElement("link");
  link.id = "leaflet-css";
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  document.head.appendChild(link);
}

const incidentIcon = L.divIcon({
  className: "hm-incident",
  html:
    '<div style="width:18px;height:18px;border-radius:50% 50% 50% 0;background:#C01718;border:2px solid #fff;transform:rotate(-45deg);box-shadow:0 2px 5px rgba(0,0,0,.4)"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 18],
});

export interface IsolationMapProps {
  initialRegion: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };
  incident: LatLng | null;
  userLocation: LatLng | null;
  selected: DangerousGood | null;
  showCircle: boolean;
  onMapPress: (c: LatLng) => void;
  onCenterChange?: (c: LatLng) => void;
  focus: { center: LatLng; radiusM: number; key: number } | null;
}

function MapEvents({ onMapPress, onCenterChange }: { onMapPress: (c: LatLng) => void; onCenterChange?: (c: LatLng) => void }) {
  const map = useMapEvents({
    click(e) {
      onMapPress({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    },
    moveend() {
      const c = map.getCenter();
      onCenterChange?.({ latitude: c.lat, longitude: c.lng });
    },
  });
  useEffect(() => {
    const c = map.getCenter();
    onCenterChange?.({ latitude: c.lat, longitude: c.lng });
  }, [map]);
  return null;
}

function Controller({ focus }: { focus: IsolationMapProps["focus"] }) {
  const map = useMap();
  // Leaflet needs a size recalc once the flex container has laid out.
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 0);
    return () => clearTimeout(t);
  }, [map]);
  useEffect(() => {
    if (!focus) return;
    const z = Math.min(17, Math.max(14, Math.round(Math.log2(15000000 / Math.max(60, focus.radiusM)))));
    map.flyTo([focus.center.latitude, focus.center.longitude], z, { duration: 0.6 });
  }, [focus, map]);
  return null;
}

export function IsolationMap({ initialRegion, incident, userLocation, selected, showCircle, onMapPress, onCenterChange, focus }: IsolationMapProps) {
  return (
    <MapContainer
      center={[initialRegion.latitude, initialRegion.longitude]}
      zoom={13}
      zoomControl={false}
      attributionControl={false}
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEvents onMapPress={onMapPress} onCenterChange={onCenterChange} />
      <Controller focus={focus} />
      {userLocation && (
        <CircleMarker
          center={[userLocation.latitude, userLocation.longitude]}
          radius={7}
          pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#2D7DD2", fillOpacity: 1 }}
        />
      )}
      {/* Protective (outer, steel, dashed) drawn first so the isolation circle sits on top. */}
      {showCircle && incident && selected && (
        <Circle
          center={[incident.latitude, incident.longitude]}
          radius={selected.protectiveM}
          pathOptions={{ color: "#5B6B7B", weight: 2, dashArray: "6 6", fillColor: "#5B6B7B", fillOpacity: 0.07 }}
        />
      )}
      {showCircle && incident && selected && (
        <Circle
          center={[incident.latitude, incident.longitude]}
          radius={selected.isolationM}
          pathOptions={{ color: "#C01718", weight: 2, fillColor: "#C01718", fillOpacity: 0.16 }}
        />
      )}
      {incident && <Marker position={[incident.latitude, incident.longitude]} icon={incidentIcon} />}
    </MapContainer>
  );
}
