import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { LatLng } from "../types";

type LocationState = {
  location: LatLng | null;
  loading: boolean;
  /** Null when fine; otherwise a human-readable reason (denied, unavailable, etc.) */
  error: string | null;
  /** True when we can't get a fresh fix and are falling back to the last known location. */
  gpsStale: boolean;
  /** Timestamp (ms) of the last good GPS fix, or null if we never got one. */
  lastFixAt: number | null;
};

const POLL_MS = 8000; // heartbeat: re-check GPS roughly every 8 seconds
const FIX_TIMEOUT_MS = 6000; // a single fix attempt that takes longer than this is treated as unavailable

/**
 * Wraps expo-location with explicit, user-friendly error handling.
 *
 * In addition to a live watch, it polls for a fresh fix on a heartbeat. When a
 * fresh fix can't be obtained (e.g. the responder walks into a dead zone), it
 * keeps the LAST known location and flips `gpsStale` true so the UI can warn
 * that it's working from the last fix rather than a current one.
 */
export function useLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    loading: false,
    error: null,
    gpsStale: false,
    lastFixAt: null,
  });
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Record a good fix: update location, clear stale, stamp the time.
  const onFix = useCallback((loc: LatLng) => {
    setState((s) => ({ ...s, location: loc, gpsStale: false, lastFixAt: Date.now(), error: null }));
  }, []);

  const startWatching = useCallback(async () => {
    if (watchRef.current) return;
    watchRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 4000, distanceInterval: 5 },
      (pos) => onFix({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
    );
  }, [onFix]);

  // Heartbeat: probe for a fresh fix; if it can't be obtained, fall back to last known.
  const startPolling = useCallback(() => {
    if (pollRef.current) return;
    pollRef.current = setInterval(async () => {
      try {
        const pos = (await Promise.race([
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("gps-timeout")), FIX_TIMEOUT_MS)),
        ])) as Location.LocationObject;
        onFix({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      } catch {
        // Couldn't get a fresh fix — keep the last known location, mark as stale.
        setState((s) => (s.location ? { ...s, gpsStale: true } : s));
      }
    }, POLL_MS);
  }, [onFix]);

  const requestLocation = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const services = await Location.hasServicesEnabledAsync();
      if (!services) {
        setState((s) => ({ ...s, loading: false, error: "Location services are turned off on this device." }));
        return null;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setState((s) => ({ ...s, loading: false, error: "Location permission denied. You can still tap the map to set the incident." }));
        return null;
      }
      // Start live updates + the heartbeat probe.
      startWatching().catch(() => {});
      startPolling();
      // One-shot fix, but never hang the UI if the device has no fix yet.
      const pos = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
      ]);
      if (pos) {
        const loc: LatLng = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        onFix(loc);
        setState((s) => ({ ...s, loading: false }));
        return loc;
      }
      setState((s) => ({ ...s, loading: false }));
      return null;
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: "Could not get your location. Tap the map to set the incident manually." }));
      return null;
    }
  }, [startWatching, startPolling, onFix]);

  // Tidy up subscriptions/timers when the app unmounts.
  useEffect(() => {
    return () => {
      watchRef.current?.remove();
      watchRef.current = null;
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, []);

  return { ...state, requestLocation };
}
