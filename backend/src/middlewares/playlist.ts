import express from "express";
import { getPlaylistById } from "../db/Playlists";

export const isPlaylistAuthor = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.identity._id;

    if (!id) {
      return res.status(400).json({ message: "Playlist id is required" });
    }

    const playlist = await getPlaylistById(id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.author.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not the author of the playlist",
      });
    }

    req.playlist = playlist;
    next();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const isPlaylistAuthorOrCollaborator = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.identity._id;

    if (!id) {
      return res.status(400).json({ message: "Playlist id is required" });
    }

    const playlist = await getPlaylistById(id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (
      playlist.author.toString() !== userId.toString() &&
      !playlist.collaborators.includes(userId.toString())
    ) {
      return res.status(403).json({
        message: "You are not the author or collaborator of the playlist",
      });
    }

    req.playlist = playlist;
    next();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const isAccessible = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.identity._id;

    if (!id) {
      return res.status(400).json({ message: "Playlist id is required" });
    }

    const playlist = await getPlaylistById(id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (!playlist.isPrivate) {
      req.playlist = playlist;
      return next();
    }

    if (
      playlist.author.toString() !== userId.toString() &&
      !playlist.collaborators.includes(userId.toString())
    ) {
      return res.status(403).json({
        message:
          "Private playlist: You are not the author or collaborator of the playlist",
      });
    }

    req.playlist = playlist;
    next();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
