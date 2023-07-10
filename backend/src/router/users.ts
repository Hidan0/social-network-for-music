import express from "express";
import {
  deleteUser,
  editGenres,
  getAllUsers,
  getUser,
} from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.get("/users/:id", isAuthenticated, getUser);
  router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
  router.patch("/users/:id/genres", isAuthenticated, isOwner, editGenres);
};
