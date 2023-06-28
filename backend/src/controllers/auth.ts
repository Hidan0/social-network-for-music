import { createUser, getUserByEmail, getUserByUsername } from "../db/Users";
import express from "express";
import { hashPwd, randomSalt } from "../utils";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username, name } = req.body;

    if (!email || !password || !username || !name) {
      return res.sendStatus(400);
    }

    const existingUserByEmail = await getUserByEmail(email);

    if (existingUserByEmail) {
      return res.sendStatus(400);
    }

    const existingUserByUsername = await getUserByUsername(username);
    if (existingUserByUsername) {
      return res.sendStatus(400);
    }

    const salt = randomSalt();
    const user = await createUser({
      email,
      username,
      name,
      auth: {
        salt,
        password: hashPwd(salt, password),
      },
    });

    return res.status(201).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      "+auth.salt +auth.password"
    );

    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = hashPwd(user.auth.salt, password);
    if (user.auth.password !== expectedHash) {
      return res.sendStatus(403);
    }

    const salt = randomSalt();
    user.auth.sessionToken = hashPwd(salt, user._id.toString());

    await user.save();

    res.cookie("SNM-AUTH", user.auth.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
