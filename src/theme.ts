// HM Intel design tokens. Light, authoritative; red used with purpose.
export const colors = {
  hmRed: "#C01718",
  hmRedDeep: "#8E0000",
  signalRed: "#E22B2B",
  redWash: "#FBE9E9",
  ink: "#14181F",
  slate: "#3A4756",
  steel: "#5B6B7B",
  muted: "#6B7280",
  paper: "#FFFFFF",
  canvas: "#F6F7F9",
  line: "#E7E9EE",
  ok: "#1F9D55",
  warn: "#B8860B",
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
export const radius = { sm: 10, md: 14, lg: 18, pill: 999 };

export const typography = {
  title: { fontSize: 18, fontWeight: "800" as const, color: colors.ink },
  h2: { fontSize: 16, fontWeight: "700" as const, color: colors.ink },
  body: { fontSize: 14, color: colors.slate },
  label: { fontSize: 11, fontWeight: "700" as const, letterSpacing: 0.6, color: colors.muted },
  mono: { fontSize: 13, fontWeight: "700" as const, color: colors.ink },
};

export const shadow = {
  shadowColor: "#14181F",
  shadowOpacity: 0.12,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 8 },
  elevation: 4,
};
