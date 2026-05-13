import { Elysia } from "elysia";
import { mediaRoutes } from "./media.routes";

export const mediaModule = new Elysia({ name: "media.module" }).use(mediaRoutes);
