import { EmploymentEnum } from "@/constants";

export interface Experience {
  company_name: string;
  role: string;
  employment: EmploymentEnum;
  start: Date | null;
  end: Date | null;
  job_description: string;
}

export interface Certifications {
  title: string;
  description: string;
}

export interface Projects extends Certifications {
  link: string;
  techstack: string[];
}

export interface FormProps {
  languages: string[];
  techstack: string[];
  experiences: Experience[];
  certifications: Certifications[];
  projects: Projects[];
}

export interface BaseCVComponentProps<T> {
  onChange: (key: keyof FormProps, val: T) => void;
  data: FormProps;
}
