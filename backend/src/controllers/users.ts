import express from "express";

import {
  addFavoriteArtist,
  addFavoriteGenre,
  deleteUserById,
  getUserById,
  getUsers,
  removeFavoriteArtist,
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

    await addFavoriteGenre(id, genre);
    user!.favorite_genres.push(genre);
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

    await removeFavoriteGenre(id, genre);
    user!.favorite_genres = user!.favorite_genres.filter(
      (gen: string) => gen !== genre
    );
    return res.status(200).json(user).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const addArtist = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { artist } = req.body;

    if (!artist) {
      return res.status(400).json({ message: "Missing artist" });
    }

    var user = await getUserById(id);
    if (user!.favorite_artists.includes(artist)) {
      return res.status(400).json({ message: "Already a favorite artist" });
    }

    await addFavoriteArtist(id, artist);
    user!.favorite_artists.push(artist);
    return res.status(200).json(user).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const removeArtist = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id, artist } = req.params;

    if (!artist) {
      return res.status(400).json({ message: "Missing artist" });
    }

    var user = await getUserById(id);
    if (!user!.favorite_artists.includes(artist)) {
      return res.status(400).json({ message: "Not a favorite artist" });
    }

    await removeFavoriteArtist(id, artist);
    user!.favorite_artists = user!.favorite_artists.filter(
      (art: string) => art !== artist
    );
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
