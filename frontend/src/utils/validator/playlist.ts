import { z } from "zod";

const titleSchema = z
  .string()
  .min(4, { message: "Title must be at least 4 characters long" })
  .max(50, { message: "Title must be less than 50 characters long" })
  .regex(/^[\w\s\-.,!?:]{4,50}$/, {
    message:
      "Title must only contain alphanumeric characters, spaces and special characters (e.g. -.,!?:)",
  });

const descriptionSchema = z
  .string()
  .min(4, { message: "Description must be at least 4 characters long" })
  .max(200, { message: "Description must be less than 200 characters long" })
  .regex(/^[\w\s\-.,!?:\n@$!%*#?&^]{4,200}$/, {
    message:
      "Description must only contain alphanumeric characters, spaces and special characters",
  });

const tagSchema = z
  .string()
  .min(2, { message: "Tag must be at least 2 characters long" })
  .max(16, { message: "Tag must be less than 16 characters long" })
  .regex(/[\w\-]{2,16}$/, {
    message: "Tag must only contain alphanumeric characters and hyphens",
  });

export const createPlaylistSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  tags: z.array(tagSchema).optional(),
  isPrivate: z.boolean(),
});
