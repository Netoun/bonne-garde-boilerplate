import { useEffect } from "react";
import { useThemeStore } from "@acme/spa/stores/theme-store";

export function useInitTheme() {
  useEffect(() => {
    useThemeStore.getState().initTheme();
  }, []);
}
