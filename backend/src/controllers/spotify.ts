import express from "express";
import { getSpotifyToken } from "../utils/spotify";
import axios from "axios";

const SPOTY_API = "https://api.spotify.com/v1";

const instance = axios.create({ baseURL: SPOTY_API, withCredentials: true });

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

export const getTracksFromIds = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const ids = req.params.ids;

    if (!ids) {
      return res.status(400).json({ message: "Missing track ids" });
    }

    const token = await getSpotifyToken();
    const sptRes = await instance.get(
      `/tracks?ids=${encodeURIComponent(ids)}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return res.status(200).json(sptRes.data).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
