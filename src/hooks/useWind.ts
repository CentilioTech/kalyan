import { useCallback, useEffect, useRef, useState } from "react";
import { LatLng, Wind } from "../types";

// Live wind at the INCIDENT location via Open-Meteo (free, keyless).
// Docs: https://open-meteo.com/en/docs — `current=wind_speed_10m,wind_direction_10m`.
// wind_direction_10m is the direction the wind comes FROM (meteorological convention).

const CALM_KMH = 3; // below this, treat as calm/variable (no reliable downwind direction)
const REFRESH_MS = 5 * 60 * 1000; // wind changes slowly; refresh every 5 min

export function useWind(incident: LatLng | null) {
  const [wind, setWind] = useState<Wind | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchWind = useCallback(async (loc: LatLng) => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);
    setError(null);
    try {
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude.toFixed(4)}` +
        `&longitude=${loc.longitude.toFixed(4)}` +
        `&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=kmh`;
      const res = await fetch(url, { signal: ac.signal });
      if (!res.ok) throw new Error(`weather ${res.status}`);
      const json = await res.json();
      const cur = json?.current ?? {};
      const speed = Number(cur.wind_speed_10m);
      const dir = Number(cur.wind_direction_10m);
      if (!isFinite(speed) || !isFinite(dir)) throw new Error("no wind data");
      setWind({ fromDeg: dir, speedKmh: speed, calm: speed < CALM_KMH, fetchedAt: Date.now() });
    } catch (e: any) {
      if (e?.name !== "AbortError") setError("Wind data unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!incident) {
      setWind(null);
      setError(null);
      return;
    }
    fetchWind(incident);
    const id = setInterval(() => fetchWind(incident), REFRESH_MS);
    return () => {
      clearInterval(id);
      abortRef.current?.abort();
    };
    // Re-fetch whenever the incident point changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incident?.latitude, incident?.longitude, fetchWind]);

  return { wind, loading, error };
}
