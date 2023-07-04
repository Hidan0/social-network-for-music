import { fromZodError } from "zod-validation-error";
import { z } from "zod";

export * from "./user";
export * from "./playlist";

export const validate = (schema: z.ZodObject<any, any, any>, input: any) => {
  const result = schema.safeParse(input);

  if (!result.success) {
    return { isValid: false, error: fromZodError(result.error).toString() };
  }

  return { isValid: true };
};
