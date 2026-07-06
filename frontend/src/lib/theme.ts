export interface AccentPreset {
  name: string;
  hex: string;
  rgb: string;
  hoverRgb: string;
}

export const ACCENT_PRESETS: AccentPreset[] = [
  { name: "Indigo", hex: "#7C6FF0", rgb: "124 111 240", hoverRgb: "144 134 245" },
  { name: "Emerald", hex: "#34D399", rgb: "52 211 153", hoverRgb: "74 222 170" },
  { name: "Sky", hex: "#38BDF8", rgb: "56 189 248", hoverRgb: "96 205 250" },
  { name: "Rose", hex: "#FB7185", rgb: "251 113 133", hoverRgb: "253 145 163" },
  { name: "Amber", hex: "#F5A623", rgb: "245 166 35", hoverRgb: "250 190 90" },
];

const DEFAULT_ACCENT = ACCENT_PRESETS[0];

/**
 * Applies theme (dark/light class) and accent color (CSS vars) to <html>.
 * Called on load once Settings resolves, and again immediately whenever
 * the person changes either in the Settings page — the visual change
 * happens instantly; the PUT to persist it happens in the background.
 */
export const applyTheme = (theme: "dark" | "light", accentHex: string) => {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);

  const preset = ACCENT_PRESETS.find((p) => p.hex.toLowerCase() === accentHex?.toLowerCase()) || DEFAULT_ACCENT;
  root.style.setProperty("--color-accent", preset.rgb);
  root.style.setProperty("--color-accent-hover", preset.hoverRgb);
};
