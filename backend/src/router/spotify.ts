import express from "express";
import { isAuthenticated } from "../middlewares";
import { searchFromSpotify, getTracksFromIds } from "../controllers/spotify";

export default (router: express.Router) => {
  router.post("/spotify/search", isAuthenticated, searchFromSpotify);
  router.get("/spotify/tracks/:ids", isAuthenticated, getTracksFromIds);
};
