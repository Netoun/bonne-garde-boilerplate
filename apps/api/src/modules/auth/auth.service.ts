import { Elysia } from "elysia";
import { createAuth } from "./auth.config";

// Singleton auth instance - created once at module load time
const auth = createAuth();

export const authService = new Elysia({ name: "auth.service" }).derive({ as: "global" }, () => {
  return {
    authService: {
      api: auth.api,
      instance: auth,
    },
  };
});
