import { CONFIG } from "../config.js";
import Url from "../entity/url.js";
import CustomError from "../errors/custom.error.js";
import ERROR_CODES from "../errors/error-codes.js";
import { IAnalysisDb } from "./analyser.db.js";
import { Analysis } from "./analysis.js";
import { createClient } from "redis";

export class AnalysisRepository implements IAnalysisDb {
  private client: ReturnType<typeof createClient> | undefined;
  private expirationSeconds = 3 * 24 * 60 * 60;

  private constructor() {}

  static async getInstance() {
    const instance = new AnalysisRepository();
    await instance.setup();
    return instance;
  }

  private async setup() {
    if (!this.client) {
      this.client = await createClient({
        socket: { host: CONFIG.REDIS.HOST, port: +(CONFIG.REDIS.PORT || 6379) },
      })
        .on("error", (err) => console.log("Redis Client Error", err))
        .connect();
    }

    return this;
  }

  private checkClient() {
    if (!this.client) {
      throw new CustomError(
        ERROR_CODES.INTERNAL_ERROR,
        "redisClient not defined"
      );
    }
  }

  async getUrlAnalysis(url: Url) {
    this.checkClient();
    const cachedResult = await this.client?.GET(url.getUrl());
    if (!cachedResult) {
      return;
    }
    return JSON.parse(cachedResult);
  }

  saveUrlAnalysis(analysis: Analysis) {
    this.checkClient();
    const analysisObject = analysis.toPlainObject();
    this.client?.SET(analysisObject.url, JSON.stringify(analysisObject), {
      EX: this.expirationSeconds,
    });
  }
}
