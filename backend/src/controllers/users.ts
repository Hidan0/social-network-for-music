import express from "express";

import { deleteUserById, getUserById, getUsers } from "../db/Users";

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

export const editGenres = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { genres } = req.body;

    if (!genres) {
      return res.status(400).json({ message: "Missing genres" });
    }

    const user = await getUserById(id);
    user!.favorite_genres = genres;

    await user!.save();

    return res.status(200).json(user).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
