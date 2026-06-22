import { Platform, Vibration } from "react-native";
import * as Notifications from "expo-notifications";
import { WindStatus } from "../types";
import { readArmed, markAlerted } from "./zoneStore";

const ALARM_MS = 60000; // one alert per minute while in a hazard zone
const STRONG_PATTERN = [0, 700, 300, 700, 300, 700];

function zoneLabel(status: WindStatus): string {
  if (status === "danger") return "isolation zone";
  if (status === "protective") return "protective-action zone";
  return "downwind hazard area";
}

/**
 * Fire a "move out" notification + strong vibration, throttled to once per minute
 * via the shared persisted timestamp. Used by BOTH the foreground alarm hook and
 * the background-location task, so the throttle is coordinated across them and the
 * responder never gets a double alert at a foreground/background transition.
 * Returns true if it actually fired.
 */
export async function maybeFireZoneAlert(status: WindStatus | null): Promise<boolean> {
  if (Platform.OS === "web" || !status || status === "clear") return false;
  const z = await readArmed();
  if (z && z.armed === false) return false; // disarmed (reset)
  const now = Date.now();
  if (z && now - (z.lastAlertAt || 0) < ALARM_MS) return false; // throttle
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
  return true;
}
