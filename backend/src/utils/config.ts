import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || "";
const HASH_SECRET = process.env.HASH_SECRET || "dumb-secret";

export default {
  PORT,
  DB_URL,
  HASH_SECRET,
};
