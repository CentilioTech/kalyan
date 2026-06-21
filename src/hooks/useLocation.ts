import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
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
const isWeb = Platform.OS === "web";

/**
 * Single position read, tuned per platform.
 *
 * On WEB the browser owns geolocation: a desktop has no GPS, so a position is
 * resolved (slowly) from Wi-Fi/IP and a fresh page has a cold cache — the usual
 * cause of an intermittent "unable to get location" right after a refresh. We
 * call navigator.geolocation directly so we can pass `maximumAge` (reuse a recent
 * fix instantly) and a generous `timeout`. On NATIVE we keep expo-location.
 */
function getPositionOnce(opts: { highAccuracy: boolean; timeoutMs: number; maxAgeMs: number }): Promise<LatLng | null> {
  if (isWeb) {
    return new Promise((resolve) => {
      const geo = typeof navigator !== "undefined" ? navigator.geolocation : undefined;
      if (!geo) {
        resolve(null);
        return;
      }
      geo.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: opts.highAccuracy, timeout: opts.timeoutMs, maximumAge: opts.maxAgeMs }
      );
    });
  }
  // Native: expo-location, but never let a single attempt hang the UI.
  return Promise.race([
    Location.getCurrentPositionAsync({ accuracy: opts.highAccuracy ? Location.Accuracy.High : Location.Accuracy.Balanced })
      .then((pos): LatLng => ({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }))
      .catch(() => null),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), opts.timeoutMs)),
  ]);
}

/**
 * Wraps geolocation with explicit, user-friendly error handling.
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
    try {
      watchRef.current = await Location.watchPositionAsync(
        { accuracy: isWeb ? Location.Accuracy.Balanced : Location.Accuracy.High, timeInterval: 4000, distanceInterval: 5 },
        (pos) => onFix({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
      );
    } catch {
      // Watching is best-effort; the heartbeat poll still keeps us current.
    }
  }, [onFix]);

  // Heartbeat: probe for a fresh fix; if it can't be obtained, fall back to last known.
  const startPolling = useCallback(() => {
    if (pollRef.current) return;
    pollRef.current = setInterval(async () => {
      const loc = await getPositionOnce({ highAccuracy: false, timeoutMs: 12000, maxAgeMs: 30000 });
      if (loc) onFix(loc);
      else setState((s) => (s.location ? { ...s, gpsStale: true } : s));
    }, POLL_MS);
  }, [onFix]);

  const requestLocation = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      // On native, ask expo-location explicitly. On web the browser shows its own
      // permission prompt on the first getCurrentPosition, so we don't gate on
      // hasServicesEnabledAsync (which is unreliable on web).
      if (!isWeb) {
        const services = await Location.hasServicesEnabledAsync().catch(() => true);
        if (!services) {
          setState((s) => ({ ...s, loading: false, error: "Location services are turned off on this device." }));
          return null;
        }
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setState((s) => ({ ...s, loading: false, error: "Location permission denied. You can still tap the map to set the incident." }));
          return null;
        }
      }

      // Start live updates + the heartbeat probe.
      startWatching().catch(() => {});
      startPolling();

      // First a fast attempt that can reuse a recent cached fix (instant on a
      // refresh); if that yields nothing, a longer high-accuracy attempt.
      let loc = await getPositionOnce({ highAccuracy: false, timeoutMs: 8000, maxAgeMs: 120000 });
      if (!loc) loc = await getPositionOnce({ highAccuracy: true, timeoutMs: 15000, maxAgeMs: 0 });

      if (loc) {
        onFix(loc);
        setState((s) => ({ ...s, loading: false }));
        return loc;
      }

      setState((s) => ({
        ...s,
        loading: false,
        error: isWeb
          ? "Couldn't get your location from the browser. Check the location permission (lock icon in the address bar) and that your OS location service is on, then tap Locate again — or tap the map to set the incident."
          : "Could not get your location. Tap the map to set the incident manually.",
      }));
      return null;
    } catch {
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
