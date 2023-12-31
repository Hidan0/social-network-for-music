import {
  createUser,
  getUserByEmail,
  getUserBySessionToken,
  getUserByUsername,
} from "../db/Users";
import express from "express";
import { hashPwd, randomSalt } from "../utils";
import {
  validateLoginUserWithEmail,
  validateLoginUserWithUsername,
  validateRegisterUser,
} from "../validator";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username, name } = req.body;

    const { isValid, error } = validateRegisterUser({
      email,
      password,
      username,
      name,
    });

    if (!isValid) {
      return res.status(400).json({ message: error });
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
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, username, password } = req.body;

    let user;
    if (!username && email) {
      let { isValid, error } = validateLoginUserWithEmail({
        email,
        password,
      });

      if (!isValid) {
        return res.status(400).json({ message: error });
      }
      user = await getUserByEmail(email).select("+auth.salt +auth.password");

      if (!user) {
        return res
          .status(400)
          .json({ message: "An user with this email does not exist" });
      }
    } else if (!email && username) {
      let { isValid, error } = validateLoginUserWithUsername({
        username,
        password,
      });

      if (!isValid) {
        return res.status(400).json({ message: error });
      }

      user = await getUserByUsername(username).select(
        "+auth.salt +auth.password"
      );

      if (!user) {
        return res
          .status(400)
          .json({ message: "An user with this username does not exist" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "An email or username is required for login" });
    }

    const expectedHash = hashPwd(user.auth.salt, password);
    if (user.auth.password !== expectedHash) {
      return res.status(403).json({ message: "Wrong password" });
    }

    const salt = randomSalt();
    user.auth.sessionToken = hashPwd(salt, user._id.toString());

    await user.save();

    res.setHeader("SNM-AUTH", user.auth.sessionToken);

    return res.status(200).json(user).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const validToken = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const sessionToken = req.header("SNM-AUTH");
    if (!sessionToken) {
      return res.status(400).json({ message: "No session token provided" });
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.status(200).json({ isValid: false }).end();
    }
    return res.status(200).json({ isValid: true }).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
