import express, { response } from "express";
import VtAnalyser from "../virus-total/vt.analyser.js";
import IpAddress from "../entity/ip-address.js";
import Url from "../entity/url.js";
import Analyser from "../analyser/analyser.js";
const router = express.Router();

router.post("/ip", async (req, res) => {
  console.log(req.body);
  // const vtAnalyser = new VtAnalyser();
  // const response = await vtAnalyser.getIpInfo(new IpAddress("18.165.140.88"));
  // res.json(response);
});

router.post("/url", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    res.json({ status: 400, message: "incorrect data" });
  }

  const vtAnalyser = new VtAnalyser();
  const response = await vtAnalyser.getUrlInfo(new Url(url));
  res.json(response);
});

export default router;
// https://www.facebook.com/search/top/?q=anna
