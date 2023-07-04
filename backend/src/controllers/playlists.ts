import express from "express";
import { validateCreatePlaylist } from "../validator";
import {
  createPlaylist,
  getPublicPlaylists,
  getAllPlaylists,
  addCollaboratorToPlaylist,
  removeCollaboratorFromPlaylist,
} from "../db/Playlists";
import { getUserById } from "../db/Users";

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

export const deletePlaylist = async (
  req: express.Request,
  res: express.Response
) => {};

export const editPlaylist = async (
  req: express.Request,
  res: express.Response
) => {};

export const getPubPlaylists = async (
  _req: express.Request,
  res: express.Response
) => {
  try {
    const playlists = await getPublicPlaylists();
    return res.status(200).json(playlists).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getPlaylists = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = req.identity?._id;

    if (!userId) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const playlists = await getAllPlaylists(userId.toString());
    return res.status(200).json(playlists).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const addCollaborator = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { playlistId, collId } = req.params;

    if (req.identity?._id.toString() === collId) {
      return res.status(400).json({ message: "You are the owner" });
    }

    const user = await getUserById(collId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const playlist = req.playlist!.toObject();
    if (playlist.collaborators.find((c) => c.toString() === collId)) {
      return res.status(400).json({ message: "Already a collaborator" });
    }

    const updatedPlaylist = await addCollaboratorToPlaylist(playlistId, collId);
    return res.status(200).json(updatedPlaylist).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const removeCollaborator = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { playlistId, collId } = req.params;

    if (req.identity?._id.toString() === collId) {
      return res.status(400).json({ message: "You are the owner" });
    }

    const user = await getUserById(collId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const playlist = req.playlist!.toObject();
    if (!playlist.collaborators.find((c) => c.toString() === collId)) {
      return res.status(400).json({ message: "Not a collaborator" });
    }

    const updatedPlaylist = await removeCollaboratorFromPlaylist(
      playlistId,
      collId
    );
    return res.status(200).json(updatedPlaylist).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
