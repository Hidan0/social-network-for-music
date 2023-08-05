import express from "express";
import {
  isAccessible,
  isAuthenticated,
  isPlaylistAuthor,
  isPlaylistAuthorOrCollaborator,
} from "../middlewares";
import {
  getLibraryPlaylists,
  createNewPlaylist,
  getPubPlaylists,
  addCollaborator,
  removeCollaborator,
  deletePlaylist,
  editPlaylist,
  addTrackToPlaylist,
  getTracksFromPlaylist,
  deleteTrackFromPlaylist,
  getPlaylist,
  getAvailablePlaylists,
} from "../controllers/playlists";

export default (router: express.Router) => {
  router.post("/playlists/create", isAuthenticated, createNewPlaylist);
  router.get("/playlists/", isAuthenticated, getAvailablePlaylists);
  router.get("/playlists/library", isAuthenticated, getLibraryPlaylists);
  router.get("/playlists/public", getPubPlaylists);

  router.put(
    "/playlists/:id/collaborator/:collId",
    isAuthenticated,
    addCollaborator
  );
  router.delete(
    "/playlists/:id/collaborator/:collId",
    isAuthenticated,
    isPlaylistAuthorOrCollaborator,
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

  router.get("/playlists/:id", isAuthenticated, isAccessible, getPlaylist);
};
