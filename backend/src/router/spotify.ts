import express from "express";
import { isAuthenticated } from "../middlewares";
import {
  searchFromSpotify,
  getTracksFromIds,
  searchByTrack,
  getGenres,
} from "../controllers/spotify";

export default (router: express.Router) => {
  router.post("/spotify/search", isAuthenticated, searchFromSpotify);
  router.get("/spotify/search/track/:q", isAuthenticated, searchByTrack);
  router.get("/spotify/tracks/:ids", isAuthenticated, getTracksFromIds);
  router.get("/spotify/genres", isAuthenticated, getGenres);
};
