import express from "express";
import { isAuthenticated } from "../middlewares";
import { createNewPlaylist, getPubPlaylists } from "../controllers/playlists";

export default (router: express.Router) => {
  router.post("/playlists/create", isAuthenticated, createNewPlaylist);
  router.get("/playlists/public", getPubPlaylists);
};
