import { FileContentTypeEnum } from "@waitingonalice/utilities";
import { z } from "zod";

export const FileSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(FileContentTypeEnum).nullable(),
  size: z.number().min(1).nullable(),
  src: z.string().min(1).nullable(),
});
