import z from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(8, { message: "Username should contain 8-20 characters." })
    .max(20, { message: "Username should contain 8-20 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password should contain 8-14 characters." })
    .max(14, { message: "Password should contain 8-14 characters." }),
  country: z.string().min(1),
  secret: z.string().min(1),
});
