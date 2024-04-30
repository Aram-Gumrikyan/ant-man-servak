import express from "express";
import { CONFIG } from "./config.js";
import AnalysesController from "./controllers/analyses.controller.js";

const app = express();

app.use(express.json());

app.use("/analyses", AnalysesController);

app.listen(CONFIG.PORT, () => {
  console.log(`Server listening on port ${CONFIG.PORT}`);
});
