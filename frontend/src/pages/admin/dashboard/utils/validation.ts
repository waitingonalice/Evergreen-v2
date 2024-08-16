import { z } from "zod";

export const groupNameSchema = z.object({
  name: z.string().min(1),
});
