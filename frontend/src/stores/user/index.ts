import { defineStore } from "pinia";
import { UserState, RegisterData, LoginData } from "./types";
import { instance as axios } from "../../utils";
import store from "store2";

export default defineStore("user", {
  state: (): UserState => ({
    token: store.get("authToken"),
    id: undefined,
    name: undefined,
    email: undefined,
    username: undefined,
    favoriteGenres: undefined,
    favoriteArtists: undefined,
  }),
  getters: {
    isLogged(): boolean {
      return !!this.token;
    },
  },
  actions: {
    _setInfo(user: {
      username: string;
      name: string;
      email: string;
      id: string;
      favoriteGenres?: string[];
      favoriteArtists?: string[];
    }): void {
      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
      this.username = user.username;
      this.favoriteGenres = user.favoriteGenres;
      this.favoriteArtists = user.favoriteArtists;
    },
    _setToken(token: string): void {
      this.token = token;
      store({ authToken: token });
    },
    _clearToken(): void {
      this.token = undefined;
      store({ authToken: undefined });
    },
    async register(data: RegisterData): Promise<void> {
      try {
        const res = await axios.post("/auth/register", data);

        this._setInfo({
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          username: res.data.username,
        });
      } catch (error: any) {
        throw new Error(error.response.data.message);
      }
    },
    async login(data: LoginData): Promise<void> {
      try {
        const res = await axios.post("/auth/login", data);
        this._setToken(res.data.auth.sessionToken);

        this._setInfo({
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          username: res.data.username,
          favoriteGenres: res.data.favorite_genres,
          favoriteArtists: res.data.favorite_artists,
        });
      } catch (error: any) {
        throw new Error(error.response.data.message);
      }
    },
    async verify(): Promise<boolean> {
      if (!this.token) return false;

      try {
        const res = await axios.get("/auth/verify", {
          headers: {
            "SNM-AUTH": this.token,
          },
        });

        if (
          !res.data.isValid ||
          (!this.name && !this.email && !this.username && !this.id)
        ) {
          this._clearToken();
          return false;
        }
      } catch (error: any) {
        throw new Error(error.response.data.message);
      }

      return true;
    },
    async getUsernameFromUserId(id: string): Promise<string> {
      try {
        const res = await axios.get(`/users/${id}`, {
          headers: {
            "SNM-AUTH": this.token,
          },
        });

        return res.data.username;
      } catch (error: any) {
        throw new Error(error.response.data.message);
      }
    },
    async getAvaiableGenres(): Promise<string[]> {
      try {
        if (store.get("genres") && store.get("genres").length > 0) {
          return store.get("genres");
        }

        const res = await axios.get(`/spotify/genres`, {
          headers: {
            "SNM-AUTH": this.token,
          },
        });

        const genres = res.data.genres;
        store({ genres: genres });
        return genres;
      } catch (error: any) {
        throw new Error(error.response.data.message);
      }
    },
    async addGenreToFavorites(genre: string): Promise<void> {
      try {
        const res = await axios.put(
          `/users/${this.id}/genres`,
          { genre: genre },
          {
            headers: {
              "SNM-AUTH": this.token,
            },
          }
        );
        this.favoriteGenres = res.data.favorite_genres;
      } catch (error: any) {
        throw new Error(error.response.data.message);
      }
    },
    async removeGenreFromFavorites(genre: string): Promise<void> {
      try {
        const res = await axios.delete(`/users/${this.id}/genres/${genre}`, {
          headers: {
            "SNM-AUTH": this.token,
          },
        });
        this.favoriteGenres = res.data.favorite_genres;
      } catch (error: any) {
        throw new Error(error.response.data.message);
      }
    },
  },
});
