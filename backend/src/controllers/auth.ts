import { createUser, getUserByEmail, getUserByUsername } from "../db/Users";
import express from "express";
import { hashPwd, randomSalt } from "../utils";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username, name } = req.body;

    if (!email || !password || !username || !name) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const existingUserByEmail = await getUserByEmail(email);
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }

    const existingUserByUsername = await getUserByUsername(username);
    if (existingUserByUsername) {
      return res
        .status(400)
        .json({ message: "An account with this username already exists" });
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
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = await getUserByEmail(email).select(
      "+auth.salt +auth.password"
    );

    if (!user) {
      return res
        .status(400)
        .json({ message: "An user with this email does not exist" });
    }

    const expectedHash = hashPwd(user.auth.salt, password);
    if (user.auth.password !== expectedHash) {
      return res.status(403).json({ message: "Invalid password" });
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
    return res.status(500).json({ message: error.message });
  }
};
