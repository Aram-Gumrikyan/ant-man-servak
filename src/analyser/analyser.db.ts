import Url from "../entity/url.js";
import { OP } from "../types.js";
import { Analysis } from "./analysis.js";

export interface IAnalysisDb {
  getUrlAnalysis: (url: Url) => OP<Analysis> | undefined;
  saveUrlAnalysis: (analysis: Analysis) => OP<void>;
}
