import { z } from "zod";
import { Experience } from "./type";

const experienceSchema = (field: Experience) =>
  z.object({
    company_name: z.string().min(1),
    employment: z.string().min(1),
    role: z.string().min(1),
    start: z.date().min(new Date(0), { message: "Start date is required" }),
    end: z.date().min(field.start ?? new Date(0), {
      message: "End date must be after start date",
    }),
    job_description: z
      .array(z.string().min(1))
      .nonempty({ message: "Job description is required" }),
  });

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  link: z.string().url({ message: "Invalid URL" }),
});

const certificationSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export { experienceSchema, projectSchema, certificationSchema };
