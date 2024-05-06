import axios from "axios";
import { CONFIG } from "../config.js";

const instance = axios.create({
  baseURL: "https://www.virustotal.com/api/v3/",
  headers: {
    "x-apikey": CONFIG.VT.KEY,
    accept: "application/json",
  },
});

export default instance;
