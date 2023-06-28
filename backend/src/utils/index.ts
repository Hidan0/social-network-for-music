import crypto from "crypto";
import config from "./config";

export const randomSalt = () => crypto.randomBytes(128).toString("base64");
export const hashPwd = (salt: string, pwd: string) => {
  return crypto
    .createHmac("sha256", [salt, pwd].join("/"))
    .update(config.HASH_SECRET)
    .digest("hex");
};
