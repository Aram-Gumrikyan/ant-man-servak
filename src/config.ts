import dotenv from "dotenv";
dotenv.config();

const CONFIG = {
  PORT: process.env.PORT,
  VT: {
    KEY: process.env.VT_KEY,
  },
};

export { CONFIG };
