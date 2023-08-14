import express from "express";
import { isAuthenticated } from "../middlewares";
import {
  getTracksFromIds,
  searchByTrack,
  searchArtist,
  getGenres,
  getRecommendation,
} from "../controllers/spotify";

const spotifyRouter = express.Router();

spotifyRouter.get("/spotify/search/track/:q", isAuthenticated, searchByTrack);
spotifyRouter.get("/spotify/search/artist/:q", isAuthenticated, searchArtist);
spotifyRouter.get("/spotify/tracks/:ids", isAuthenticated, getTracksFromIds);
spotifyRouter.get("/spotify/genres", isAuthenticated, getGenres);
spotifyRouter.get(
  "/spotify/recommendations/:genres",
  isAuthenticated,
  getRecommendation
);

export default spotifyRouter;
