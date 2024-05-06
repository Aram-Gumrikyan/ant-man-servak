import dotenv from "dotenv";
dotenv.config();

const CONFIG = {
  PORT: process.env.PORT,
  VT: {
    KEY: process.env.VT_KEY,
  },
  REDIS: {
    HOST: process.env.REDIS_HOST,
    PORT: process.env.REDIS_PORT,
  },
};

export { CONFIG };
