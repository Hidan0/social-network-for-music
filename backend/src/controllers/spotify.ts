import express from "express";
import { getSpotifyToken } from "../utils/spotify";
import axios from "axios";

const SPOTY_API = "https://api.spotify.com/v1";

const instance = axios.create({ baseURL: SPOTY_API, withCredentials: true });

export const searchByTrack = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { q } = req.params;

    if (!q) {
      return res.status(400).json({ message: "Missing query" });
    }

    const token = await getSpotifyToken();
    const response = await fetch(
      `${SPOTY_API}/search?q=${q}&type=track&limit=15`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    const data = await response.json();
    return res.status(200).json(data).end();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const searchArtist = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { q } = req.params;

    if (!q) {
      return res.status(400).json({ message: "Missing query" });
    }

    const token = await getSpotifyToken();
    const response = await instance.get(`/search?q=${q}&type=artist&limit=10`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    return res.status(200).json(response.data).end();
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
    const { ids } = req.params;

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

export const getGenres = async (
  _req: express.Request,
  res: express.Response
) => {
  try {
    const token = await getSpotifyToken();
    const sptRes = await instance.get(
      "/recommendations/available-genre-seeds",
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

export const getRecommendation = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { genres } = req.params;

    if (!genres) {
      return res.status(400).json({ message: "Missing genres" });
    }

    const token = await getSpotifyToken();
    const sptRes = await instance.get(
      `/recommendations?seed_genres=${genres}&limit=10`,
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
