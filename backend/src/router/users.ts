import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  removeGenre,
  addGenre,
  removeArtist,
  addArtist,
} from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.get("/users/:id", isAuthenticated, getUser);
  router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
  router.delete(
    "/users/:id/genres/:genre",
    isAuthenticated,
    isOwner,
    removeGenre
  );
  router.put("/users/:id/genres", isAuthenticated, isOwner, addGenre);
  router.delete(
    "/users/:id/artists/:artist",
    isAuthenticated,
    isOwner,
    removeArtist
  );
  router.put("/users/:id/artists", isAuthenticated, isOwner, addArtist);
};
