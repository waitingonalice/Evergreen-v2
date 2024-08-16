import { FileSchema } from "../../middleware/validation/file";
import { z } from "zod";

export const addNewServiceSchema = z.object({
  name: z.string().min(1).max(255),
  url: z.string().url().nullable().optional(),
  groupId: z.number().gt(0).nullable().optional(),
  file: FileSchema.optional().nullable(),
});

export const updateServiceSchema = z.union([
  addNewServiceSchema,
  z.object({
    id: z.string().min(1),
  }),
]);
