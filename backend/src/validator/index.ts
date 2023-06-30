import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import regex from "../utils/regex";

const registerUserSchema = z.object({
  email: z.string().regex(regex.email, { message: regex.emailDescr }),
  username: z.string().regex(regex.username, { message: regex.usernameDescr }),
  name: z.string().regex(regex.name, { message: regex.nameDescr }),
  password: z.string().regex(regex.password, { message: regex.passwordDescr }),
});

const validate = (schema: z.ZodObject<any, any, any>, input: any) => {
  const result = schema.safeParse(input);

  if (!result.success) {
    return { isValid: false, error: fromZodError(result.error).toString() };
  }

  return { isValid: true };
};

export const validateRegisterUser = (input: any) => {
  return validate(registerUserSchema, input);
};

const loginUserWithEmailSchema = z.object({
  email: z.string().regex(regex.email, { message: regex.emailDescr }),
  password: z.string().regex(regex.password, { message: regex.passwordDescr }),
});

export const validateLoginUserWithEmail = (input: any) => {
  return validate(loginUserWithEmailSchema, input);
};

const loginUserWithUsernameSchema = z.object({
  username: z.string().regex(regex.username, { message: regex.usernameDescr }),
  password: z.string().regex(regex.password, { message: regex.passwordDescr }),
});

export const validateLoginUserWithUsername = (input: any) => {
  return validate(loginUserWithUsernameSchema, input);
};
