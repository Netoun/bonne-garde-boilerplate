/**
 * R2 Storage Helper
 * Helper functions for Cloudflare R2 bucket operations
 */

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export interface UploadOptions {
  folder: string;
  file: File;
}

export interface UploadResult {
  key: string;
  url: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export class R2Error extends Error {
  constructor(
    message: string,
    public readonly code:
      | "INVALID_FILE_TYPE"
      | "FILE_TOO_LARGE"
      | "R2_UPLOAD_FAILED"
      | "R2_DELETE_FAILED"
      | "BUCKET_NOT_CONFIGURED"
      | "MEDIA_NOT_FOUND"
      | "MEDIA_IN_USE"
      | "UNAUTHORIZED",
  ) {
    super(message);
    this.name = "R2Error";
  }
}

export function validateFile(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
    throw new R2Error(
      `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
      "INVALID_FILE_TYPE",
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new R2Error(
      `File too large: ${file.size} bytes. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      "FILE_TOO_LARGE",
    );
  }
}

export function generateKey(folder: string, filename: string): string {
  const sanitizedFolder = folder.replace(/^\/+|\/+$/g, "");
  const uuid = crypto.randomUUID();

  // Sanitize filename: remove path separators and prevent directory traversal
  // Keep Unicode letters, numbers, and safe special characters
  const sanitizedFilename = filename
    .replace(/[/\\]/g, "_") // Path separators
    .replace(/\.{2,}/g, "_") // Directory traversal attempts
    .replace(/[\0-\x1F\x7F]/g, ""); // eslint-disable-line no-control-regex

  return `medias/${sanitizedFolder}/${uuid}-${sanitizedFilename}`;
}

export function extractKeyFromUrl(url: string, publicUrl: string): string | null {
  const normalizedPublicUrl = publicUrl.replace(/\/+$/, "");
  if (!url.startsWith(normalizedPublicUrl)) {
    return null;
  }
  const path = url.slice(normalizedPublicUrl.length);
  return path.startsWith("/") ? path.slice(1) : path;
}

export async function uploadToR2(
  bucket: R2Bucket,
  publicUrl: string,
  options: UploadOptions,
): Promise<UploadResult> {
  validateFile(options.file);

  const key = generateKey(options.folder, options.file.name);
  const arrayBuffer = await options.file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  try {
    await bucket.put(key, uint8Array, {
      httpMetadata: {
        contentType: options.file.type,
      },
    });
  } catch (error) {
    throw new R2Error(
      `Failed to upload to R2: ${error instanceof Error ? error.message : "Unknown error"}`,
      "R2_UPLOAD_FAILED",
    );
  }

  const url = `${publicUrl}/${key}`;

  return { key, url };
}

export async function deleteFromR2(bucket: R2Bucket, key: string): Promise<DeleteResult> {
  try {
    await bucket.delete(key);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE };
