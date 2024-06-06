import { BucketEnum, EmploymentEnum, StatusEnum } from "@/constants";

export const generateOptions = <T extends Record<string, string>>(arg: T) => {
  const options = Object.entries(arg).map(([key, value]) => ({
    label: value,
    value: key,
  }));
  return options;
};

export const enumsToOptions = (enums: Record<string, string>) =>
  Object.entries(enums).map(([key, value]) => ({
    label: key,
    value,
  }));

export const employmentOptions = enumsToOptions(EmploymentEnum);

export const statusOptions = enumsToOptions(StatusEnum);
export const bucketOptions = enumsToOptions(BucketEnum);
