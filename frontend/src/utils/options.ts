import { EmploymentEnum } from "@/constants";

export const enumsToOptions = (enums: Record<string, string>) =>
  Object.entries(enums).map(([key, value]) => ({
    label: key,
    value,
  }));

export const employmentOptions = enumsToOptions(EmploymentEnum);
