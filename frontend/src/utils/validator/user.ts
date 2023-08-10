import { z } from "zod";

const emailSchema = z
  .string()
  .email({ message: "Invalid email address: local-name@domain" });

const usernameSchema = z
  .string()
  .min(4, { message: "Username must be at least 4 characters long" })
  .max(20, { message: "Username must be less than 20 characters long" })
  .regex(/^[\w\-]{4,20}$/, {
    message:
      "Username must only contain alphanumeric characters, underscores, and hyphens",
  });

const nameSchema = z
  .string()
  .min(4, { message: "Name must be at least 4 characters long" })
  .max(25, { message: "Name must be less than 25 characters long" })
  .regex(/^[\w\s]{4,25}$/, {
    message: "Name must only contain alphanumeric characters and spaces",
  });

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(40, { message: "Password must be less than 40 characters long" })
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,40}$/, {
    message:
      "Password must contain at least one letter, number, and special character",
  });

export const registerSchema = z
  .object({
    email: emailSchema,
    username: usernameSchema,
    name: nameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.confirmPassword && data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

export const updateOnlyInfoSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  name: nameSchema,
});

export const loginWithEmailSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
