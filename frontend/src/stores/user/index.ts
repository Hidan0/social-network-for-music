import { defineStore } from "pinia";
import { UserState, RegisterData, LoginData } from "./types";
import { instance as axios } from "../../utils";

export default defineStore("user", {
  state: (): UserState => ({
    token: undefined,
    id: undefined,
    name: undefined,
    email: undefined,
    username: undefined,
  }),
  getters: {
    isLogged: (state): boolean => !!state.token,
  },
  actions: {
    _setInfo(user: Partial<UserState>): void {
      this.token = user?.token;
      this.id = user?.id;
      this.name = user?.name;
      this.email = user?.email;
      this.username = user?.username;
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

      this._setInfo({
        id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        username: res.data.username,
        token: res.data.auth.sessionToken,
      });
    },
  },
});
