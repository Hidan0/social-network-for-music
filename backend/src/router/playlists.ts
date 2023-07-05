import express from "express";
import {
  isAuthenticated,
  isPlaylistAuthor,
  isPlaylistAuthorOrCollaborator,
} from "../middlewares";
import {
  getPlaylists,
  createNewPlaylist,
  getPubPlaylists,
  addCollaborator,
  removeCollaborator,
  deletePlaylist,
  editPlaylist,
  addTrackToPlaylist,
  getTracksFromPlaylist,
  deleteTrackFromPlaylist,
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

  router.post(
    "/playlists/:id/tracks",
    isAuthenticated,
    isPlaylistAuthorOrCollaborator,
    addTrackToPlaylist
  );
  router.get("/playlists/:id/tracks", isAuthenticated, getTracksFromPlaylist);
  router.delete(
    "/playlists/:id/tracks/:trackId",
    isAuthenticated,
    isPlaylistAuthorOrCollaborator,
    deleteTrackFromPlaylist
  );
};
