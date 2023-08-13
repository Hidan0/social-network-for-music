import express from "express";
import { isAuthenticated } from "../middlewares";
import {
  searchFromSpotify,
  getTracksFromIds,
  searchByTrack,
  searchArtist,
  getGenres,
} from "../controllers/spotify";

const spotifyRouter = express.Router();

spotifyRouter.post("/spotify/search", isAuthenticated, searchFromSpotify);
spotifyRouter.get("/spotify/search/track/:q", isAuthenticated, searchByTrack);
spotifyRouter.get("/spotify/search/artist/:q", isAuthenticated, searchArtist);
spotifyRouter.get("/spotify/tracks/:ids", isAuthenticated, getTracksFromIds);
spotifyRouter.get("/spotify/genres", isAuthenticated, getGenres);

export default spotifyRouter;
