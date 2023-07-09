export interface UserState {
  token: string | undefined;
  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  username: string | undefined;
}

export interface RegisterData {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}
