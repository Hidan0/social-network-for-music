import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || "";
const HASH_SECRET = process.env.HASH_SECRET || "dumb-secret";
const CLIENT_ID = process.env.CLIENT_ID || "";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "";

export default {
  PORT,
  DB_URL,
  HASH_SECRET,
  CLIENT_ID,
  CLIENT_SECRET,
};
