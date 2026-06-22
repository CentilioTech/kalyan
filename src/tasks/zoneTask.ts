import { AppState, Platform } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { windStatus } from "../utils/wind";
import { DangerousGood } from "../types";
import { readArmed } from "../services/zoneStore";
import { maybeFireZoneAlert } from "../services/zoneAlert";

export const ZONE_TASK = "HMINTEL_ZONE_TASK";

const isNative = Platform.OS !== "web";

// Foreground display + sound, so the alert shows whether or not the app is on screen.
if (isNative) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false }),
  });
}

/**
 * Headless background-location task. The OS invokes it with each location batch
 * while background location updates are active — including when the app is
 * backgrounded or the screen is off. It reads the armed zone from disk, recomputes
 * whether the responder is in a hazard zone, and fires the throttled "move out"
 * alert. While the app is on screen the foreground hook owns alerts (AppState gate),
 * so the two never double up.
 */
if (isNative) {
  TaskManager.defineTask(ZONE_TASK, async ({ data, error }: any) => {
    if (error) return;
    if (AppState.currentState === "active") return; // foreground hook handles it
    const locations = data?.locations as Location.LocationObject[] | undefined;
    if (!locations || locations.length === 0) return;

    const z = await readArmed();
    if (!z || !z.armed) return;

    const last = locations[locations.length - 1].coords;
    const status = windStatus({
      user: { latitude: last.latitude, longitude: last.longitude },
      incident: { latitude: z.lat, longitude: z.lng },
      selected: { isolationM: z.isolationM, protectiveM: z.protectiveM } as DangerousGood,
      wind: z.wind ? { fromDeg: z.wind.fromDeg, speedKmh: z.wind.speedKmh, calm: z.wind.calm, fetchedAt: 0 } : null,
      coneLengthM: z.coneLengthM,
    });

    await maybeFireZoneAlert(status);
  });
}
