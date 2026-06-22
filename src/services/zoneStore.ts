import * as FileSystem from "expo-file-system";

/**
 * Tiny persistent store for the "armed" hazard zone, shared between the React UI
 * and the headless background-location task (which runs in a separate JS context
 * and cannot read React state). Backed by a single JSON file.
 */
export type ArmedWind = { fromDeg: number; speedKmh: number; calm: boolean };
export type ArmedZone = {
  armed: boolean;
  lat: number;
  lng: number;
  isolationM: number;
  protectiveM: number;
  coneLengthM: number;
  wind: ArmedWind | null;
  /** Last time we fired a hazard alert (ms) — used to throttle to one/minute. */
  lastAlertAt: number;
};

const FILE = (FileSystem.documentDirectory ?? "") + "hm_zone.json";

export async function readArmed(): Promise<ArmedZone | null> {
  try {
    const raw = await FileSystem.readAsStringAsync(FILE);
    return JSON.parse(raw) as ArmedZone;
  } catch {
    return null;
  }
}

async function write(z: ArmedZone): Promise<void> {
  try {
    await FileSystem.writeAsStringAsync(FILE, JSON.stringify(z));
  } catch {
    /* best effort */
  }
}

/**
 * Arm/update the zone config. Preserves the existing throttle timestamp unless the
 * incident point itself moved (a new incident should be able to alert immediately).
 */
export async function writeArmedConfig(cfg: Omit<ArmedZone, "armed" | "lastAlertAt">): Promise<void> {
  const prev = await readArmed();
  const samePoint = prev && Math.abs(prev.lat - cfg.lat) < 1e-7 && Math.abs(prev.lng - cfg.lng) < 1e-7;
  const lastAlertAt = prev && prev.armed && samePoint ? prev.lastAlertAt : 0;
  await write({ ...cfg, armed: true, lastAlertAt });
}

export async function markAlerted(t: number): Promise<void> {
  const z = await readArmed();
  if (z) await write({ ...z, lastAlertAt: t });
}

export async function disarm(): Promise<void> {
  const z = await readArmed();
  if (z) await write({ ...z, armed: false });
  else await write({ armed: false, lat: 0, lng: 0, isolationM: 0, protectiveM: 0, coneLengthM: 0, wind: null, lastAlertAt: 0 });
}
