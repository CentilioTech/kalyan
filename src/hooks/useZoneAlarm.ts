import { useEffect } from "react";
import { Platform } from "react-native";
import { WindStatus } from "../types";
import { maybeFireZoneAlert } from "../services/zoneAlert";

/**
 * Foreground hazard alarm. While the app is on screen and the responder is inside a
 * hazard zone (danger / protective / downwind), fire a "move out" notification +
 * strong vibration immediately, then re-check often (the shared throttle gates the
 * actual alert to one per minute). Stops the moment they're clear.
 *
 * When the app is backgrounded this hook's timer is suspended by the OS — the
 * background-location task takes over the alerting (see src/tasks/zoneTask.ts).
 * Both go through maybeFireZoneAlert, which shares one throttle, so there are no
 * duplicate alerts. Native only — a phone notification has no meaning in a browser.
 */
export function useZoneAlarm(status: WindStatus | null) {
  useEffect(() => {
    if (Platform.OS === "web" || !status || status === "clear") return;
    let cancelled = false;
    const tick = () => {
      if (!cancelled) maybeFireZoneAlert(status);
    };
    tick(); // immediate on entering the zone (respects the throttle)
    const id = setInterval(tick, 15000); // re-check often; throttle gates to one/minute
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [status]);
}
