import { useEffect, useRef } from "react";
import { Platform, Vibration } from "react-native";
import * as Notifications from "expo-notifications";
import { WindStatus } from "../types";

const isNative = Platform.OS !== "web";

// Show the alert even while the app is foregrounded (the responder is watching the map).
if (isNative) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

const STRONG_PATTERN = [0, 700, 300, 700, 300, 700]; // serious triple buzz
const ALARM_MS = 60000; // one alert per minute while in a hazard zone

function zoneLabel(status: WindStatus): string {
  if (status === "danger") return "isolation zone";
  if (status === "protective") return "protective-action zone";
  return "downwind hazard area";
}

/**
 * While the responder is inside a hazard zone (danger / protective / downwind),
 * fire a phone notification + a strong vibration immediately, then once a minute,
 * telling them to move out. Stops the moment they're clear. Native only — a phone
 * notification has no meaning in a desktop browser.
 *
 * Note: the iOS Simulator shows the notification banner but cannot vibrate (no
 * haptics); on a real iPhone / Android device the vibration fires too.
 */
export function useZoneAlarm(status: WindStatus | null) {
  const permRef = useRef<boolean | null>(null);

  // Android: a high-importance channel so the alert shows heads-up and buzzes.
  useEffect(() => {
    if (Platform.OS !== "android") return;
    Notifications.setNotificationChannelAsync("default", {
      name: "Hazard zone alerts",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: STRONG_PATTERN,
      enableVibrate: true,
      sound: "default",
      bypassDnd: true,
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isNative) return; // phone notifications are native-only
    if (!status || status === "clear") return; // only while in a hazard zone

    let cancelled = false;
    const label = zoneLabel(status);

    const fire = async () => {
      if (cancelled) return;
      Vibration.vibrate(STRONG_PATTERN);
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "⚠️ Move out of the restricted zone",
            body: `You are in the ${label}. Move out now — upwind, to a safe distance.`,
            sound: true,
          },
          trigger: null, // immediate
        });
      } catch {
        /* ignore — vibration still fired */
      }
    };

    (async () => {
      try {
        if (permRef.current == null) {
          const cur = await Notifications.getPermissionsAsync();
          permRef.current = cur.granted;
          if (!permRef.current) {
            const req = await Notifications.requestPermissionsAsync();
            permRef.current = req.granted;
          }
        }
      } catch {
        /* ignore */
      }
      fire(); // immediate first alert on entering the zone
    })();

    const id = setInterval(fire, ALARM_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
      Vibration.cancel();
    };
  }, [status]);
}
