import Url from "../entity/url.js";
import { OP } from "../types.js";
import { Analysis } from "./analysis.js";

export interface Analyser {
  analyzeUrl(url: Url): OP<Analysis>;
}
