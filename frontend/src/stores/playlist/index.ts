import { defineStore } from "pinia";
import { instance as axios } from "../../utils";
import {
  TrackData,
  PlaylistData,
  PlaylistState,
  CreatePlaylistData,
  TrackCache,
} from "./types";
import useUserStore from "../user";
import { AxiosError } from "axios";
import store from "store2";

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
  actions: {
    _isValidId(id: string): boolean {
      return this._id !== undefined && this._id === id;
    },
    _hasLoaded(): boolean {
      return Object.values(this as PlaylistState).every(
        (prop) => prop !== undefined
      );
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
      } catch (error: any) {
        switch (true) {
          case error instanceof AxiosError:
            throw new Error(error.response.data.message);
          default:
            throw new Error("Internal error");
        }
      }
    },
    async getLibraryPlaylists(): Promise<PlaylistData[]> {
      try {
        const res = await axios.get("/playlists/library", {
          headers: {
            "SNM-AUTH": $user.token,
          },
        });

        return res.data;
      } catch (error: any) {
        switch (true) {
          case error instanceof AxiosError:
            throw new Error(error.response.data.message);
          default:
            throw new Error("Internal error");
        }
      }
    },
    async getAvailablePlaylists(): Promise<PlaylistData[]> {
      try {
        const res = await axios.get("/playlists", {
          headers: {
            "SNM-AUTH": $user.token,
          },
        });

        return res.data;
      } catch (error: any) {
        switch (true) {
          case error instanceof AxiosError:
            throw new Error(error.response.data.message);
          default:
            throw new Error("Internal error");
        }
      }
    },
    async setPlaylist(id: string): Promise<void> {
      if (!this._isValidId(id) || this.outdated) {
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

          return;
        } catch (error: any) {
          switch (true) {
            case error instanceof AxiosError:
              throw new Error(error.response.data.message);
            default:
              throw new Error("Internal error");
          }
        }
      }

      if (!this._hasLoaded()) {
        throw new Error("Can not load this playlist");
      }
    },
    async createPlaylist(data: CreatePlaylistData): Promise<void> {
      try {
        await axios.post("/playlists/create", data, {
          headers: {
            "SNM-AUTH": $user.token,
          },
        });
      } catch (error: any) {
        switch (true) {
          case error instanceof AxiosError:
            throw new Error(error.response.data.message);
          default:
            throw new Error("Internal error");
        }
      }
    },
    _checkCachedTracks(trackIds: { ids: string[] }): TrackData[] {
      let tracks: TrackData[] = [];

      if (store.has("tracks")) {
        const cachedTracks = store.get("tracks") as TrackCache;

        if (Object.keys(cachedTracks).length === 0) {
          return [];
        }

        for (let i = 0; i < trackIds.ids.length; i++) {
          const track = cachedTracks[trackIds.ids[i]];
          if (track !== undefined) {
            tracks.push(track);
            trackIds.ids.splice(i, 1);
          }
        }
      }
      return tracks;
    },
    _cacheTrack(track: TrackData): void {
      if (store.has("tracks")) {
        const cachedTracks = store.get("tracks") as TrackCache;
        cachedTracks[track.id] = track;
        store.set("tracks", cachedTracks);
      } else {
        const cachedTracks = {} as TrackCache;
        cachedTracks[track.id] = track;
        store.set("tracks", cachedTracks);
      }
    },
    async getTracks(trackIds: string[]): Promise<TrackData[]> {
      try {
        let tracks: TrackData[] = this._checkCachedTracks({ ids: trackIds });

        const res = await axios.get(`/spotify/tracks/${trackIds.join(",")}`, {
          headers: {
            "SNM-AUTH": $user.token,
          },
        });

        res.data.tracks.forEach((track: any) => {
          const t: TrackData = {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            duration: track.duration_ms,
            imgSrc: track.album.images[2].url,
          };
          this._cacheTrack(t);
          tracks.push(t);
        });

        return tracks;
      } catch (error: any) {
        switch (true) {
          case error instanceof AxiosError:
            throw new Error(error.response.data.message);
          default:
            throw new Error("Internal error");
        }
      }
    },
    async searchByTrack(
      track: string,
      artist: string,
      album: string,
      year: string
    ): Promise<TrackData[]> {
      try {
        var q = track;
        if (artist !== "") q += ` artist:${artist}`;
        if (album !== "") q += ` album:${album}`;
        if (year !== "") q += ` year:${year}`;

        const res = await axios.get(
          `/spotify/search/track/${encodeURIComponent(q)}`,
          {
            headers: {
              "SNM-AUTH": $user.token,
            },
          }
        );

        let tracks: TrackData[] = [];

        res.data.tracks.items.forEach((track: any) => {
          const t = {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            duration: track.duration_ms,
            imgSrc: track.album.images[2].url,
          };
          this._cacheTrack(t);
          tracks.push(t);
        });

        return tracks;
      } catch (error: any) {
        switch (true) {
          case error instanceof AxiosError:
            throw new Error(error.response.data.message);
          default:
            throw new Error("Internal error");
        }
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
        this.outdated = true;
      } catch (error: any) {
        switch (true) {
          case error instanceof AxiosError:
            throw new Error(error.response.data.message);
          default:
            throw new Error("Internal error");
        }
      }
    },
    async addTrackToPlaylist(
      playlistId: string,
      trackId: string
    ): Promise<void> {
      try {
        await axios.post(
          `/playlists/${playlistId}/tracks`,
          {
            track: trackId,
          },
          {
            headers: {
              "SNM-AUTH": $user.token,
            },
          }
        );
        this.outdated = true;
      } catch (error: any) {
        switch (true) {
          case error instanceof AxiosError:
            throw new Error(error.response.data.message);
          default:
            throw new Error("Internal error");
        }
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
      } catch (error: any) {
        switch (true) {
          case error instanceof AxiosError:
            throw new Error(error.response.data.message);
          default:
            throw new Error("Internal error");
        }
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
      if (!this._hasLoaded()) {
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
      } catch (error: any) {
        switch (true) {
          case error instanceof AxiosError:
            throw new Error(error.response.data.message);
          default:
            throw new Error("Internal error");
        }
      }
    },
    async followPlaylist(playlistId: string): Promise<void> {
      if (!this._hasLoaded()) {
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
        switch (true) {
          case error instanceof AxiosError:
            throw new Error(error.response.data.message);
          default:
            throw new Error("Internal error");
        }
      }
    },
    async deletePlaylist(playlistId: string): Promise<void> {
      if (!this._hasLoaded()) {
        throw new Error(
          "Unable to delete this playlist because it was not loaded correctly"
        );
      }

      if (!this._isValidId(playlistId)) {
        throw new Error("Invalid playlist id");
      }

      try {
        await axios.delete(`/playlists/${playlistId}`, {
          headers: {
            "SNM-AUTH": $user.token,
          },
        });
        this.outdated = true;
      } catch (error: any) {
        switch (true) {
          case error instanceof AxiosError:
            throw new Error(error.response.data.message);
          default:
            throw new Error("Internal error");
        }
      }
    },
    async getTracksFromRecommendations(): Promise<TrackData[]> {
      try {
        const res = await axios.get(
          `/spotify/recommendations/${$user.favoriteGenres!.join(",")}`,
          {
            headers: {
              "SNM-AUTH": $user.token,
            },
          }
        );

        let tracks: TrackData[] = [];
        res.data.tracks.forEach((track: any) => {
          const t: TrackData = {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            duration: track.duration_ms,
            imgSrc: track.album.images[2].url,
          };
          this._cacheTrack(t);
          tracks.push(t);
        });

        return tracks;
      } catch (error: any) {
        switch (true) {
          case error instanceof AxiosError:
            throw new Error(error.response.data.message);
          default:
            throw new Error("Internal error");
        }
      }
    },
  },
});
