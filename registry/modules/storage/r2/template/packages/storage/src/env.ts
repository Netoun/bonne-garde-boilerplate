/** What storage reads from the runtime's environment. The public url is the only key it owns. */
export type StorageEnv = { R2_PUBLIC_URL: string };

/** What a test gets in place of a missing public url: the media route of the local API. */
const TEST_PUBLIC_URL = "http://localhost:5172/v1/media/file";

/**
 * The storage environment out of a plain record, as `readRuntimeEnv()` returns it. Pure: it reads no
 * runtime global. Throws when the public url is missing or empty, unless `test` is set, in which
 * case it gets a fixture.
 */
export function resolveStorageEnv(
  source: Record<string, unknown>,
  options: { test?: boolean } = {},
): StorageEnv {
  const publicUrl = source.R2_PUBLIC_URL;
  if (typeof publicUrl === "string" && publicUrl !== "") {
    return { R2_PUBLIC_URL: publicUrl };
  }
  if (options.test) {
    return { R2_PUBLIC_URL: TEST_PUBLIC_URL };
  }
  throw new Error(
    "Missing required environment variables: R2_PUBLIC_URL. " +
      "Please check your environment configuration.",
  );
}
