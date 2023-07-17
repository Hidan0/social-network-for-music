import { defineStore } from "pinia";
import { instance as axios } from "../../utils";
import { TrackData, PlaylistData } from "./types";
import useUserStore from "../user";

const $user = useUserStore();

export default defineStore("playlist", {
  state: () => ({}),
  getters: {},
  actions: {
    async getPublicPlaylists(): Promise<PlaylistData[]> {
      const res = await axios.get("/playlists/public");

      return res.data.map((playlist: any) => {
        return {
          _id: playlist._id,
          title: playlist.title,
          author: playlist.author.username,
          tags: playlist.tags,
          description: playlist.description,
        } as PlaylistData;
      }) as PlaylistData[];
    },

    async getPlaylistById(id: string): Promise<PlaylistData> {
      const res = await axios.get(`/playlists/${id}`, {
        headers: {
          "SNM-AUTH": $user.token,
        },
      });

      return res.data;
    },

    async getTracks(trackIds: string[]): Promise<TrackData[]> {
      const res = await axios.get(`/spotify/tracks/${trackIds.join(",")}`, {
        headers: {
          "SNM-AUTH": $user.token,
        },
      });

      let tracks: TrackData[] = [];

      res.data.tracks.forEach((track: any) => {
        tracks.push({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          duration: track.duration_ms,
          imgSrc: track.album.images[2].url,
        });
      });

      return tracks;
    },
    async removeTrackFromPlaylist(
      trackId: string,
      playlistId: string
    ): Promise<void> {
      await axios.delete(`/playlists/${playlistId}/tracks/${trackId}`, {
        headers: {
          "SNM-AUTH": $user.token,
        },
      });
    },
    async removeCollaboratorFromPlaylist(
      playlistId: string,
      collabId: string
    ): Promise<void> {
      await axios.delete(`/playlists/${playlistId}/collaborator/${collabId}`, {
        headers: {
          "SNM-AUTH": $user.token,
        },
      });
    },
  },
});
