import express from "express";
import { getSpotifyToken } from "../utils/spotify";

const SPOTY_API = "https://api.spotify.com/v1";

export const searchFromSpotify = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { q, type } = req.body;

    if (!q || !type) {
      return res.status(400).json({ message: "Missing query or type" });
    }

    const token = await getSpotifyToken();
    const response = await fetch(`${SPOTY_API}/search?q=${q}&type=${type}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    const data = await response.json();
    return res.status(200).json(data).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
