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
  searchPlaylists,
} from "../controllers/playlists";

const playlistRouter = express.Router();

playlistRouter.post("/playlists/create", isAuthenticated, createNewPlaylist);
playlistRouter.get("/playlists/", isAuthenticated, getAvailablePlaylists);
playlistRouter.get("/playlists/library", isAuthenticated, getLibraryPlaylists);
playlistRouter.get("/playlists/public", getPubPlaylists);
playlistRouter.get("/playlists/search", isAuthenticated, searchPlaylists);

playlistRouter.put(
  "/playlists/:id/collaborator/:collId",
  isAuthenticated,
  addCollaborator
);
playlistRouter.delete(
  "/playlists/:id/collaborator/:collId",
  isAuthenticated,
  isPlaylistAuthorOrCollaborator,
  removeCollaborator
);

playlistRouter.delete(
  "/playlists/:id",
  isAuthenticated,
  isPlaylistAuthor,
  deletePlaylist
);
playlistRouter.patch(
  "/playlists/:id",
  isAuthenticated,
  isPlaylistAuthor,
  editPlaylist
);

playlistRouter.post(
  "/playlists/:id/tracks",
  isAuthenticated,
  isPlaylistAuthorOrCollaborator,
  addTrackToPlaylist
);
playlistRouter.get(
  "/playlists/:id/tracks",
  isAuthenticated,
  getTracksFromPlaylist
);
playlistRouter.delete(
  "/playlists/:id/tracks/:trackId",
  isAuthenticated,
  isPlaylistAuthorOrCollaborator,
  deleteTrackFromPlaylist
);

playlistRouter.get(
  "/playlists/:id",
  isAuthenticated,
  isAccessible,
  getPlaylist
);

export default playlistRouter;
