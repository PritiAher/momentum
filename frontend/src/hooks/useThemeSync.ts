import { useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import { applyTheme } from "@/lib/theme";

/**
 * index.html ships with class="dark" as a sane default before any data has
 * loaded (avoids a flash of unstyled/wrong theme). Once Settings resolves,
 * this reconciles the document with whatever the person actually chose.
 */
export function useThemeSync() {
  const { data: settings } = useSettings();

  useEffect(() => {
    if (settings) {
      applyTheme(settings.theme, settings.accentColor);
    }
  }, [settings]);
}
