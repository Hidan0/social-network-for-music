import { defineStore } from "pinia";
import { instance as axios } from "../../utils";
import { TrackData, PlaylistData, PlaylistState } from "./types";
import useUserStore from "../user";

const $user = useUserStore();

export default defineStore("playlist", {
  state: (): PlaylistState & { outdated: boolean } => ({
    _id: undefined,
    author: undefined,
    title: undefined,
    description: undefined,
    tags: undefined,
    isPrivate: undefined,
    tracks: undefined,
    collaborators: undefined,
    outdated: false,
  }),
  getters: {
    loaded(): boolean {
      return Object.values(this as PlaylistState).every(
        (prop) => prop !== undefined
      );
    },
  },
  actions: {
    _isValidId(id: string): boolean {
      return this._id !== undefined && this._id === id && !this.outdated;
    },
    async getPublicPlaylists(): Promise<PlaylistData[]> {
      try {
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
      } catch (err: any) {
        throw new Error(err.response.data.message);
      }
    },
    async getPlaylists(): Promise<PlaylistData[]> {
      try {
        const res = await axios.get("/playlists/", {
          headers: {
            "SNM-AUTH": $user.token,
          },
        });

        return res.data;
      } catch (err: any) {
        throw new Error(err.response.data.message);
      }
    },
    async setPlaylist(id: string): Promise<void> {
      if (!this._isValidId(id)) {
        try {
          const res = await axios.get(`/playlists/${id}`, {
            headers: {
              "SNM-AUTH": $user.token,
            },
          });

          this._id = res.data._id;
          this.author = res.data.author;
          this.title = res.data.title;
          this.description = res.data.description;
          this.tags = res.data.tags;
          this.isPrivate = res.data.isPrivate;
          this.tracks = res.data.tracks;
          this.collaborators = res.data.collaborators;
          this.outdated = false;
        } catch (err: any) {
          throw new Error(err.response.data.message);
        }
      }

      if (!this.loaded) {
        this._id = undefined;
        this.outdated = true;
        throw new Error("Can not load this playlist");
      }
    },

    async getTracks(trackIds: string[]): Promise<TrackData[]> {
      try {
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
      } catch (err: any) {
        throw new Error(err.response.data.message);
      }
    },
    async removeTrackFromPlaylist(
      trackId: string,
      playlistId: string
    ): Promise<void> {
      try {
        await axios.delete(`/playlists/${playlistId}/tracks/${trackId}`, {
          headers: {
            "SNM-AUTH": $user.token,
          },
        });
      } catch (err: any) {
        throw new Error(err.response.data.message);
      }
    },
    async removeCollaboratorFromPlaylist(
      playlistId: string,
      collabId: string
    ): Promise<void> {
      if (!this._isValidId(playlistId)) {
        throw new Error("Invalid playlist id");
      }

      try {
        await axios.delete(
          `/playlists/${playlistId}/collaborator/${collabId}`,
          {
            headers: {
              "SNM-AUTH": $user.token,
            },
          }
        );
        this.outdated = true;
      } catch (err: any) {
        throw new Error(err.response.data.message);
      }
    },
    async updatePlaylist(
      playlistId: string,
      data: {
        title: string;
        description: string;
        tags: string[];
        isPrivate: boolean;
      }
    ): Promise<void> {
      if (!this.loaded) {
        throw new Error(
          "Unable to update this playlist because it was not loaded correctly"
        );
      }

      if (!this._isValidId(playlistId)) {
        throw new Error("Invalid playlist id");
      }

      try {
        await axios.patch(`/playlists/${playlistId}`, data, {
          headers: {
            "SNM-AUTH": $user.token,
          },
        });
        this.outdated = true;
      } catch (err: any) {
        throw new Error(err.response.data.message);
      }
    },
    async followPlaylist(playlistId: string): Promise<void> {
      if (!this.loaded) {
        throw new Error(
          "Unable to follow this playlist because it was not loaded correctly"
        );
      }

      if (!this._isValidId(playlistId)) {
        throw new Error("Invalid playlist id");
      }

      try {
        await axios.put(
          `/playlists/${playlistId}/collaborator/${$user.id}`,
          {},
          {
            headers: {
              "SNM-AUTH": $user.token,
            },
          }
        );
        this.outdated = true;
      } catch (error: any) {
        throw new Error(error.response.data.message);
      }
    },
  },
});
