import express from "express";
import { validateCreatePlaylist } from "../validator";
import { createPlaylist, getPublicPlaylists } from "../db/Playlists";

export const createNewPlaylist = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = req.identity?._id;
    const { title, description, tags, isPrivate } = req.body;

    const { isValid, error } = validateCreatePlaylist({
      title,
      description,
      tags,
    });

    if (!isValid) {
      return res.status(400).json({ message: error });
    }

    if (!userId) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const playlist = await createPlaylist({
      title,
      description,
      tags,
      isPrivate,
      author: userId,
    });

    return res.status(201).json(playlist).end();
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPubPlaylists = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const playlists = await getPublicPlaylists();
    return res.status(200).json(playlists).end();
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
