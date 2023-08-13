import express from "express";
import { login, register, validToken } from "../controllers/auth";

const authRouter = express.Router();

/**
 * @swagger
 *
 * /api/auth/register:
 *   get:
 *     tags: ["Authentication"]
 *     summary: "Search tracks by query (AUTH required)"
 *     description: "Endpoint to search tracks by query, authentication is required"
 *     parameters:
 *       - name: "id"
 *         in: "path"
 *         required: true
 *         type: string
 *         description: "Query to search"
 * */
authRouter.post("/auth/register", register);
authRouter.post("/auth/login", login);
authRouter.get("/auth/verify", validToken);

export default authRouter;
