import express from "express";
import { isAuthenticated, isPlaylistAuthor } from "../middlewares";
import {
  getPlaylists,
  createNewPlaylist,
  getPubPlaylists,
  addCollaborator,
  removeCollaborator,
} from "../controllers/playlists";

export default (router: express.Router) => {
  router.post("/playlists/create", isAuthenticated, createNewPlaylist);
  router.get("/playlists/", isAuthenticated, getPlaylists);
  router.get("/playlists/public", getPubPlaylists);

  router.put(
    "/playlists/:playlistId/collaborator/:collId",
    isAuthenticated,
    isPlaylistAuthor,
    addCollaborator
  );
  router.delete(
    "/playlists/:playlistId/collaborator/:collId",
    isAuthenticated,
    isPlaylistAuthor,
    removeCollaborator
  );
};
