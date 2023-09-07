import express from "express";
import cors from "cors";

import errorRoutes from "./routes/error.routes";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/", errorRoutes);

export default app;
