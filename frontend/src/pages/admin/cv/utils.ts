/* eslint-disable no-restricted-syntax */
import { z } from "zod";
import { ValueError } from "@/utils/error";
import { Experience, FormProps } from "./type";

const experienceSchema = (field: Experience) =>
  z.object({
    company_name: z.string().min(1),
    employment: z.string().min(1),
    role: z.string().min(1),
    start: z.date().max(field.end ?? new Date(), {
      message: "Start date must be before end date",
    }),
    end: z.date().min(field.start ?? new Date(0), {
      message: "End date must be after start date",
    }),
    job_description: z.string().min(1),
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

const validateForm = (data: FormProps) => {
  const form = Object.entries(data);
  for (const [k, v] of form) {
    const value = v as Record<string, unknown>[];
    const keyMap = {
      languages: "Languages",
      techstack: "Technologies",
      experiences: "Experiences",
      certifications: "Certifications",
      projects: "Projects",
    };
    if (value.length === 0) {
      throw new ValueError(`${keyMap[k as keyof typeof keyMap]} is required.`);
    }
  }
  return true;
};

export { experienceSchema, projectSchema, certificationSchema, validateForm };
