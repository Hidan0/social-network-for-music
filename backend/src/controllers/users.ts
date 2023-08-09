import express from "express";

import {
  addFavoriteGenre,
  deleteUserById,
  getUserById,
  getUsers,
  removeFavoriteGenre,
} from "../db/Users";

export const getAllUsers = async (
  _req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    return res.json(deletedUser);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const addGenre = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { genre } = req.body;

    if (!genre) {
      return res.status(400).json({ message: "Missing genre" });
    }

    var user = await getUserById(id);
    if (user!.favorite_genres.includes(genre)) {
      return res.status(400).json({ message: "Already a favorite genre" });
    }

    user = await addFavoriteGenre(id, genre);
    return res.status(200).json(user).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const removeGenre = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id, genre } = req.params;

    if (!genre) {
      return res.status(400).json({ message: "Missing genre" });
    }

    var user = await getUserById(id);
    if (!user!.favorite_genres.includes(genre)) {
      return res.status(400).json({ message: "Not a favorite genre" });
    }

    user = await removeFavoriteGenre(id, genre);
    return res.status(200).json(user).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
