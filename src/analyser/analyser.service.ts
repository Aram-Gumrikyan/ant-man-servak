import Url from "../entity/url.js";
import { IAnalysisDb } from "./analyser.db.js";
import { Analyser } from "./analyser.js";

export class AnalyserService {
  constructor(private analyserEngin: Analyser, private db: IAnalysisDb) {}

  public async getUrlAnalysis(url: Url) {
    const analyzeCache = await this.db.getUrlAnalysis(url);

    if (analyzeCache) {
      return analyzeCache;
    }

    const analysis = await this.analyserEngin.analyzeUrl(url);
    await this.db.saveUrlAnalysis(analysis);
    return analysis;
  }
}
