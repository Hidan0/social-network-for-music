import express from "express";
import { validateCreatePlaylist } from "../validator";
import {
  createPlaylist,
  getPublicPlaylists,
  getPlaylistsInLibrary,
  addCollaboratorToPlaylist,
  removeCollaboratorFromPlaylist,
  deletePlaylistById,
  updatePlaylistById,
  getPlaylistById,
  pushTrackToPlaylist,
  removeTrackFromPlaylist,
  getPlaylistsInLibraryOrPublic,
} from "../db/Playlists";
import { getUserById } from "../db/Users";

export const createNewPlaylist = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = req.identity._id;
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
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const deletePlaylist = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedPlaylist = await deletePlaylistById(id);

    return res.json(deletedPlaylist);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const editPlaylist = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { title, description, tags, isPrivate } = req.body;

    const { isValid, error } = validateCreatePlaylist({
      title,
      description,
      tags,
    });

    if (!isValid) {
      return res.status(400).json({ message: error });
    }

    const playlist = await updatePlaylistById(id, {
      title,
      description,
      tags,
      isPrivate,
    });
    return res.status(200).json(playlist).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

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

export const getLibraryPlaylists = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = req.identity._id;

    if (!userId) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const playlists = await getPlaylistsInLibrary(userId.toString());
    return res.status(200).json(playlists).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getAvailablePlaylists = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = req.identity._id;

    if (!userId) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    const playlists = await getPlaylistsInLibraryOrPublic(userId.toString());
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
    const { id, collId } = req.params;

    const playlist = await getPlaylistById(id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.author.toString() === collId) {
      return res.status(400).json({ message: "You are the owner" });
    }

    const user = await getUserById(collId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (playlist.collaborators.find((c) => c.toString() === collId)) {
      return res.status(400).json({ message: "Already a collaborator" });
    }

    const updatedPlaylist = await addCollaboratorToPlaylist(id, collId);
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
    const { id, collId } = req.params;

    const user = await getUserById(collId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const playlist = req.playlist.toObject();
    if (!playlist.collaborators.find((c) => c.toString() === collId)) {
      if (req.identity._id.toString() === collId)
        return res.status(400).json({ message: "You are the owner" });
      else return res.status(400).json({ message: "Not a collaborator" });
    }

    if (
      req.identity._id.toString() !== playlist.author.toString() &&
      req.identity._id.toString() !== collId
    ) {
      return res.status(403).json({
        message:
          "You are not the owner, you can not remove other collaborators",
      });
    }

    const updatedPlaylist = await removeCollaboratorFromPlaylist(id, collId);
    return res.status(200).json(updatedPlaylist).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getTracksFromPlaylist = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = req.identity._id;
    const { id } = req.params;

    const playlist = await getPlaylistById(id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (
      playlist.isPrivate &&
      playlist.author.toString() !== userId.toString() &&
      !playlist.collaborators.find((c) => c.toString() === userId.toString())
    ) {
      return res.status(403).json({ message: "Private playlist" });
    }

    return res.status(200).json(playlist.tracks).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const addTrackToPlaylist = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { track } = req.body;
    const playlistObj = req.playlist.toObject();

    if (!track) {
      return res.status(400).json({ message: "No track provided" });
    }

    if (playlistObj.tracks.includes(track)) {
      return res.status(400).json({ message: "Track already in playlist" });
    }

    const playlist = await pushTrackToPlaylist(
      req.playlist._id.toString(),
      track
    );

    return res.status(200).json(playlist).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTrackFromPlaylist = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { trackId } = req.params;
    const playlistObj = req.playlist.toObject();

    if (!playlistObj.tracks.includes(trackId)) {
      return res.status(400).json({ message: "Track not in playlist" });
    }

    const playlist = await removeTrackFromPlaylist(
      req.playlist._id.toString(),
      trackId
    );

    return res.status(200).json(playlist).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getPlaylist = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    return res.status(200).json(req.playlist).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
