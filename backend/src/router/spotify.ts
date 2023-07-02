import express from "express";
import { isAuthenticated } from "../middlewares";
import { searchFromSpotify } from "../controllers/spotify";

export default (router: express.Router) => {
  router.post("/spotify/search", isAuthenticated, searchFromSpotify);
};
