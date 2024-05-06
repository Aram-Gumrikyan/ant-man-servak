import Url from "../entity/url.js";
import { IEngineAnalysis, SECURE_LEVEL } from "./types.js";

export class Analysis {
  constructor(
    private url: Url,
    private secureLevel: SECURE_LEVEL,
    private engineAnalysis: IEngineAnalysis
  ) {}

  public toPlainObject() {
    return {
      url: this.url.getUrl(),
      secureLevel: this.secureLevel,
      engineAnalysis: this.engineAnalysis.toPlainObject(),
    };
  }
}
