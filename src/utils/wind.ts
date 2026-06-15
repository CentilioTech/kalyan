import { DangerousGood, LatLng, Wind, WindStatus } from "../types";

// Geometry + status helpers for the wind / downwind-hazard feature.
// The wind is always read at the INCIDENT location (not the responder's), and the
// plume travels DOWNWIND: bearing = (direction-from + 180) mod 360.

/** Half-angle of the downwind hazard cone, in degrees (cone spans ±this around downwind). */
export const CONE_HALF_ANGLE_DEG = 25;

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;
const R_EARTH = 6371000;

/** Great-circle distance in metres (Haversine). */
export function distanceM(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R_EARTH * Math.asin(Math.sqrt(h));
}

/** Initial bearing (degrees, 0–360) from `from` to `to`. */
export function bearingDeg(from: LatLng, to: LatLng): number {
  const phi1 = toRad(from.latitude);
  const phi2 = toRad(to.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const y = Math.sin(dLon) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Smallest absolute angular difference between two bearings (0–180). */
function angleDelta(a: number, b: number): number {
  return Math.abs((((a - b) % 360) + 540) % 360 - 180);
}

/** The bearing the plume travels along (opposite the wind's "from" direction). */
export function downwindBearing(wind: Wind): number {
  return (wind.fromDeg + 180) % 360;
}

/** Destination point given a start, bearing (deg) and distance (m). */
export function destinationPoint(origin: LatLng, bearing: number, distanceMeters: number): LatLng {
  const br = toRad(bearing);
  const lat1 = toRad(origin.latitude);
  const lon1 = toRad(origin.longitude);
  const dr = distanceMeters / R_EARTH;
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(dr) + Math.cos(lat1) * Math.sin(dr) * Math.cos(br));
  const lon2 = lon1 + Math.atan2(Math.sin(br) * Math.sin(dr) * Math.cos(lat1), Math.cos(dr) - Math.sin(lat1) * Math.sin(lat2));
  return { latitude: toDeg(lat2), longitude: ((toDeg(lon2) + 540) % 360) - 180 };
}

/** How far the downwind cone reaches — beyond the protective circle, to flag wind-carried exposure. */
export function coneLengthFor(good: DangerousGood): number {
  return Math.max(good.protectiveM * 1.5, good.protectiveM + 400);
}

/**
 * Polygon (apex at the incident, fanning out downwind) approximating the hazard cone.
 * Returns a closed ring of LatLng suitable for Leaflet / react-native-maps Polygon.
 */
export function conePolygon(
  incident: LatLng,
  wind: Wind,
  lengthM: number,
  halfAngleDeg = CONE_HALF_ANGLE_DEG,
  steps = 12
): LatLng[] {
  const dw = downwindBearing(wind);
  const pts: LatLng[] = [incident];
  for (let i = 0; i <= steps; i++) {
    const a = dw - halfAngleDeg + (2 * halfAngleDeg) * (i / steps);
    pts.push(destinationPoint(incident, a, lengthM));
  }
  return pts;
}

/**
 * Responder status by priority: danger (in isolation) › protective (in protective circle)
 * › downwind (outside circles but in the wind-carried cone) › clear.
 * Returns null if we don't have the inputs to decide.
 */
export function windStatus(args: {
  user: LatLng | null;
  incident: LatLng | null;
  selected: DangerousGood | null;
  wind: Wind | null;
  coneLengthM: number;
}): WindStatus | null {
  const { user, incident, selected, wind, coneLengthM } = args;
  if (!user || !incident || !selected) return null;
  const d = distanceM(user, incident);
  if (d <= selected.isolationM) return "danger";
  if (d <= selected.protectiveM) return "protective";
  if (wind && !wind.calm && coneLengthM > 0 && d <= coneLengthM) {
    const delta = angleDelta(bearingDeg(incident, user), downwindBearing(wind));
    if (delta <= CONE_HALF_ANGLE_DEG) return "downwind";
  }
  return "clear";
}

/** 8-point compass abbreviation for a bearing (e.g. 270 → "W"). */
export function compass8(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round((((deg % 360) + 360) % 360) / 45) % 8];
}
