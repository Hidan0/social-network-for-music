import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./router";

import config from "./utils/config";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());

app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}`);
});

mongoose.Promise = Promise;
mongoose.connect(config.DB_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));
mongoose.connection.once("connected", () =>
  console.log("Connected to database")
);

app.use("/", router());
