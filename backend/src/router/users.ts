import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  removeGenre,
  addGenre,
  removeArtist,
  addArtist,
  updateUser,
} from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";

const usersRouter = express.Router();

usersRouter.get("/users", isAuthenticated, getAllUsers);
usersRouter.get("/users/:id", isAuthenticated, getUser);
usersRouter.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
usersRouter.delete(
  "/users/:id/genres/:genre",
  isAuthenticated,
  isOwner,
  removeGenre
);
usersRouter.put("/users/:id/genres", isAuthenticated, isOwner, addGenre);
usersRouter.delete(
  "/users/:id/artists/:artist",
  isAuthenticated,
  isOwner,
  removeArtist
);
usersRouter.put("/users/:id/artists", isAuthenticated, isOwner, addArtist);
usersRouter.patch("/users/:id", isAuthenticated, isOwner, updateUser);

export default usersRouter;
