import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
// import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./router";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    credentials: true,
  })
);

// app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const DB_URL: string = process.env.DB_URL || "";

mongoose.Promise = Promise;
mongoose.connect(DB_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));
mongoose.connection.once("connected", () =>
  console.log("Connected to database")
);

app.use("/", router());
