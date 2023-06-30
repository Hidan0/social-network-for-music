import express from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../db/Users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["SNM-AUTH"];

    if (!sessionToken) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(403).json({ message: "Session expired" });
    }

    merge(req, { identity: existingUser });
    next();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as unknown as string;

    if (!currentUserId) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    if (currentUserId.toString() !== id) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this resource" });
    }

    next();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
