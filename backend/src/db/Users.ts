import mongoose from "mongoose";
import regex from "../utils/regex";

export interface IUser {
  username: string;
  name: string;
  email: string;
  auth: {
    password: string;
    salt: string;
    sessionToken: string;
  };
  favorite_genres: string[];
  favorite_artists: string[];
}

const UserSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    match: [
      regex.username,
      `Please insert a valid username: ${regex.usernameDescr}`,
    ],
  },
  name: {
    type: String,
    required: true,
    match: [regex.name, `Pleanse insert a valid name: ${regex.nameDescr}`],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [regex.email, `Please insert a valid email ${regex.emailDescr}`],
  },
  auth: {
    password: {
      type: String,
      required: true,
      select: false,
    },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
  favorite_genres: { type: [String], default: [] },
  favorite_artists: { type: [String], default: [] },
});

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserByUsername = (username: string) =>
  UserModel.findOne({ username });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "auth.sessionToken": sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
export const addFavoriteGenre = (id: string, genre: string) =>
  UserModel.findByIdAndUpdate(id, {
    $addToSet: { favorite_genres: genre },
  });
export const removeFavoriteGenre = (id: string, genre: string) =>
  UserModel.findByIdAndUpdate(id, {
    $pull: { favorite_genres: genre },
  });
export const addFavoriteArtist = (id: string, artist: string) =>
  UserModel.findByIdAndUpdate(id, {
    $addToSet: { favorite_artists: artist },
  });
export const removeFavoriteArtist = (id: string, artist: string) =>
  UserModel.findByIdAndUpdate(id, {
    $pull: { favorite_artists: artist },
  });
