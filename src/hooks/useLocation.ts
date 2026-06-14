import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { LatLng } from "../types";

type LocationState = {
  location: LatLng | null;
  loading: boolean;
  error: string | null;
  gpsStale: boolean;
  lastFixAt: number | null;
};

const POLL_MS = 8000;
const FIX_TIMEOUT_MS = 6000;

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
      startWatching().catch(() => {});
      startPolling();
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
