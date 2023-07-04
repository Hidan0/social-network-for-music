import mongoose from "mongoose";
import { IUser } from "./db/Users";
import { IPlaylist } from "./db/Playlists";

export {};

declare global {
  namespace Express {
    export interface Request {
      identity?: mongoose.Document<any, {}, IUser>;
      playlist?: mongoose.Document<any, {}, IPlaylist>;
    }
  }
}
