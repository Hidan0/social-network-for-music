import express from "express";
import { login, register, validToken } from "../controllers/auth";

const authRouter = express.Router();

authRouter.post("/auth/register", register);
authRouter.post("/auth/login", login);
authRouter.get("/auth/verify", validToken);

export default authRouter;
