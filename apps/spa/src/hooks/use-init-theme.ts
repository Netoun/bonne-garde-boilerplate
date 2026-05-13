import { useEffect } from "react";
import { useThemeStore } from "@bonne-garde/spa/stores/theme-store";

export function useInitTheme() {
  useEffect(() => {
    useThemeStore.getState().initTheme();
  }, []);
}
