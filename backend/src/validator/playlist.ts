import { z } from "zod";
import regex from "../utils/regex";
import { validate } from "./index";

const createPlaylistSchema = z.object({
  title: z
    .string()
    .regex(regex.playlistTitle, { message: regex.playlistTitleDescr }),
  description: z.string().regex(regex.playlistDescription, {
    message: regex.playlistDescriptionDescr,
  }),
  tags: z
    .array(
      z.string().regex(regex.playlistTag, { message: regex.playlistTagDescr })
    )
    .optional(),
});

export const validateCreatePlaylist = (input: any) => {
  return validate(createPlaylistSchema, input);
};
