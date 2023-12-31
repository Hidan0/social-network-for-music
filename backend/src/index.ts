import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import config from "./utils/config";

import usersRouter from "./router/users";
import playlistRouter from "./router/playlists";
import spotifyRouter from "./router/spotify";
import authRouter from "./router/authentication";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.json";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

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

app.use("/api", usersRouter);
app.use("/api", playlistRouter);
app.use("/api", spotifyRouter);
app.use("/api", authRouter);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
