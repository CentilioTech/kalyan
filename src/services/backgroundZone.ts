import { Platform } from "react-native";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { ZONE_TASK } from "../tasks/zoneTask";

const isNative = Platform.OS !== "web";
const STRONG_PATTERN = [0, 700, 300, 700, 300, 700];

let channelReady = false;
export async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android" || channelReady) return;
  try {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Hazard zone alerts",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: STRONG_PATTERN,
      enableVibrate: true,
      sound: "default",
      bypassDnd: true,
    });
    channelReady = true;
  } catch {
    /* ignore */
  }
}

/**
 * Start background location monitoring so hazard alerts fire even when the app is
 * backgrounded or the screen is off. Requires foreground + background ("Always")
 * location permission; degrades gracefully to foreground-only if background is
 * denied. Android keeps a foreground service alive (a persistent "monitoring"
 * notification) so updates keep flowing; iOS uses the location background mode.
 */
export async function startBackgroundZone(): Promise<boolean> {
  if (!isNative) return false;
  try {
    await ensureAndroidChannel();
    await Notifications.requestPermissionsAsync().catch(() => {});

    const fg = await Location.getForegroundPermissionsAsync();
    if (!fg.granted) {
      const r = await Location.requestForegroundPermissionsAsync();
      if (!r.granted) return false;
    }
    // Background ("Always") — best effort; if denied, foreground updates still drive alerts while the app is open.
    const bg = await Location.getBackgroundPermissionsAsync();
    if (!bg.granted) await Location.requestBackgroundPermissionsAsync().catch(() => {});

    const already = await Location.hasStartedLocationUpdatesAsync(ZONE_TASK).catch(() => false);
    if (already) return true;

    await Location.startLocationUpdatesAsync(ZONE_TASK, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 5000,
      distanceInterval: 5,
      pausesUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "HM Intel — zone monitoring active",
        notificationBody: "Watching your distance from the incident hazard zone.",
        notificationColor: "#C01718",
      },
      ...(Platform.OS === "ios" ? { activityType: Location.ActivityType.OtherNavigation } : {}),
    });
    return true;
  } catch {
    return false;
  }
}

export async function stopBackgroundZone(): Promise<void> {
  if (!isNative) return;
  try {
    const on = await Location.hasStartedLocationUpdatesAsync(ZONE_TASK).catch(() => false);
    if (on) await Location.stopLocationUpdatesAsync(ZONE_TASK);
  } catch {
    /* ignore */
  }
}
