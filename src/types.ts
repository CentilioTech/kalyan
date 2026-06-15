export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface DangerousGood {
  /** UN/NA identification number */
  un: string;
  name: string;
  /** Hazard class, e.g. "3" or "2.3/5.1/8" */
  hazardClass: string;
  /** ERG guide number */
  ergGuide: string;
  /** Initial isolation distance in metres (placeholder data for the trial) */
  isolationM: number;
  /** Protective action distance in metres (placeholder; future scope) */
  protectiveM: number;
  /** 24-hour emergency contact */
  emergencyContact: string;
}

export type Units = "m" | "km";

export interface Wind {
  /** Direction the wind is blowing FROM, in degrees (meteorological convention). */
  fromDeg: number;
  /** Wind speed in km/h. */
  speedKmh: number;
  /** True when the wind is too weak/variable to model a reliable downwind direction. */
  calm: boolean;
  /** Timestamp (ms) of the reading. */
  fetchedAt: number;
}

/** Responder status relative to the incident, factoring in wind. */
export type WindStatus = "danger" | "protective" | "downwind" | "clear";
