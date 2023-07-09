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
    }): void {
      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
      this.username = user.username;
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
      const res = await axios.post("/auth/register", data);

      this._setInfo({
        id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        username: res.data.username,
      });
    },
    async login(data: LoginData): Promise<void> {
      const res = await axios.post("/auth/login", data);

      this._setToken(res.data.auth.sessionToken);

      this._setInfo({
        id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        username: res.data.username,
      });
    },
    async verify(): Promise<boolean> {
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

      return true;
    },
  },
});
