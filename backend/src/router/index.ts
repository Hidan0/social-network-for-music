import express from "express";

import authentication from "./authentication";
import users from "./users";
import spotify from "./spotify";
import playlists from "./playlists";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  spotify(router);
  playlists(router);
  return router;
};
