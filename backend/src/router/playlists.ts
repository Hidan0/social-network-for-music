import express from "express";
import { isAuthenticated } from "../middlewares";
import { createNewPlaylist } from "../controllers/playlists";

export default (router: express.Router) => {
  router.post("/playlists/create", isAuthenticated, createNewPlaylist);
};
