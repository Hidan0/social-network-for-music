import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../utils/swagger.json";

const swaggerRouter = express.Router();

swaggerRouter.use("/docs", swaggerUi.serve);
swaggerRouter.get("/docs", swaggerUi.setup(swaggerDocument));

export default swaggerRouter;
