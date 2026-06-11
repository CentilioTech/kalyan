import { DangerousGood } from "../types";

/**
 * Sample dangerous-goods data from the HM Intel trial brief.
 * NOTE: distances are PLACEHOLDERS for this prototype, not authoritative ERG values.
 * In production this comes from a maintained ERG / TDG dataset (see DG Vault).
 */
export const DANGEROUS_GOODS: DangerousGood[] = [
  { un: "UN1203", name: "Gasoline", hazardClass: "3", ergGuide: "128", isolationM: 50, protectiveM: 300, emergencyContact: "CANUTEC 1-888-CANUTEC" },
  { un: "UN1075", name: "Liquefied Petroleum Gas", hazardClass: "2.1", ergGuide: "115", isolationM: 100, protectiveM: 800, emergencyContact: "CANUTEC 1-888-CANUTEC" },
  { un: "UN1789", name: "Hydrochloric Acid", hazardClass: "8", ergGuide: "157", isolationM: 50, protectiveM: 250, emergencyContact: "CANUTEC 1-888-CANUTEC" },
  { un: "UN1017", name: "Chlorine", hazardClass: "2.3/5.1/8", ergGuide: "124", isolationM: 300, protectiveM: 1500, emergencyContact: "CANUTEC 1-888-CANUTEC" },
  { un: "UN1824", name: "Sodium Hydroxide Solution", hazardClass: "8", ergGuide: "154", isolationM: 30, protectiveM: 150, emergencyContact: "CANUTEC 1-888-CANUTEC" },
];
