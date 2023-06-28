import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET || "dumb-secret";

export const randomSalt = () => crypto.randomBytes(128).toString("base64");
export const hashPwd = (salt: string, pwd: string) => {
  return crypto
    .createHmac("sha256", [salt, pwd].join("/"))
    .update(SECRET)
    .digest("hex");
};
