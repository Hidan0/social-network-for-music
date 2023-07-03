import mongoose from "mongoose";
import { IUser } from "./db/Users";

export {};

declare global {
  namespace Express {
    export interface Request {
      identity?: mongoose.Document<any, any, IUser>;
      isAuthor?: boolean;
    }
  }
}
