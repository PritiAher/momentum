import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCENT_PRESETS, applyTheme } from "@/lib/theme";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";

export default function AppearanceSection() {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();

  if (!settings) return null;

  const setTheme = (theme: "dark" | "light") => {
    applyTheme(theme, settings.accentColor); // instant visual feedback
    updateSettings.mutate({ theme });
  };

  const setAccent = (hex: string) => {
    applyTheme(settings.theme, hex); // instant visual feedback
    updateSettings.mutate({ accentColor: hex });
  };

  return (
    <div className="card p-5">
      <h2 className="text-sm font-semibold text-ink">Appearance</h2>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-ink-muted">Theme</p>
        <div className="flex gap-2">
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
              settings.theme === "dark"
                ? "border-accent bg-accent-muted text-accent"
                : "border-base-border text-ink-muted hover:border-ink-faint"
            )}
          >
            <Moon size={14} /> Dark
          </button>
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
              settings.theme === "light"
                ? "border-accent bg-accent-muted text-accent"
                : "border-base-border text-ink-muted hover:border-ink-faint"
            )}
          >
            <Sun size={14} /> Light
          </button>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-ink-muted">Accent Color</p>
        <div className="flex gap-2">
          {ACCENT_PRESETS.map((preset) => (
            <button
              key={preset.hex}
              onClick={() => setAccent(preset.hex)}
              title={preset.name}
              className={cn(
                "h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-base-surface transition-transform hover:scale-105",
                settings.accentColor?.toLowerCase() === preset.hex.toLowerCase() ? "ring-ink" : "ring-transparent"
              )}
              style={{ backgroundColor: preset.hex }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
