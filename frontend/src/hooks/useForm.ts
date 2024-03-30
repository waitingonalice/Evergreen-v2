/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable no-underscore-dangle */
import { useState } from "react";
import isNumber from "lodash/isNumber";
import type { ZodEffects, ZodObject, ZodSchema } from "zod";
import { findKey } from "../utils";

let submitted = false;

interface UseFormType<T> {
  data: T;
  zod: ZodObject<any> | ZodEffects<ZodObject<any>>;
  validationType?: "onSubmit" | "onChange";
}
export type Error<T> = Record<keyof T, string>;
/**
 * @param options - options object
 * @param options.zod - zod schema to be used for validation
 * @param options.data - data to be validated
 * @param options.validationType - type of validation to be used. Default is "onSubmit"
 *
 * @description useForm is a custom hook that uses zod to validate form data. The property names of the data object must match the property names of the zod schema.
 */
export const useForm = <T extends Record<string, any>>({
  zod,
  data,
  validationType = "onSubmit",
}: UseFormType<T>) => {
  const emptyErrorState = {} as Error<T>;
  const [errors, setErrors] = useState<Error<T>>(emptyErrorState);

  const schemaKeys: string[] =
    "keyof" in zod
      ? zod.keyof()._def.values
      : zod._def.schema.keyof()._def.values;

  const subsetSchema = (key: string) =>
    "pick" in zod
      ? zod.pick({ [key]: true })
      : zod._def.schema.pick({ [key]: true });

  // zod middleware to customise default error messages
  const middleware = () => {
    schemaKeys.forEach((key) => {
      const singleSchema = subsetSchema(key);
      if (!singleSchema) return;
      const { shape } = singleSchema._getCached();
      const schemaDefinitions = findKey("checks", shape) as
        | Array<{
            kind: string;
            value: number;
            message?: string;
          }>
        | undefined;
      if (!schemaDefinitions) return;

      for (let i = 0; i < schemaDefinitions.length; i += 1) {
        const schemaCheck = schemaDefinitions[i];
        const hasCustomMessage = "message" in schemaCheck;
        // custom message goes here
        if (schemaCheck.kind === "min" && !hasCustomMessage) {
          schemaCheck.message = "This field is required.";
        }

        if (schemaCheck.kind === "max" && !hasCustomMessage) {
          schemaCheck.message = `This field cannot be longer than ${schemaCheck.value} characters.`;
        }
      }
    });
  };

  middleware();

  return {
    /**
     * @param customSchema - optional custom schema to be used for validation instead of the default schema provided.
     * E.g. To evaluate data in the form of an array of objects
     */
    /**
     * @params id - the id of the element to be validated
     * @params value - the value of the element to be validated
     */
    validate(id: keyof T | string, value: string) {
      if (!zod || (validationType === "onSubmit" && !submitted)) return "";
      const checkValue = isNumber(value) ? Number(value) : value ?? "";
      const singleSchema = subsetSchema(id as string);
      const result = singleSchema.safeParse({
        [id]: checkValue,
      });

      if (result && !result.success) {
        const {
          error: { issues: data },
        } = result;
        setErrors((prev) => ({ ...prev, [id]: data[0].message }));
        return data[0].message;
      }
      setErrors((prev) => ({ ...prev, [id]: "" }));
      return "";
    },

    onSubmit<P extends ZodSchema>(customSchema?: P) {
      submitted = true;
      const result = customSchema
        ? customSchema.safeParse(data)
        : zod.safeParse(data);
      if (!result.success) {
        const submissionErrors = result.error.issues.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.path[0]]: curr.message,
          }),
          {} as typeof errors,
        );
        setErrors(submissionErrors);
        return result.success;
      }
      setErrors(emptyErrorState);
      return result.success;
    },

    errors,

    clearErrors() {
      setErrors(emptyErrorState);
    },
  };
};
