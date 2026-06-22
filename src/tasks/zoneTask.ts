import { Platform, Vibration } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { windStatus } from "../utils/wind";
import { DangerousGood, WindStatus } from "../types";
import { readArmed, markAlerted } from "./../services/zoneStore";

export const ZONE_TASK = "HMINTEL_ZONE_TASK";

const isNative = Platform.OS !== "web";
const ALARM_MS = 60000; // one alert per minute while in a hazard zone
const STRONG_PATTERN = [0, 700, 300, 700, 300, 700];

function zoneLabel(status: WindStatus): string {
  if (status === "danger") return "isolation zone";
  if (status === "protective") return "protective-action zone";
  return "downwind hazard area";
}

// Foreground display + sound, so the alert shows whether or not the app is on screen.
if (isNative) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false }),
  });
}

/**
 * Headless background-location task. Runs in BOTH foreground and background while
 * location updates are active. On each fix it reads the armed zone from disk,
 * recomputes whether the responder is inside a hazard zone, and — throttled to one
 * per minute — fires a phone notification + strong vibration telling them to move
 * out. This is what makes the alert work with the app backgrounded / screen off.
 */
if (isNative) {
  TaskManager.defineTask(ZONE_TASK, async ({ data, error }: any) => {
    if (error) return;
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

    if (!status || status === "clear") return;

    const now = Date.now();
    if (now - (z.lastAlertAt || 0) < ALARM_MS) return; // throttle
    await markAlerted(now);

    try {
      Vibration.vibrate(STRONG_PATTERN);
    } catch {
      /* ignore */
    }
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "⚠️ Move out of the restricted zone",
          body: `You are in the ${zoneLabel(status)}. Move out now — upwind, to a safe distance.`,
          sound: true,
          ...(Platform.OS === "android" ? { channelId: "default", vibrate: STRONG_PATTERN } : {}),
        },
        trigger: null, // immediate
      });
    } catch {
      /* notification best-effort; vibration already fired */
    }
  });
}
