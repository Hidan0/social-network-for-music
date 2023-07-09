import express from "express";
import { login, register, validToken } from "../controllers/auth";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.post("/auth/verify", validToken);
};
