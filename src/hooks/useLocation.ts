import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { LatLng } from "../types";

type LocationState = {
  location: LatLng | null;
  loading: boolean;
  /** Null when fine; otherwise a human-readable reason (denied, unavailable, etc.) */
  error: string | null;
};

/**
 * Wraps expo-location with explicit, user-friendly error handling so the UI can
 * degrade gracefully when GPS is denied or unavailable (a brief requirement).
 *
 * After the first fix it also starts a live position watch, so as the responder
 * physically moves the blue dot — and the in-zone safety warning — update in
 * real time without any further taps.
 */
export function useLocation() {
  const [state, setState] = useState<LocationState>({ location: null, loading: false, error: null });
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  // Begin (or re-use) a live position subscription once permission is granted.
  const startWatching = useCallback(async () => {
    if (watchRef.current) return;
    watchRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 5 },
      (pos) =>
        setState((s) => ({
          ...s,
          location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
        }))
    );
  }, []);

  const requestLocation = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const services = await Location.hasServicesEnabledAsync();
      if (!services) {
        setState({ location: null, loading: false, error: "Location services are turned off on this device." });
        return null;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setState({ location: null, loading: false, error: "Location permission denied. You can still tap the map to set the incident." });
        return null;
      }
      // Start the live watch first, so fixes arrive even if the one-shot read is slow.
      startWatching().catch(() => {});
      // One-shot fix, but never hang the UI if the device has no fix yet (emulators, cold GPS).
      const pos = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
      ]);
      if (pos) {
        const loc: LatLng = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setState({ location: loc, loading: false, error: null });
        return loc;
      }
      setState((s) => ({ ...s, loading: false }));
      return null;
    } catch (e) {
      setState({ location: null, loading: false, error: "Could not get your location. Tap the map to set the incident manually." });
      return null;
    }
  }, [startWatching]);

  // Tidy up the subscription when the app unmounts.
  useEffect(() => {
    return () => {
      watchRef.current?.remove();
      watchRef.current = null;
    };
  }, []);

  return { ...state, requestLocation };
}
