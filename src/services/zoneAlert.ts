import { Platform, Vibration } from "react-native";
import * as Notifications from "expo-notifications";
import { WindStatus } from "../types";
import { readArmed, markAlerted } from "./zoneStore";

const ALARM_MS = 60000; // one alert per minute while in a hazard zone
const STRONG_PATTERN = [0, 700, 300, 700, 300, 700];

// Synchronous in-memory throttle. The foreground alarm hook and the background
// location task both run in the SAME JS runtime, so this single timestamp dedupes
// them race-free: it's checked AND claimed before any `await`, so two updates that
// arrive in the same tick can't both fire (which previously caused 2–3 alert bursts).
let lastFireMs = 0;

/** Clear the throttle so a freshly-armed incident can alert immediately (called on reset/disarm). */
export function resetZoneThrottle(): void {
  lastFireMs = 0;
}

function zoneLabel(status: WindStatus): string {
  if (status === "danger") return "isolation zone";
  if (status === "protective") return "protective-action zone";
  return "downwind hazard area";
}

/**
 * Fire a "move out" notification + strong vibration, at most once per minute. Used
 * by BOTH the foreground alarm hook and the background-location task; the in-memory
 * throttle keeps them to exactly one alert per minute while in a hazard zone.
 * Returns true if it actually fired.
 */
export async function maybeFireZoneAlert(status: WindStatus | null): Promise<boolean> {
  if (Platform.OS === "web" || !status || status === "clear") return false;
  const now = Date.now();
  if (now - lastFireMs < ALARM_MS) return false; // throttle (synchronous — no race)
  lastFireMs = now; // claim the slot immediately, before any await

  const z = await readArmed();
  if (!z || z.armed === false) {
    lastFireMs = 0; // not armed — release the slot so the next arm can alert at once
    return false;
  }
  await markAlerted(now); // persist for the rare cold-relaunch case

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
