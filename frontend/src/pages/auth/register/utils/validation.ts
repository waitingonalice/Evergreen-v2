import z from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(50),
  country: z.string().min(1),
  secret: z.string().min(1),
});
