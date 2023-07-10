import { defineStore } from "pinia";
import { instance as axios } from "../../utils";
import { PlaylistData } from "./types";

export default defineStore("playlist", {
  state: () => ({}),
  getters: {},
  actions: {
    async getPublicPlaylists(): Promise<PlaylistData[]> {
      const res = await axios.get("/playlists/public");

      return res.data;
    },
  },
});
