import express from "express";
import { CONFIG } from "./config.js";
import { setupSocket } from "./socket/index.js";

const app = express();

app.use(express.json());

const server = app.listen(CONFIG.PORT, () => {
  console.log(`Server listening on port ${CONFIG.PORT}`);
});

setupSocket(server);
