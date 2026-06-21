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

const POLL_MS = 8000; // native heartbeat: re-check GPS roughly every 8 seconds
const isWeb = Platform.OS === "web";
const WEB_CACHE_KEY = "hmintel.lastfix";

// --- Web last-known cache (so a page refresh shows a location instantly) -------
function readWebCache(): LatLng | null {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(WEB_CACHE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (typeof v?.latitude === "number" && typeof v?.longitude === "number") {
      return { latitude: v.latitude, longitude: v.longitude };
    }
  } catch {
    /* ignore */
  }
  return null;
}
function writeWebCache(loc: LatLng) {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(WEB_CACHE_KEY, JSON.stringify({ ...loc, t: Date.now() }));
  } catch {
    /* ignore */
  }
}

// --- Single-shot reads, per platform -----------------------------------------
function webGetOnce(highAccuracy: boolean, timeoutMs: number, maxAgeMs: number): Promise<LatLng | null> {
  return new Promise((resolve) => {
    const geo = typeof navigator !== "undefined" ? navigator.geolocation : undefined;
    if (!geo) {
      resolve(null);
      return;
    }
    geo.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: highAccuracy, timeout: timeoutMs, maximumAge: maxAgeMs }
    );
  });
}
function nativeGetOnce(highAccuracy: boolean, timeoutMs: number): Promise<LatLng | null> {
  return Promise.race([
    Location.getCurrentPositionAsync({ accuracy: highAccuracy ? Location.Accuracy.High : Location.Accuracy.Balanced })
      .then((pos): LatLng => ({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }))
      .catch(() => null),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
  ]);
}

/**
 * Geolocation with explicit, user-friendly error handling.
 *
 * WEB: we use the browser's geolocation directly (no expo-location on web) for
 * reliability — a `watchPosition` stream that delivers the first fix whenever it
 * arrives (instead of a one-shot that gives up at a timeout), a last-known fix
 * cached in localStorage so a refresh shows a position immediately, and forgiving
 * timeouts. A desktop has no GPS, so a fix is resolved (slowly) from Wi-Fi/IP and
 * a cold page is the usual cause of an intermittent "unable to get location".
 *
 * NATIVE: expo-location with a live watch + heartbeat; falls back to the last
 * known fix and flips `gpsStale` when a fresh fix can't be obtained.
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
  const webWatchRef = useRef<number | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Record a good fix: update location, clear stale, stamp the time, cache (web).
  const onFix = useCallback((loc: LatLng) => {
    if (isWeb) writeWebCache(loc);
    setState((s) => ({ ...s, location: loc, gpsStale: false, lastFixAt: Date.now(), error: null }));
  }, []);

  const startWatching = useCallback(async () => {
    if (isWeb) {
      if (webWatchRef.current != null) return;
      const geo = typeof navigator !== "undefined" ? navigator.geolocation : undefined;
      if (!geo) return;
      webWatchRef.current = geo.watchPosition(
        (pos) => onFix({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => {
          /* transient watch errors are fine — the cached/last fix stays */
        },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 30000 }
      );
      return;
    }
    if (watchRef.current) return;
    try {
      watchRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 4000, distanceInterval: 5 },
        (pos) => onFix({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
      );
    } catch {
      /* watching is best-effort; the heartbeat poll still keeps us current */
    }
  }, [onFix]);

  // Native heartbeat (web streams via watchPosition instead).
  const startPolling = useCallback(() => {
    if (isWeb || pollRef.current) return;
    pollRef.current = setInterval(async () => {
      const loc = await nativeGetOnce(false, 12000);
      if (loc) onFix(loc);
      else setState((s) => (s.location ? { ...s, gpsStale: true } : s));
    }, POLL_MS);
  }, [onFix]);

  const requestLocation = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      if (isWeb) {
        // Show the last known position immediately (instant on refresh once we've
        // had a fix); the browser owns the permission prompt on getCurrentPosition.
        const cached = readWebCache();
        if (cached) setState((s) => ({ ...s, location: s.location ?? cached }));
        startWatching().catch(() => {});
        // Quick read that can reuse a recent cached fix, then a longer fresh read.
        let loc = await webGetOnce(false, 10000, 600000);
        if (!loc) loc = await webGetOnce(true, 20000, 0);
        if (loc) {
          onFix(loc);
          setState((s) => ({ ...s, loading: false }));
          return loc;
        }
        if (cached) {
          // Couldn't get a fresh fix, but we have a recent one — use it.
          setState((s) => ({ ...s, loading: false, gpsStale: true, location: cached, error: null }));
          return cached;
        }
        setState((s) => ({
          ...s,
          loading: false,
          error:
            "Couldn't get your location from the browser. Make sure your operating system's Location Services are on and this site is allowed (lock icon in the address bar), then tap Locate again — or tap the map to set the incident.",
        }));
        return null;
      }

      // --- Native ---
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
      startWatching().catch(() => {});
      startPolling();
      let loc = await nativeGetOnce(false, 8000);
      if (!loc) loc = await nativeGetOnce(true, 15000);
      if (loc) {
        onFix(loc);
        setState((s) => ({ ...s, loading: false }));
        return loc;
      }
      setState((s) => ({ ...s, loading: false, error: "Could not get your location. Tap the map to set the incident manually." }));
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
      if (webWatchRef.current != null && typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.clearWatch(webWatchRef.current);
      }
      webWatchRef.current = null;
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, []);

  return { ...state, requestLocation };
}
