// What a front-end imports from auth: the type its client infers the extra fields from, and where
// the API serves auth. Nothing here runs on the server, so a front bundles it freely.
export type { Auth } from "./auth.config";

/** Where the API serves Better Auth: the client's `basePath`. */
export const AUTH_BASE_PATH = "/auth";
