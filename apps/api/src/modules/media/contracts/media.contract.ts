import { t } from "elysia";
import { ALLOWED_IMAGE_TYPES } from "@bonne-garde/api/lib/r2";

export const mediaParams = t.Object({ id: t.String() });
export const mediaFileParams = t.Object({ key: t.String() });

export const uploadMediaBody = t.Object({
  file: t.File({ maxSize: "10m", type: ALLOWED_IMAGE_TYPES }),
  folder: t.Optional(t.String()),
  organizationId: t.Optional(t.String()),
});

export const deleteMediaBody = t.Optional(
  t.Object({
    organizationId: t.Optional(t.String()),
  }),
);

export const mediaResponse = t.Object({
  id: t.String(),
  url: t.String(),
  name: t.String(),
});

export const errorResponse = t.Object({
  error: t.String(),
  code: t.Optional(t.String()),
});

export type MediaParams = typeof mediaParams.static;
export type MediaFileParams = typeof mediaFileParams.static;
export type UploadMediaBody = typeof uploadMediaBody.static;
export type DeleteMediaBody = typeof deleteMediaBody.static;
export type MediaResponse = typeof mediaResponse.static;
export type ErrorResponse = typeof errorResponse.static;
