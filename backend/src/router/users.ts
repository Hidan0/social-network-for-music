import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  removeGenre,
  addGenre,
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
};
