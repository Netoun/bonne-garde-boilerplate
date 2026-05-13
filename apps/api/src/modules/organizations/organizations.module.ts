import { Elysia } from "elysia";
import { organizationsRoutes } from "./organizations.routes";

export const organizationsModule = new Elysia({ name: "organizations.module" }).use(
  organizationsRoutes,
);
