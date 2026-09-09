import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import YAML from "yaml";

import authorsRoutes from "./routes/authors.routes.js";
import postsRoutes from "./routes/posts.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

const openapiFile = fs.readFileSync(
    "./docs/openapi.yaml",
    "utf8"
);

const swaggerDocument = YAML.parse(openapiFile);

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.get("/", (req, res) => {
    res.json({
        message: "MiniBlog API funcionando"
    });
});

app.use("/authors", authorsRoutes);
app.use("/posts", postsRoutes);

app.use(errorHandler);

export default app;