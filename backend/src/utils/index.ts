import crypto from "crypto";
import config from "./config";

export const randomSalt = () => crypto.randomBytes(128).toString("base64");
export const hashPwd = (salt: string, pwd: string) => {
  return crypto
    .createHmac("sha256", [salt, pwd].join("/"))
    .update(config.HASH_SECRET)
    .digest("hex");
};

export const getRandomElements = (arr: any[], n: number): any[] => {
  const randomIndexes: number[] = [];
  for (let i = 0; i < n; i++) {
    var randomIndex = Math.floor(Math.random() * arr.length);
    while (randomIndexes.includes(randomIndex)) {
      randomIndex = Math.floor(Math.random() * arr.length);
    }
    randomIndexes.push(randomIndex);
  }

  const randomElements = [];
  for (const randomIndex of randomIndexes) {
    randomElements.push(arr[randomIndex]);
  }

  return randomElements;
};
