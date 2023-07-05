import express from "express";
import { isAuthenticated, isPlaylistAuthor } from "../middlewares";
import {
  getPlaylists,
  createNewPlaylist,
  getPubPlaylists,
  addCollaborator,
  removeCollaborator,
  deletePlaylist,
  editPlaylist,
} from "../controllers/playlists";

export default (router: express.Router) => {
  router.post("/playlists/create", isAuthenticated, createNewPlaylist);
  router.get("/playlists/", isAuthenticated, getPlaylists);
  router.get("/playlists/public", getPubPlaylists);

  router.put(
    "/playlists/:id/collaborator/:collId",
    isAuthenticated,
    isPlaylistAuthor,
    addCollaborator
  );
  router.delete(
    "/playlists/:id/collaborator/:collId",
    isAuthenticated,
    isPlaylistAuthor,
    removeCollaborator
  );

  router.delete(
    "/playlists/:id",
    isAuthenticated,
    isPlaylistAuthor,
    deletePlaylist
  );
  router.patch(
    "/playlists/:id",
    isAuthenticated,
    isPlaylistAuthor,
    editPlaylist
  );

  router.post("/playlist/:id/tracks");
  router.get("/playlist/:id/tracks");
  router.delete("/playlist/:id/tracks/:trackId");
};
