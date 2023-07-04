import express from "express";
import { getUserBySessionToken } from "../db/Users";
import { getPlaylistById } from "../db/Playlists";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["SNM-AUTH"];

    if (!sessionToken) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(403).json({ message: "Session expired" });
    }

    req.identity = existingUser;
    next();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = req.identity?._id;

    if (!currentUserId) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    if (currentUserId.toString() !== id) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this resource" });
    }

    next();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const isPlaylistAuthor = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { playlistId } = req.params;
    const userId = req.identity?._id;

    if (!userId) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const playlist = await getPlaylistById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.author.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not the author if the playlist",
      });
    }

    req.playlist = playlist;
    next();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
