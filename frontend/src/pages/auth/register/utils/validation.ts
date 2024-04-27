import z from "zod";
import { RegisterNewUserType } from "../loaders/register";

export const registerSchema = (form: RegisterNewUserType) =>
  z.object({
    username: z
      .string()
      .min(8, { message: "Username should contain 8-20 characters." })
      .max(20, { message: "Username should contain 8-20 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password should contain 8-14 characters." })
      .max(14, { message: "Password should contain 8-14 characters." }),
    confirmPassword: z.string().refine((data) => data === form.password, {
      message: "Passwords do not match.",
    }),
    country: z.string().min(1),
    secret: z.string().min(1),
  });
